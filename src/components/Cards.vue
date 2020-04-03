<template>
  <div class="">
    <b-overlay :show="showOverlay" rounded="sm">
    <div class="row">
      <!-- Task to evaluate -->
      <div class="col-md-8" align="left">
        <div align="left">
          <b-icon id="share" font-scale="1" icon="link" variant="secondary"></b-icon>
          <b-popover target="share" triggers="hover" placement="top">
            <template v-slot:title>Share planning!</template>
            <div class="input-group input-group-sm pop-clipboard" >
              <div class="input-group-prepend">
                <small id="url">{{urlToShare}}</small>
              </div>
              <button v-if="!showCheck" type="button" v-clipboard:copy="urlToShare" v-clipboard:success="onCopy" aria-describedby="url" class="form-control btn btn-sm btn-link " >
                <b-icon font-scale="1" icon="clipboard"  variant="secondary" ></b-icon>
              </button>
              <small v-if="showCheck"class="check" v-bind:class="{'clipboard-check': showCheck}">Copied!</small>
            </div>

          </b-popover>
          <b-form-checkbox v-model="administrator" name="check-button" switch><small>Administrator?</small></b-form-checkbox>
        </div>
        <br>
        <task-view :administrator="administrator" :workflowStatus="workflowStatus" :task="task" @openModalNewTask="openModalNewTask()"></task-view>
      </div>
      <!-- Votes table -->
      <div class="col-md-4 votes-table">
        <votes-table :connections="connections" :workflowStatus="workflowStatus"></votes-table>
        <div v-if="administrator && workflowStatus == 4" class="input-group input-group-sm mb-3">
          <input type="number" :disabled="workflowStatus != 4" v-model="finalValue" class="form-control" placeholder="Final value" aria-describedby="finalValue">
          <div class="input-group-append">
            <button :disabled="workflowStatus != 4 || !finalValue" @click="confirmTask()" class="btn" v-bind:class="{'btn-outline-success': allVotes, 'btn-outline-danger': !allVotes}" type="button" id="finalValue-addon2" v-b-tooltip.hover title="Send the deciding vote"><b-icon icon="check"></b-icon></button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row" align="center">
      <!-- Cards -->
      <div v-if="workflowStatus === 2 || workflowStatus === 3" class="col" v-for="option in options">
        <div class="planning-card">
          <card :valueCard="option" :valueSelected="value" :confirmed="confirmed" :confirmedTask="confirmedTask" :workflowStatus="workflowStatus" @confirm="confirm()" @sendCard="sendCard($event)"></card>
        </div>
      </div>
    </div>
    <div class="row" align="left">
      <!-- Task History -->
      <div class="col task-history">
        <task-history :administrator="administrator" :tasks="tasks" @sendDeleteTask="sendDeleteTask($event)"></task-history>
      </div>
    </div>
    <!-- Modal final value -->
    <b-modal ref="modalFinalValue" title="Votation result" ok-only centered @hide="hide()">
      <p class="my-4">The final value is: <b>{{finalValue}}</b></p>
    </b-modal>
    <!-- Modal new task -->
    <b-modal ref="newTaskModal" title="New task" centered @ok="newTask()">
      <div class="form-group">
        <label for="title">Task</label>
        <input v-model="temporalTask.title" type="text" class="form-control" id="title">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="temporalTask.description" class="form-control" id="description" rows="3"></textarea>
      </div>
    </b-modal>
    </b-overlay>
  </div>
</template>

