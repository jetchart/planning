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
        <table class="table table-results">
          <thead>
          <tr>
            <th scope="col" align="left">User</th>
            <th scope="col" align="center">Vote</th>
          </tr>
          </thead>
          <tbody class="results">
            <tr v-for="value in values">
              <td align="left">{{value.user.name}}</td>
              <td align="center">{{value.value}}</td>
            </tr>
          </tbody>
        </table>
        <div class="input-group mb-3">
          <input type="text" v-model="finalValue" class="form-control" placeholder="Final value" aria-describedby="finalValue">
          <div class="input-group-append">
            <button :disabled="workflowStatus != 4 || !finalValue" @click="confirmTask()" class="btn btn-outline-success" type="button" id="finalValue-addon2"><b-icon icon="check"></b-icon></button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" align="left">
      <div class="col">
        <h4>
          Task to evaluate
          <b-button :disabled="workflowStatus != 1 && workflowStatus != 5" @click="openModalNewTask()" pill variant="primary" size="sm"><b-icon icon="plus"></b-icon></b-button>
        </h4>
        Task: {{task.title}}<br>
        Descripcion: {{task.description}}
      </div>
    </div>
    <div v-if="tasks.length > 0" class="row" align="left">
      <div class="col">
        <table class="table table-results">
          <thead>
          <tr>
            <th scope="col" align="left">Task</th>
            <th scope="col" align="center">Description</th>
            <th scope="col" align="center">Result</th>
            <th scope="col" align="center">Delete</th>
          </tr>
          </thead>
          <tbody class="results">
          <tr v-for="task in tasks">
            <td align="left">{{task.task.title}}</td>
            <td align="left">{{task.task.description}}</td>
            <td align="left">{{task.value}}</td>
            <td align="left"><b-icon icon="trash"></b-icon></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="modalFinalValue" title="Votation result" ok-only centered @hide="hide()">
      <p class="my-4">The final value is: <b>{{finalValue}}</b></p>
    </b-modal>
    <b-modal ref="newTaskModal" title="New task" centered @ok="newTask()">
      <input type="text" placeholder="Title" v-model="task.title"/>
      <input type="text" placeholder="Description" v-model="task.description"/>
    </b-modal>
  </div>
</template>

<script>
  import Card from './Card';

  export default {
    name: 'Cards',
    props: ['socket', 'user', 'options'],
    data () {
      return {
        value: null,
        finalValue: null,
        values: [],
        confirmed: false,
        confirmedTask: false,
        tasks: [],
        task: {},
        workflowStatus: 1, /* 1: init, 2: vote, 3: confirm vote, 4: sendResult */
      }
    },
    mounted() {
      this.getValue();
      this.getReset();
      this.getFinalValue();
      this.getNewTask();
    },
    methods: {
      sendCard(value) {
        this.value = value;
        this.workflowStatus = 3;
      },
      openModalNewTask() {
        this.$refs.newTaskModal.show();
      },
      newTask() {
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
      confirm() {
        const data = {  user: this.user,  value: this.value };
        this.socket.emit('SEND_CONFIRM', data);
        this.values.push(data);
        this.value = null;
        this.confirmed = true;
        this.workflowStatus = 4;
      },
      getValue() {
        this.socket.on('VALUE_CONFIRM', (data) => {
          this.values.push(data);
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
    components: { Card, }
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
