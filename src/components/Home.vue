<template>
  <div>
    <room v-if="!getConnected" :socket="socket" @save="setUser($event)"></room>
    <cards v-if="getConnected" :socket="socket" :user="user" :options="options"></cards>
    <chat v-if="getConnected"  :socket="socket" :user="user"></chat>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import Cards from './Cards';
  import Room from './Room';
  import Chat from './Chat';
  import {mapGetters} from "vuex";

  export default {
    name: 'Home',
    data () {
      return {
        user: null,
        message: '',
        messageReceived: '',
        users: [],
        socket : io('localhost:3000'),
        options: [0.5, 1, 2, 3, 5]
      }
    },
    computed: {
      ...mapGetters([ 'getUser', 'getConnected', ])
    },
    methods: {
      setUser(user) {
        this.user = user;
        this.users.push(this.socket.id);
      },
    },
    mounted(){
      this.socket.on('message', msg => {
        this.messageReceived = msg;
      });
      this.socket.on('user-connected', user => {
        this.users.push(user);
      });
      this.socket.on('user-disconnected', id => {
        let i = 0;
        let index = 0;
        this.users.forEach(user => {
          if (user == id)
            index = i;
          i++;
        });
        this.users.splice(index, 1)
      })
      this.socket.on('init', init => {
        console.log('INIT:', init);
      })
    },
    watch: {
      'socket': function(){
        this.users.push(this.socket.id);
      }
    },
    components: { Cards, Room, Chat }
  }
</script>

<style>
</style>
