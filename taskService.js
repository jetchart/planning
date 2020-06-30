const _ = require('lodash');
const connectionService = require('./connectionService')

module.exports = {
  filterAllByRoom: function (room, tasks) {
    return _.filter(tasks, con => con && con.room == room);
  },
  findById: function (id, tasks) {
    return _.find(tasks, con => con.task.id == id);
  },
  deleteById: function (id, tasks) {
    _.remove(tasks, con => con && con.task.id == id)
  },
  countDownRemoveTasks(connections, room, tasks, miliseconds) {
    console.log("The room " + room + " will be removed in " + miliseconds + " miliseconds");
    setTimeout(() => {
      if (connectionService.filterAllByRoom(room, connections).length == 0) {
        let tasksRoom = this.filterAllByRoom(room, tasks);
        console.log("Room " + room + " tasks: ");
        console.log(tasksRoom);
        tasksRoom.forEach(task => {
          this.deleteById(task.task.id, tasks);
        });
        console.log("The room " + room + " has been removed");
      } else {
        console.log("The room " + room + " has not been removed because there are users connected");
      }
    }, miliseconds);
  },
};
