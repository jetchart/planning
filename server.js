var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const connectionService = require('./connectionService')
const taskService = require('./taskService')

var os = require("os");
var connections = [];
var tasks = [];
var task = null;

io.on('connection', socket => {
	
	//io.set('close timeout', 60*60*24);	

  console.log(`A user connected with socket id ${socket.id}`);

  /************* CONECTIONS **************/

  socket.on('subscribe', (user) => {

    //Check if exists other user with same name and room
    const existsOtherByNameAndRom = connectionService.existsOtherByNameAndRom(socket.id, user.name, user.room, connections);
    if (existsOtherByNameAndRom != null) {
      io.to(socket.id).emit('REDIRECT');
      return;
    }

    //Check if exist
    const connection = connectionService.findById(socket.id, connections);
    if (connection === undefined) {
      socket.join(user.room);
      connections.push({'id': socket.id, 'user': user});
    }
    const connectionsRoom = connectionService.filterAllByRoom(user.room, connections);
    socket.in(user.room).emit('SYNC', connectionsRoom);
    io.to(socket.id).emit('SYNC', connectionsRoom);
    /* If there is a task evaluating, send it */
    if (task)
      io.to(socket.id).emit('NEW_TASK', task);
    /* Sync tasks */
    let tasksRoom = taskService.filterAllByRoom(user.room, tasks);
    io.to(socket.id).emit('SYNC_TASKS', tasksRoom);

    console.log('connections', connectionsRoom);
    console.log('tasks', tasksRoom);
  });

  socket.on('unsubscribe', () => {
    const connection = connectionService.findById(socket.id, connections);
    if (connection != null && connection.user.room != null) {
      /* SYNC */
      connectionService.deleteById(connection.id, connections);
      socket.in(connection.user.room).emit('SYNC', connectionService.filterAllByRoom(connection.user.room, connections));
      /* Delete tasks if nobody in room */
      if (connectionService.filterAllByRoom(connection.user.room, connections).length == 0) {
        console.log("Delete tasks from room " + connection.user.room);
        let tasksRoom = taskService.filterAllByRoom(connection.user.room, tasks);
        tasksRoom.forEach(task => {
          taskService.deleteById(task.task.id, tasks);
        });
      }
    }
  });

  socket.on('disconnect', () => {
    //console.log('socket: disconnected');
    const connection = connectionService.findById(socket.id, connections);
    if (connection != null && connection.user.room != null) {
      /* SYNC */
      connectionService.deleteById(connection.id, connections);
      socket.in(connection.user.room).emit('SYNC', connectionService.filterAllByRoom(connection.user.room, connections));
      /* Delete tasks if nobody in room */
      if (connectionService.filterAllByRoom(connection.user.room, connections).length == 0) {
        console.log("Delete tasks from room " + connection.user.room);
        let tasksRoom = taskService.filterAllByRoom(connection.user.room, tasks);
        tasksRoom.forEach(task => {
          taskService.deleteById(task.task.id, tasks);
        });
        // Delete task
        task = null;
      }
    }
  });
  
  /************* CHAT **************/

  socket.on('PING', (data) => {
    console.log("ping!", data);
  });

  /************* CHAT **************/

  socket.on('SEND_MESSAGE', (data) => {
    socket.in(data.user.room).emit('MESSAGE', data);
  });

  /************* VOTES **************/

  socket.on('SEND_FINAL_VALUE', (data) => {
    socket.in(data.user.room).emit('FINAL_VALUE');
    //Reset votes
    connectionService.resetVotes(data, connections);
    //Send users without votes
    let connectionsRoom = connectionService.filterAllByRoom(data.user.room, connections);
    io.to(socket.id).emit('SYNC', connectionsRoom);
    socket.in(data.user.room).emit('SYNC', connectionsRoom);
    /* Tasks */
    task = null;
    tasks.push({'room': data.user.room, 'task': data.task});
    let tasksRoom = taskService.filterAllByRoom(data.user.room, tasks);
    io.to(socket.id).emit('SYNC_TASKS', tasksRoom);
    socket.in(data.user.room).emit('SYNC_TASKS', tasksRoom);
  });

  socket.on('SEND_CONFIRM', (data) => {
    connectionService.updateVote(socket.id, data, connections);
    let connectionsRoom = connectionService.filterAllByRoom(data.user.room, connections);
    io.to(socket.id).emit('VALUE_CONFIRM', connectionsRoom);
    socket.in(data.user.room).emit('VALUE_CONFIRM', connectionsRoom);

  });

  /************* TASKS **************/

  socket.on('SEND_NEW_TASK', (data) => {
    task = data;
    socket.in(data.user.room).emit('NEW_TASK', data);
  });

  socket.on('SEND_DELETE_TASK', (data) => {
    //socket.in(data.user.room).emit('DELETE_TASK', data);
    /* Delete task */
    const task = taskService.findById(data.id, tasks);
    if (task != null && task.room != null) {
      taskService.deleteById(task.task.id, tasks);
      /* Sync tasks */
      let tasksRoom = taskService.filterAllByRoom(data.user.room, tasks);
      io.to(socket.id).emit('DELETE_TASK', tasksRoom);
      socket.in(data.user.room).emit('DELETE_TASK', tasksRoom);
    }
  });

  //Deprecated
  socket.on('SEND_RESET', (data) => {
    socket.in(data.user.room).emit('RESET', data);
  });

})

/************* SERVER **************/
const port = process.env.PORT || 3000
let server = http.listen(port , () => {
  console.log('Hostname:', os.hostname());
  console.log(`Listening on port: ${port}`)
});
