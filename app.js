const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const joi = require('joi');

const app = express();


app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});


app.post('/', (req, res)=>{
    const schema = joi.object().keys({
        email : joi.string().trim().email().required(),
        password : joi.string().min(6).max(15).required()
    });
    joi.validate(req.body, schema, (err, result)=>{
        if(err){
            console.log(err);
            res.send('An error occured');
        }
        console.log(result);
        res.send('Successful');
    });
});

app.listen(3000);