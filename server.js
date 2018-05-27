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

const database ={
  users:[
  {
    id: '123',
    name: 'John',
    email: 'john@gmail.com',
    password: 'cookies',
    entries: 0,
    joined: new Date()
  },
  {
    id: '124',
    name: 'Sally',
    email: 'sally@gmail.com',
    password: 'apples',
    entires: 0,
    joined: new Date()
  }
 ]
}


app.get('/', (req, res)=>{
  res.send(database.users)
})

app.post('/signin', (req, res)=>{
  if(req.body.email === database.users[0].email &&
     req.body.password === database.users[0].password){
       res.json(database.users[0]);
     }else{
       res.status(400).json('error logging in')
     }
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
