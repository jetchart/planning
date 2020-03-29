<template>
  <div class="container">
    <div class="row">
      <div class="col" v-for="option in options">
        <div style="max-width: 10rem;">
          <card :valueCard="option" :valueSelected="value" :confirmed="confirmed" :confirmedTask="confirmedTask" :workflowStatus="workflowStatus" @confirm="confirm()" @sendCard="sendCard($event)"></card>
        </div>
      </div>
      <div class="col-3">
        <button :disabled="workflowStatus != 2 && workflowStatus != 3 && workflowStatus != 4" class="btn btn-danger btn-sm" @click="reset()"><b-icon icon="trash"></b-icon></button>
        <votes-table :values="values"></votes-table>
        <div class="input-group input-group-sm mb-3">
          <input type="number" :disabled="workflowStatus != 4" v-model="finalValue" class="form-control" placeholder="Final value" aria-describedby="finalValue">
          <div class="input-group-append">
            <button :disabled="workflowStatus != 4 || !finalValue" @click="confirmTask()" class="btn btn-outline-success" type="button" id="finalValue-addon2"><b-icon icon="check"></b-icon></button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" align="left">
      <div class="col">
        <task-view :workflowStatus="workflowStatus" :task="task" @openModalNewTask="openModalNewTask()"></task-view>
      </div>
    </div>
    <div class="row" align="left">
      <div class="col">
        <task-history :tasks="tasks" @sendDeleteTask="sendDeleteTask($event)"></task-history>
      </div>
    </div>
    <b-modal ref="modalFinalValue" title="Votation result" ok-only centered @hide="hide()">
      <p class="my-4">The final value is: <b>{{finalValue}}</b></p>
    </b-modal>
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
        values: [],
        confirmed: false,
        confirmedTask: false,
        tasks: [],
        task: {},
        temporalTask: {},
        workflowStatus: 1, /* 1: init, 2: vote, 3: confirm vote, 4: sendResult */
      }
    },
    mounted() {
      this.getValue();
      this.getReset();
      this.getFinalValue();
      this.getNewTask();
      this.getDeleteTask();
    },
    methods: {
      sendCard(value) {
        this.value = value;
        this.workflowStatus = 3;
      },
      getCalculateVotes() {
        let sum = 0;
        let average = 0;
        this.values.forEach(value => sum += value.value);
        average = sum / this.values.length;
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
      },
      reset() {
        const data = { user: this.user};
        this.socket.emit('SEND_RESET', data);
        this.values = [];
        this.value = null;
        this.confirmed = false;
        this.workflowStatus = 2;
      },
      saveHistoryTask(task, finalValue) {
        this.tasks.push({task: task, value: finalValue});
      },
      hide() {
        this.saveHistoryTask(this.task, this.finalValue);
        this.finalValue = null;
        this.values = [];
        this.value = null;
        this.workflowStatus = 1;
        this.task = {};
      },
      confirmTask() {
        this.workflowStatus = 5;
        const data = { user: this.user, finalValue: this.finalValue};
        this.socket.emit('SEND_FINAL_VALUE', data);
        this.confirmed = false;
        this.$refs.modalFinalValue.show();
      },
      sendDeleteTask(id) {
        const data = { user: this.user, id: id};
        this.socket.emit('SEND_DELETE_TASK', data);
        this.deleteTaskById(id);
      },
      deleteTaskById(id) {
        let index = 0;
        this.tasks.forEach(task => {
          console.log('task', task);
          if (task.task.id == id)
            return;
          index++;
        });
        if (index < this.tasks.length)
          this.tasks.splice(index, 1);
      },
      confirm() {
        const data = {  user: this.user,  value: this.value };
        this.socket.emit('SEND_CONFIRM', data);
        this.values.push(data);
        this.finalValue = this.getCalculateVotes();
        this.value = null;
        this.confirmed = true;
        this.workflowStatus = 4;
      },
      getValue() {
        this.socket.on('VALUE_CONFIRM', (data) => {
          this.values.push(data);
          this.finalValue = this.getCalculateVotes();
        });
      },
      getFinalValue() {
        this.socket.on('FINAL_VALUE', (data) => {
          this.finalValue = data.finalValue;
          console.log('refs', this.$refs);
          this.$refs.modalFinalValue.show();
        });
      },
      getNewTask() {
        this.socket.on('NEW_TASK', (data) => {
          this.task = data.task;
          this.workflowStatus = 2;
        });
      },
      getDeleteTask() {
        this.socket.on('DELETE_TASK', (data) => {
          this.deleteTaskById(id);
        });
      },
      getReset() {
        this.socket.on('RESET', (data) => {
          this.values = [];
          this.value = null;
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
