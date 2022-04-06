const express = require('express');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const Message = require('./models');

let db_url =
  'mongodb+srv://armaani69:j9N5MtFFRDFDxHj@cluster0.qzjz1.mongodb.net/messages';

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    console.log(err);
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  let message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  });
});

// app.get('/messages/:user', (req, res) => {
//   var user = req.params.user;
//   Message.find({ name: user }, (err, messages) => {
//     res.send(messages);
//   });
// });

io.on('connection', (error) => {
  console.log('A user is connected and the error type is', error.message);
});

mongoose.connect(db_url, { useNewUrlParser: true }, (error) => {
  console.log('Connected to MongoDB with error type', error);
});

try {
  let server = http.listen(3000, () => {
    console.log('The server is running in port', server.address().port);
  });
} catch (error) {
  console.log(error);
}
