const mongoose = require('mongoose');
var user = require('./auth-model');
const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

var url = 'mongodb://localhost/user-authentication';

mongoose.connect(url, function (err, db) {
  if (err) {

      console.log('Unable to connect to the mongoDB server. Error:', err);
  }

  else {
      console.log('Connection established to', url);
  }
});

const app = express();
const server = require('http').createServer(app);

server.listen(process.env.PORT || 3000); 

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/register', (req, res)=>{
  res.status(200);
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res)=>{
  res.status(200);
  res.sendFile(__dirname + '/login.html');
});

app.post('/register', (req, res)=>{
  new user({
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      PhoneNumber: req.body.PhoneNumber,
      Email: req.body.Email,
      Password: req.body.Password,
  }).save(function(err, doc){
      if(err){
           res.status(400).send('Uh-Oh! Something Went Wrong');
           console.log(err);
      }else{
          res.send('You have been registered successfully!');
          console.log('You have been registered successfully!');
      }
  });
});

app.post('/login', (req, res)=>{
  user.findOne({ PhoneNumber: req.body.PhoneNumber})
      .exec(function (err, loginuser) {
        if (err) {
          res.status(400).send('Uh-Oh! Something Went Wrong');
        } else if (!loginuser) {
          res.status(401).send('User not found!');
        }
        bcrypt.compare(req.body.Password, loginuser.Password, function (err, result) {
          if (result === true) {
            res.status(200).send('Login Successful!');
            
            //res.send(loginuser.toJSON());

          } else {
            res.status(400).send('Password is incorrect!');
          }
        })
      });
});