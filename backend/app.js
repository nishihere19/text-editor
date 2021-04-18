const express = require('express');
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user")
const documentRouter = require("./routes/document")
const mongoose = require("mongoose");
const cors = require('cors')
const http = require('http');
const jwt = require("jsonwebtoken");
//const io = require('socket.io')();
const cookieParser = require('cookie-parser')
require('dotenv').config()
const middleware= require('./middleware/auth')

const {MONGOURI, JWT_SECRET} = require('./key/db');


mongoose.connect(MONGOURI).then(() => console.log("Connected to database."));

let whitelist = ['http://localhost:3000']
let corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

let tokenVerifier = (middleware, req, res, next) => {
  //console.log(req.user);
  if (req.originalUrl.startsWith('/api/document')) {
    const token = req.cookies['token']
    try {
      const decoded = jwt.verify(token,(req.user._id,JWT_SECRET));
      req.user._id = decoded.id
      req.user.email = decoded.email
    } catch (e) {
      res.send({
        status: 200,
        msg: 'Unauthorized'
      })
      return
    }
  }
  next()
}

app.use(cookieParser())
app.use(cors(corsOptions));
// var handlecors=function(options){
//   return (function(req, res,next) {

//       res.header('Access-Control-Allow-Origin', '*');
//       res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//       res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//       res.header("Access-Control-Allow-Credentials", true);
    
//       if ('OPTIONS' == req.method) {
//           res.status(200);
//       }
//       else {
//           next();
//       }
//     })
// }
// app.use(handlecors(corsOptions))
// var resolveCrossDomain=(function(req, res,next) {

//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", true);

//   if ('OPTIONS' == req.method) {
//       res.status(200);
//   }
//   else {
//       next();
//   }
// })
//   app.use(resolveCrossDomain);
  
app.use(tokenVerifier)
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/document', documentRouter);



const server = http.createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  },
  allowEIO3: true
  //transports: ["websocket"],
});
const socketService = require('./service/socketService')(io)
io.attach(server, {cookie: false})

server.listen(8000, function () {
  console.log('App listening on port 8000!')
})
