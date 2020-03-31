<template>
  <div class="container">
    <div class="row">
      <div class="col" v-for="option in options">
        <div style="max-width: 10rem;">
          <card :valueCard="option" :valueSelected="value" :confirmed="confirmed" :confirmedTask="confirmedTask" :workflowStatus="workflowStatus" @confirm="confirm()" @sendCard="sendCard($event)"></card>
        </div>
      </div>
      <div class="col-3">
        <div class="col">
          <b-form-checkbox v-model="administrator" name="check-button" switch><small>Administrator?</small></b-form-checkbox>
          <!--<button v-if="administrator && !(workflowStatus != 2 && workflowStatus != 3 && workflowStatus != 4)" class="btn btn-outline-danger btn-sm" @click="reset()" v-b-tooltip.hover title="Reset all votes from current task (reset also for other users)"><b-icon icon="trash"></b-icon></button>-->
        </div>
        <votes-table :connections="connections" :workflowStatus="workflowStatus"></votes-table>
        <div v-if="administrator && workflowStatus == 4" class="input-group input-group-sm mb-3">
          <input type="number" :disabled="workflowStatus != 4" v-model="finalValue" class="form-control" placeholder="Final value" aria-describedby="finalValue">
          <div class="input-group-append">
            <button :disabled="workflowStatus != 4 || !finalValue" @click="confirmTask()" class="btn" v-bind:class="{'btn-outline-success': allVotes, 'btn-outline-danger': !allVotes}" type="button" id="finalValue-addon2" v-b-tooltip.hover title="Send the deciding vote"><b-icon icon="check"></b-icon></button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" align="left">
      <div class="col">
        <task-view :administrator="administrator" :workflowStatus="workflowStatus" :task="task" @openModalNewTask="openModalNewTask()"></task-view>
      </div>
    </div>
    <div class="row" align="left">
      <div class="col">
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
      this.getValue();
      this.getReset();
      this.getFinalValue();
      this.getNewTask();
      this.getDeleteTask();
      this.getSync();
      this.getSyncTasks();
    },
    methods: {
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
        })
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
          if (this.connections.length === 1) {
            this.makeToast('primary', 'Administrator', `You have automatically become an administrator`);
            this.administrator = true;
          }
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
    width: 4rem;
  }

  .table-results {
    margin-top: 1rem;
    font-size: 12px;
  }

  .results {
    max-height: 100px;
    overflow-y: scroll;
  }
</style>