<script>
  import Card from './Card';
  import TaskHistory from './TaskHistory';
  import VotesTable from './VotesTable';
  import TaskView from './TaskView';

  export default {
    name: 'Cards',
    props: ['socket', 'user', 'options'],
    components: { Card, TaskHistory, VotesTable, TaskView, },
    data () {
      return {
        urlToShare: null,
        value: null,
        finalValue: null,
        confirmed: false,
        confirmedTask: false,
        tasks: [],
        connections: [],
        task: {},
        temporalTask: {},
        administrator: false,
        showToastNewTask: false,
        showToastNewVote: false,
        showToastTaskDeleted: false,
        workflowStatus: 1, /* 1: init, 2: vote, 3: confirm vote, 4: sendResult */
        showOverlay: true,
        showCheck: false
      }
    },
    computed: {
      allVotes() {
        let all = true;
        this.connections.forEach(con => {
          if (!con.value)
            all = false;
        });
        return all;
      },
    },
    mounted() {
      this.urlToShare = window.location.href.substring(0, window.location.href.length - this.user.name.length);
      this.getValue();
      this.getReset();
      this.getFinalValue();
      this.getNewTask();
      this.getExistOtherUser();
      this.getDeleteTask();
      this.getSync();
      this.getSyncTasks();
    },
    methods: {
      onCopy() {
        this.showCheck = true;
        setTimeout(() => {  this.showCheck = false }, 2000);
      },
      sendCard(value) {
        this.value = value;
        this.workflowStatus = 3;
      },
      getCalculateVotes() {
        let sum = 0;
        let average = 0;
        let votesCount = 0;
        this.connections.forEach(con => {
          if (con.value) {
            sum += con.value
            votesCount++;
          }
        });
        average = sum / votesCount;
        if (average == 0.5)
          return average;
        return Math.round(average);
      },
      openModalNewTask() {
        this.$refs.newTaskModal.show();
      },
      newTask() {
        this.task = {id: this.tasks.length + 1, title: this.temporalTask.title, description: this.temporalTask.description, };
        this.temporalTask = {};
        const data = { user: this.user, task: this.task};
        this.socket.emit('SEND_NEW_TASK', data);
        this.workflowStatus = 2;
        this.showToastNewTask = true;
      },
      makeToast(variant, title, description) {
        this.$bvToast.toast(description, {
          title: title,
          variant: variant,
          solid: true
        });
        window.scrollTo(0, 0);
      },
      hide() {
        this.finalValue = null;
        this.value = null;
        this.workflowStatus = 1;
        this.task = {};
      },
      confirmTask() {
        this.workflowStatus = 5;
        const data = { user: this.user, finalValue: this.finalValue, task: {...this.task, value: this.finalValue}};
        this.socket.emit('SEND_FINAL_VALUE', data);
        this.confirmed = false;
        this.$refs.modalFinalValue.show();
      },
      sendDeleteTask(id) {
        const data = { user: this.user, id: id};
        this.showToastTaskDeleted = true;
        this.socket.emit('SEND_DELETE_TASK', data);
      },
      confirm() {
        const data = {  user: this.user,  value: this.value };
        this.socket.emit('SEND_CONFIRM', data);
        this.finalValue = this.getCalculateVotes();
        this.value = null;
        this.confirmed = true;
        this.workflowStatus = 4;
        this.showToastNewVote = true;
      },
      getValue() {
        this.socket.on('VALUE_CONFIRM', (connections) => {
          this.connections = connections;
          if (!this.showToastNewVote)
            this.makeToast('success', 'New vote', `A new vote have been emited`);
          this.showToastNewVote = false;
          this.finalValue = this.getCalculateVotes();
        });
      },
      getSync() {
        this.socket.on('SYNC', (data) => {
          this.connections = data;
          if (!this.administrator && this.connections.length === 1) {
            this.makeToast('primary', 'Administrator', `You have automatically become an administrator`);
            this.administrator = true;
          }
          this.showOverlay = false;
        });
      },
      getSyncTasks() {
        this.socket.on('SYNC_TASKS', (data) => {
          this.tasks = data;
        });
      },
      getFinalValue() {
        this.socket.on('FINAL_VALUE', () => {
          this.$refs.modalFinalValue.show();
        });
      },
      getNewTask() {
        this.socket.on('NEW_TASK', (data) => {
          this.task = data.task;
          this.workflowStatus = 2;
          if (!this.showToastNewTask)
            this.makeToast('secondary', 'Nwe task', 'There is a new task to be evaluated');
          this.showToastNewTask = false;
        });
      },
      getDeleteTask() {
        this.socket.on('DELETE_TASK', (data) => {
          this.tasks = data;
          if (!this.showToastTaskDeleted)
            this.makeToast('danger', 'Task deleted', `One task have been deleted`);
          this.showToastTaskDeleted = false;
        });
      },
      getExistOtherUser() {
        this.socket.on('REDIRECT', () => {
        this.$router.push('/planning/' + this.user.room);
        this.$store.exists = true;
        });
      },
      getReset() {
        this.socket.on('RESET', (data) => {
          this.value = null;
          this.finalValue = null;
          this.confirmed = false;
          this.workflowStatus = 2;
        });
      },
    },
    watch: {
    },
  }
</script>

<style>

  .planning-card {
    width: 8rem;
  }

  .adm {
    padding-bottom: 0.5rem;
  }

  .votes-table {
       max-height: 12rem;
       overflow-y: scroll;
   }

  .task-history {
    max-height: 12rem;
    overflow-y: scroll;
  }

  #share {
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  #url {
    margin: 5px;
  }

  .check {
    opacity: 0;
    transition: opacity 0.5s;
    color: mediumseagreen;
  }

  .clipboard-check {
    opacity: 1;
  }

  .popover-body {
    padding: 0.5rem 0.75rem 0 !important;
  }

  .pop-clipboard {
    align-items: center;
    vertical-align: middle;
  }

</style>
