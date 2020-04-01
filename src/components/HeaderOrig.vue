<template>
  <div class="header">
    <div class="row header-row">
      <div class="col" align="left">
        <!--<img width="50" height="45" class="logo" src="../../public/assets/j.jpg" alt="">-->
        <span class="brand">PLANNING POKER</span>
      </div>
      <div v-if="getConnected" class="col" align="right">
        <b-dropdown dropleft size="sm" class="m-2" variant="secondary" toggle-class="text-decoration-none" >
          <template v-slot:button-content>
            <b-icon icon="person-fill"></b-icon>
          </template>
          <b-dropdown-text><small><b>Name: </b>{{getUser.name}}</small></b-dropdown-text>
          <b-dropdown-text><small><b>Room: </b>{{getUser.room}}</small></b-dropdown-text>
          <b-dropdown-item href="#"><b-icon @click="quit()" variant="danger" icon="power"></b-icon></b-dropdown-item>
        </b-dropdown>
      </div>
      <div v-else class="col no-connected" align="right">
        <small>No connected</small>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from "vuex";

  export default {
    name: 'Header',
    data () {
      return {
        user: null,
      }
    },
    methods: {
      quit() {
        this.getSocket.emit('unsubscribe');
        this.$store.commit("unjoin");
      },
    },
    computed: {
      ...mapGetters([ 'getUser', 'getConnected', 'getSocket'])
    },
    mounted(){
    },
  }
</script>

<style>

  .header {
    height: 5rem;
    padding: 20px;
    text-align: center;
    background: #252932;
    color: white;
    //text-transform: uppercase;
    font-size: 1rem;
    font-family: Montserrat,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-weight: 700;
    -webkit-box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
    box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
  }

  .no-connected {
  }

  .logo {
    border-radius: 0.5em;
  }

  .header-row {
    align-items: center;
    vertical-align: middle;
  }

  .brand {
  }

</style>
