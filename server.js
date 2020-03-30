var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var os = require("os");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.get('/clients', (req, res) => {
  res.send(Object.keys(io.sockets.clients().connected))
})

io.on('connection', socket => {
  console.log(`A user connected with socket id ${socket.id}`);

  socket.broadcast.emit('user-connected', socket.id)

  socket.on('subscribe', (user) => {
    console.log('Subscribe', user);
    socket.join(user.room);
  });

  socket.on('SEND_MESSAGE', (data) => {
    socket.in(data.user.room).emit('MESSAGE', data);
  });

  socket.on('SEND_NEW_TASK', (data) => {
    socket.in(data.user.room).emit('NEW_TASK', data);
  });

  socket.on('SEND_DELETE_TASK', (data) => {
    socket.in(data.user.room).emit('DELETE_TASK', data);
  });

  socket.on('SEND_FINAL_VALUE', (data) => {
    socket.in(data.user.room).emit('FINAL_VALUE', data);
  });

  socket.on('SEND_CONFIRM', (data) => {
    socket.in(data.user.room).emit('VALUE_CONFIRM', data);
  });

  socket.on('SEND_RESET', (data) => {
    socket.in(data.user.room).emit('RESET', data);
  });

  socket.on('disconnect', () => {
    console.log('socket: disconnected');
    socket.broadcast.emit('user-disconnected', socket.id)
  })

  socket.on('confirm', (value) => {
    console.log('socket: disconnected');
    socket.broadcast.emit('confirm', {
      value: value,
      user: socket.id
    })
  })

  socket.on('nudge-client', data => {
    console.log('llegó el nudge al socket');
    socket.broadcast.to(data.to).emit('client-nudged', data)
  })
})

const port = process.env.PORT || 3000
http.listen(port , () => {
  console.log('Hostname:', os.hostname());
  console.log(`Listening on port: ${port}`)
})
