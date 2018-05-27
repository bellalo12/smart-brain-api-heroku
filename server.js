const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
       res.json('success');
     }else{
       res.status(400).json('error logging in')
     }
})

app.post('/register', (req, res)=>{
  database.users.push({
    id: '125',
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res)=>{
  let found = false;
  database.users.map(user=>{
    if(user.id === req.params.id){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
    res.status(400).json('no such user')
  }
})

app.put('/image',(req, res)=>{
  let found = false;
  database.users.map(user=>{
    if(user.id === req.body.id){
      found = true;
      user.entries ++
      return res.json(user.entries);
    }
  })
  if(!found){
    res.status(400).json('no such user')
  }
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
