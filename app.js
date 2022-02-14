const express=require('express');
const { use } = require('express/lib/application');
const jwt = require('jsonwebtoken')
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
var nodemailer = require('nodemailer');
let user={
    id:"lakdfvbnkj2424t2",
    email:"andreirogie67@gmail.com",
    password:"Andreirogie-78"
}
const JWT_SECRET = 'some super secret...'
app.get('/',(req,res)=>{
    res.send('Hello')
})
app.get('/forgot-password',(req,res,next)=>{
    res.render('forgot-password');
})
app.post('/forgot-password',(req,res,next)=>{
    const {email}=req.body;
    //
    if(email!==user.email){
        res.send('user not registered');
        return;
    }
    //
    const secret = JWT_SECRET +user.password
    const payload={
        email:user.email,
        id: user.id
    }
    const token =jwt.sign(payload,secret,{expiresIn: '15m'})
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    console.log(link)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'andreirogie67@gmail.com',
          pass: 'Andreirogie-78'
        }
      });
      
      var mailOptions = {
        from: 'andreirogie67@gmail.com',
        to: user.email,
        subject: 'Reset password',
        text: link
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.send('Password reset link has been sent to ur email...');

})
app.get('/reset-password/:id/:token',(req,res,next)=>{
    const {id,token}=req.params;
    if(id!==user.id){
        res.send('invalid id..')
        return
    }
    const secret = JWT_SECRET + user.password
    try{
        const payload=jwt.verify(token,secret)
        res.render('reset-password',{email:user.email})
    }catch(error){
        console.log(error.message);
        res.send(error.message);
    }
})
app.post('/reset-password/:id/:token',(req,res,next)=>{
    const {id,token} = req.params;
    const {password,password2}=req.body;
    //
    if(id!==user.id){
        res.send('invalid id...');
        return;
    }
    const secret=JWT_SECRET+user.password
    try{
        const payload = jwt.verify(token,secret);
        //
        user.password=password;
        res.send(user);
    }catch(error){
        console.log(error.message)
        res.send(error.message)
    }
})
app.listen(3000,()=>console.log('http://localhost:3000'));