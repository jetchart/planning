<template>
  <div>
    <room v-if="!getConnected" :socket="socket" :user="user" @setUser="setUser($event)"></room>
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
        user: {},
        url: process.env.VUE_APP_URL_EXPRESS_SERVER || 'localhost:3000',
        socket : io('https://planning-vue.herokuapp.com/'),
        //socket : io('localhost:3000'),
        options: [0.5, 1, 2, 3, 5]
      }
    },
    computed: {
      ...mapGetters([ 'getUser', 'getConnected', 'getSocket'])
    },
    methods: {
      readParameters() {
        this.user = {name: this.$route.query.name, room: this.$route.query.room}
      },
      setUser(user) {
        this.user = user;
        if (!this.user.name || !this.user.room)
          return;
        this.subscribe();
      },
      subscribe() {
        this.$store.commit('join',this.user);
        this.socket.emit('subscribe', this.user);
        window.scrollTo(0, 0);
      },
    },
    mounted() {
      console.log('Express Server:', process.env);
      this.$store.commit("setSocket", this.socket);
      this.readParameters();
      console.log(localStorage.getItem('name'));
      this.user.name = localStorage.getItem('name') || '';
      this.user.room = localStorage.getItem('room') || '';
      if (this.user.name && this.user.room)
        this.subscribe();
    },
    watch: {
    },
    components: { Cards, Room, Chat }
  }
</script>

<style>
</style>
