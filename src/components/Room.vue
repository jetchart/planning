<template>
  <div>
    <div class="row">
    <div class="col" align="center">
      <div class="card bg-light mb-3" style="max-width: 20rem;">
        <div class="card-header">Join to room</div>
        <div class="card-body" >
          <div class="card-title">
            <div class="form-group" align="left">
              <label for="name">Name</label>
              <input v-model="user.name" v-on:keyup.enter="subscribe()" type="text" class="form-control" id="name">
            </div>
            <div class="form-group" align="left">
              <label for="room">Room</label>
              <input v-model="user.room" v-on:keyup.enter="subscribe()" type="text" class="form-control" id="room">
            </div>
            <button :disabled="!user.name || !user.room" class="btn btn-primary" @click="subscribe()">Join</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Rooms',
    props: ['socket', 'user'],
    data () {
      return {
        connected: false,
      }
    },
    mounted() {
    },
    methods: {
      subscribe() {
        if (!this.user.name || !this.user.room)
          return;
        this.$store.commit('join',this.user);
        this.socket.emit('subscribe', this.user);
        this.$emit('save', this.user);
      }
    },
    watch: {
    },
    components: { }
  }
</script>

<style>
</style>
