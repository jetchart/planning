<template>
  <div class="chat">
    <div v-if="!collapse" class="card">
      <div class="card-header" align="right">
        <b-button class="btn btn-sm btn-secondary" @click="toggleCollapse()">
          <b-icon icon="box-arrow-in-down-left"></b-icon>
          <b-badge v-if="messagesNoReaded > 0" variant="light">{{messagesNoReaded}}</b-badge>
        </b-button>
      </div>
      <div class="card-body chat-no-collapse" align="left" @mouseover="algo()">
        <div class="card-title messages">
          <div>
            <div class="row" v-for="message in messages">
              <div class="col">
                <b>{{message.user.name}}:</b> {{message.message}}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="input-group input-group-sm">
            <input type="text" v-model="message" v-on:keyup.enter="sendMessage()" class="form-control" placeholder="Message"/>
            <div class="input-group-append">
              <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="!message" @click="sendMessage()">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="chat-collapse">
      <div align="right">
        <button class="btn btn-sm btn-primary" @click="toggleCollapse()">
          <b-icon icon="box-arrow-in-up-left"></b-icon>
          <b-badge v-if="messagesNoReaded > 0" variant="light">{{messagesNoReaded}}</b-badge>
        </button>
      </div>
    </div>
  </div>

</template>

<script>

  import {mapGetters} from "vuex";

  export default {
    name: 'Chat',
    props: ['socket', 'user'],
    computed: {
      ...mapGetters([ 'getSocket'])
    },
    data () {
      return {
        messages: [],
        message: '',
        collapse: true,
        messagesNoReaded:  0,
      }
    },
    mounted() {
      this.socket = this.getSocket;
      this.getMessage();
    },
    methods: {
      algo() {
        console.log("algo");
        this.messagesNoReaded = 0;
      },
      toggleCollapse() {
        this.collapse = !this.collapse;
        this.messagesNoReaded = 0;
      },
      sendMessage() {
        if (!this.message)
          return;
        const data = {  user: this.user,  message: this.message };
        this.socket.emit('SEND_MESSAGE', data);
        this.message = '';
        this.messages.push(data);
      },
      getMessage() {
        this.socket.on('MESSAGE', (data) => {
          this.messages = [...this.messages, data];
          this.messagesNoReaded++;
        });
      },
    },
    watch: {
    },
    components: { }
  }
</script>

<style>

  .chat {
    position: fixed;
    bottom:0px;
    right:0px;
    font-size: 14px;
    z-index: 999;
  }

  .chat-collapse {
    border: none !important;
    margin: 0.5rem;
  }

  .chat-no-collapse {
    padding: 0.5rem !important;
  }

  .send {
    position: absolute;
    bottom:0px;
  }

  .messages {
    height: 12rem;
    width: 18rem;
    overflow-x: hidden;
    overflow-y: scroll;
  }

</style>
