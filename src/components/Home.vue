<template>
  <div>
    <room v-if="!getConnected" :socket="socket" :user="user" @save="setUser($event)"></room>
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
        socket : io('10.4.116.46:3000'),
        options: [0.5, 1, 2, 3, 5]
      }
    },
    computed: {
      ...mapGetters([ 'getUser', 'getConnected', ])
    },
    methods: {
      setUser(user) {
        this.user = user;
      },
      readParameters() {
        this.user = {name: this.$route.query.name, room: this.$route.query.room}
      },
    },
    mounted() {
      this.readParameters();
    },
    watch: {
    },
    components: { Cards, Room, Chat }
  }
</script>

<style>
</style>
