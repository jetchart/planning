<template>
  <div>
    <room  :user="user" @setUser="setUser($event)"></room>
  </div>
</template>

<script>
  import Cards from './Cards';
  import Room from './Room';
  import Chat from './Chat';
  import {mapGetters} from "vuex";

  export default {
    name: 'Home',
    data () {
      return {
        user: {},
        options: [0.5, 1, 2, 3, 5]
      }
    },
    computed: {
      ...mapGetters([ 'getConnected', 'getSocket'])
    },
    methods: {
      readParameters() {
        this.user = {name: this.$route.params.name, room: this.$route.params.room}
      },
      setUser(user) {
         this.goToPlanning()
      },
      goToPlanning() {
        this.$router.push('/planning/' + this.user.room + '/' + this.user.name)
        //his.$router.push({ name: 'planning', params: { room: this.user.room, name: this.user.name }})
      },
      makeToast(variant, title, description) {
        this.$bvToast.toast(description, {
          title: title,
          variant: variant,
          solid: true
        });
        window.scrollTo(0, 0);
      },
      toastExists() {
        if (this.$store.exists)
          this.makeToast('danger', 'User exist', `There is another user with the same name`);
        this.$store.exists = null;
      },
    },
    mounted() {
      this.readParameters();
      this.toastExists();
    },
    watch: {
    },
    components: { Cards, Room, Chat }
  }
</script>

<style>
</style>
