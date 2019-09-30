const express = require('express')
const http=require('http')
const socket=require('socket.io')
const { db, Users, Data} = require('./db')
const session = require('express-session')
const passport = require('./setuppassport')
// const adminrouter = require('./ad-route')
// const { insertMsg, getAllMsg } = require('./chatdb')
const app = express()

const server=http.createServer(app)
const io=socket(server)

app.use('/', express.static(__dirname + '/public'))
app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: 'k2h4b 6k24h j6 b24kj6b 24kj6b 2',
    resave: false,
    saveUninitialized: true
  })
)
// must come after session middleware
app.use(passport.initialize())
app.use(passport.session())



const {MongoClient}=require('mongodb')
const url='mongodb://localhost:27017'

const connectdb=(dbname)=>{
    return MongoClient.connect(url).then(client=>client.db(dbname))
}

const insertMsg=(msg)=>
    connectdb('chatdb')
    .then(db=>db.collection('chat').insertOne(msg))


const getAllMsg=()=>
    connectdb('chatdb')

const getCustommsg=()=>
    connectdb('chatdb')

module.exports={getAllMsg, insertMsg}

function checkLoggedIn(req, res, next) {
  if (req.user) {
    return next()
  }
  res.redirect('/login')
}


app.get('/home', (req, res) => {
  const isAdmin=req.user.isAdmin
  res.render('home', { isAdmin })
})

app.get('/signup', (req, res) => res.render('signup'))
app.post('/signup', (req, res) => {
 var password;
  if(req.body.password1==req.body.password2){
      password=req.body.password

      
  Users.create({
   
    username: req.body.username,
    email: req.body.email,
        password: password,
    isAdmin: false
  })
    .then((user) => {
      console.log(user)
      res.redirect('/home')
    })
    .catch((err) => {
      console.error(err)
      res.redirect('/signup')
    })
  }
  else{
    res.send("Password Donot match")
  }
})

app.get('/login', (req, res) => {
  if(req.user){
    res.send('Already Logged In <br> <a href="/home">Back to home</a>')
  }
  else{
    res.render('login')
  }
})
app.post(
  '/login',
  passport.authenticate('users', {
    successRedirect: '/home',
    failureRedirect: '/login'
  })
)

app.get('/logout', function(req, res){
  if(req.user){
    req.logout()
    res.redirect('/login')
  }
  else{
    res.send('Login first <br> <a href="/home">Back to home</a')
  }
});

app.get('/profile', checkLoggedIn, (req, res) => {
  Data.findOne({
    where: {
      email: req.user.email
    }
  })
  .then((info)=>{
    console.log(info)
    res.render('profile', {
      data: req.user,
      info
    })
  })
})

app.get('/admin', checkLoggedIn, (req, res)=>{
  Users.findAll({
    where: {
      isAdmin: false
    },
    raw: true
  })
  .then((users)=>{
    // console.log(users)
    res.render('add-del', {users})
  })
})
// -------------------------------------------------------------
app.get('/getusers', (req, res)=>{
  Users.findAll({
    where: {
      isAdmin: false
    },
    raw: true
  })
  .then((users)=>{
    // console.log(users)
    res.send({users})
  })
})
// -------------------------------------------------------------
app.get('/userdata', checkLoggedIn, (req, res)=>{
  Data.findOne({
    where: {
      name: req.query.name
    },
    raw: true
  })
  .then((result)=>{
    console.log(result);
    res.send(result)
  })
})

app.get('/edit', checkLoggedIn, (req,res)=>{
  Data.findOne({
    where: {
      name: req.query.name
    },
    raw: true
  })
  .then((body)=>{
    console.log(body)
    let name=req.query.name
    res.render('edit', {name, body})
  })
})

app.get('/delete', checkLoggedIn, (req, res)=>{
  Users.destroy({
    where: {
      email: req.query.email
    }
  })
  .catch((err) => res.send(err))
  Data.destroy({
    where: {
      email: req.query.email
    }
  })
  .then(() => res.redirect('/admin'))
  .catch((err) => res.send(err))
})

app.post('/editdb', checkLoggedIn, (req, res)=>{
  Data.update({
    dob: req.body.dob,
    pob: req.body.pob,
    gender: req.body.gender,
    fathername: req.body.fathername,
    mothername: req.body.mothername,
    paddress: req.body.padd,
    taddress: req.body.tadd,
    nationality: req.body.nationality,
    phone: req.body.phone,
    course: req.body.course
  },
  {
    where: {
      email: req.body.email
    }
  })
    .then((data) => {
      console.log(data)
      res.redirect(`/admin`)
    })
    .catch((err) => {
      console.error(err)
      res.send(err)
    })
  // Data.update({
  //   req.body.detname: req.body.detvalue
  // })
  // .then(()=>{
  //   res.sendStatus(200)
  // })
})

app.get('/about', (req,res)=>{
  res.sendFile(__dirname + '/public/about.html')
})

app.get('/contact', (req,res)=>{
  res.sendFile(__dirname + '/public/contact.html')
})

app.post('/userinput', checkLoggedIn, (req, res)=>{
  Data.create({
    name: req.body.fname + ' ' + req.body.lname,
    dob: req.body.dob,
    pob: req.body.pob,
    gender: req.body.gender,
    fathername: req.body.fathername,
    mothername: req.body.mothername,
    paddress: req.body.padd,
    taddress: req.body.tadd,
    nationality: req.body.nationality,
    email: req.body.email,
    phone: req.body.phone,
    course: req.body.course
  })
    .then((data) => {
      console.log(data)
      res.redirect('/profile')
    })
    .catch((err) => {
      console.error(err)
      res.send('error')
    })
})

io.on('connection', (socket)=>{
  socket.on('sendChat', (data)=>{
    insertMsg({
      To: data.To,
      from: data.from,
      msg: data.msg
    })
    .then(()=>{
      socket.emit('chatSaved', {
        from: data.from,
        msg: data.msg
      })
    })
  })
  socket.on('custommsg', (data)=>{
    getCustommsg()
    .then(db=>db.collection('chat').find({$or: [ {from: data.usernam}, {To: data.usernam} ]}))
    .then(b => b.toArray())
    .then(msgs => {
      socket.emit('customdata', {
        name: data.usernam,
        messages: msgs
      })
    })
  })
})

app.get('/enquiry', checkLoggedIn, (req, res)=>{
  var current_user=req.user.username
  const isAdmin=req.user.isAdmin
  getAllMsg()
  .then(db=>db.collection('chat').find({$or: [ {from: current_user}, {To: current_user} ]}))
  .then(b => b.toArray())
  .then(msgs => {
    res.render('chat', { msgs, current_user, isAdmin })
  })
})

const port=process.env.PORT

db.sync().then(() => {
  server.listen(port, () => {
    console.log('Server started on http://localhost:8787/login')
  })
})