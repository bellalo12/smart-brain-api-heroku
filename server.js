const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'bellalo',
    password : '',
    database : 'smart-brain-database'
  }
});


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=>{
  res.send('success')
})

app.post('/signin', (req,res)=>{
  db.select('email','hash').from('login')
  .where('email', '=', req.body.email)
  .then(data=>{
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
    if(isValid){
      return db.select('*').from('users')
      .where('email', '=', req.body.email)
      .then(user=>{
        res.json(user[0])
      })
      .catch(err=>res.status(400).json('user not found'))
    } else {
      res.status(400).json('wrong credentials')
    }
  })
  .catch(err=>res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res)=>{
  const hash = bcrypt.hashSync(req.body.password)
  db.transaction(trx=>{
    trx.insert({
      hash: hash,
      email: req.body.email
    })
    .into('login')
    .returning('email')
    .then(loginEmail=>{
      return trx('users')
       .insert({
         name: req.body.name,
         email: loginEmail[0],
         joined: new Date()
       })
       .returning('*')
       .then(user=>{
         res.json(user[0])
       })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err=>res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res)=>{
  db.select('*').from('users')
    .where('id', '=', req.params.id)
    .then(user=>{
      if(user.length){
        return res.json(user[0])
      }else{
        res.status(400).json('user not find')
      }
    })
    .catch(err=>res.status(400).json('unable to find the user'))
})

app.put('/image',(req, res)=>{
  db.select('*').from('users')
    .where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
      res.json(entries[0])
    })
    .catch(err=>res.status(400).json('fail to count'))
})






app.listen(3000, ()=>{
  console.log('running on the port 3000')
})


/*
/ --> res= this is working
/signin -->POST = success/fail
/register --> POST = user
/profile/:userId --> GET =user
/image -->PUT --> user
*/
