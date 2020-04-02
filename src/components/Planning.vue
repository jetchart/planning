<template>
  <div>
    <cards v-if="getSocket && getUser" :socket="getSocket" :user="getUser" :options="options"></cards>
    <chat  v-if="getSocket && getUser" :socket="getSocket" :user="getUser"></chat>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import Cards from './Cards';
  import Room from './Room';
  import Chat from './Chat';
  import {mapGetters} from "vuex";

  export default {
    name: 'Planning',
    data () {
      return {
        user: {},
        url: process.env.VUE_APP_URL_EXPRESS_SERVER || 'localhost:3000',
        //socket : io('https://planning-vue.herokuapp.com/'),
        //socket : io('localhost:3000'),
        options: [0.5, 1, 2, 3, 5]
      }
    },
    computed: {
      ...mapGetters([ 'getUser', 'getSocket'])
    },
    methods: {
      readParameters() {
        this.user = {name: this.$route.query.name, room: this.$route.query.room}
      },
      subscribe() {
        console.log(this.user);
        this.$store.commit('join',this.user);
        this.socket.emit('subscribe', this.user);
        window.scrollTo(0, 0);
      },
    },
    mounted() {
      this.user.name = this.$route.params.name;
      this.user.room = this.$route.params.room;
      if (!this.user.name || !this.user.room)
        this.$router.push("/");
      this.socket = this.getSocket;
      if (!this.socket) {
        this.socket = io('localhost:3000');
        this.$store.commit("setSocket", this.socket);
      }
      this.subscribe();
    },
    watch: {
    },
    components: { Cards, Room, Chat }
  }
</script>

<style>
</style>
