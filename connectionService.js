const _ = require('lodash');

module.exports = {
  filterAllByRoom: function (room, connections) {
    return _.filter(connections, con => con.user && con.user.room == room);
  },
  findById: function (id, connections) {
    return _.find(connections, con => con.id == id);
  },
  updateVote: function (id, data, connections) {
    let con = _.find(connections, con => con.id == id);
    con.value = data.value;
  },
  resetVotes: function (data, connections) {
    connections.forEach(con => con.value = null);
  },
  deleteById: function (id, connections) {
    _.remove(connections, con => con.user && con.id == id)
  },
};
