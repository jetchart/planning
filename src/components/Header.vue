<template>
  <header >
    <nav class="navbar navbar-expand-lg navbar-light">
      <a class="brand navbar-brand" href="#">Planning Poker</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <div v-if="getConnected" align="right">
              <b-dropdown z-index="999" dropleft size="sm" class="m-2" variant="secondary" toggle-class="text-decoration-none" >
                <template v-slot:button-content>
                  <b-icon icon="person-fill"></b-icon>
                </template>
                <b-dropdown-text><small><b>Name: </b>{{getUser.name}}</small></b-dropdown-text>
                <b-dropdown-text><small><b>Room: </b>{{getUser.room}}</small></b-dropdown-text>
                <b-dropdown-item href="#"><b-icon @click="quit()" variant="danger" icon="power"></b-icon></b-dropdown-item>
              </b-dropdown>
            </div>
            <div v-else class="no-connected" align="right">
              <small>No connected</small>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
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

  header {
    overflow:hidden; /* Eliminamos errores de float */
    background:#252932;
    margin-bottom:20px;
    -webkit-box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
    box-shadow: 0px -12px 14px 10px rgba(0,0,0,0.75);
  }

  .wrapper {
    width:90%; /* Establecemos que el ancho sera del 90% */
    max-width:1000px; /* Aqui le decimos que el ancho máximo sera de 1000px */
    margin:auto; /* Centramos los elementos */
    overflow:hidden; /* Eliminamos errores de float */
  }

  header .logo {
    color:#f2f2f2;
    font-size:50px;
    float:left;
  }

  header nav {
    float:right;
  }

  .list {
    z-index: 999;
  }

  .brand {
    float: left !important;
  }

  header nav a {
    display:inline-block;
    color:#fff;
    background:#f56f3a;
    border-radius:50px;
    text-decoration:none;
    padding:10px 20px;
    font-size:20px;
    font-weight:bold;
    -webkit-transition:all 500ms ease;
    -o-transition:all 500ms ease;
    transition:all 500ms ease;
  }

  header nav a:hover {
    background:orange;
  }

</style>
