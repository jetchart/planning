const _ = require('lodash');

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
};
