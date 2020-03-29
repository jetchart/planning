<template>
  <div class="header">
    <div class="row">
      <div class="col-2" align="left">
        <img width="50" height="45" class="logo" src="../assets/j.jpg" alt="">
      </div>
      <template v-if="getConnected" >
        <div class="col-5"></div>
        <div class="col-2" align="right">
          <span>User: {{getUser.name}}</span>
        </div>
        <div class="col-2" align="right">
          <span>Room: {{getUser.room}}</span>
        </div>
        <div class="col-1" align="right">
          <b-button @click="quit()" size="sm" variant="danger" class="mb-2">
            <b-icon icon="power"></b-icon>
          </b-button>
        </div>
      </template>
      <div v-else class="col-10 no-connected" align="right">
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
        this.$store.commit("unjoin");
      },
    },
    computed: {
      ...mapGetters([ 'getUser', 'getConnected', ])
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
    background: #1abc9c;
    color: white;
    text-transform: uppercase;
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

</style>
