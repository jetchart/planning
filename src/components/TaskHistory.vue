<template>
  <div>
    <table class="table table-results">
      <thead>
      <tr>
        <th scope="col" align="left">#</th>
        <th scope="col" align="left">Task</th>
        <th scope="col" align="center">Description</th>
        <th scope="col" align="center">Result</th>
        <th scope="col" v-if="administrator" align="center">Delete</th>
      </tr>
      </thead>
      <tbody class="results">
      <tr v-for="task in tasks">
        <td align="left">{{task.task.id}}</td>
        <td align="left">{{task.task.title}}</td>
        <td align="left">{{task.task.description}}</td>
        <td align="left">{{task.task.value}}</td>
        <td align="left" v-if="administrator"><b-icon icon="trash" class="pointer" @click="showDeleteModal(task.task)" ></b-icon></td>
        <!--<td align="left"><b-icon icon="trash" class="pointer" @click="$emit('sendDeleteTask', task.task.id)" v-b-tooltip.hover title="Delete task (also delete for other users)"></b-icon></td>-->
      </tr>
      </tbody>
    </table>
    <!-- Modal confirm delete -->
    <b-modal ref="deleteModal" title="Delete task" centered @ok="$emit('sendDeleteTask', taskToDelete.id)">
      <p>Delete the task <b>{{taskToDelete.title}}</b>?</p>
    </b-modal>
  </div>
</template>

<script>

  export default {
    name: 'TaskHistory',
    props: ['tasks', 'administrator'],
    data () {
      return {
        taskToDelete: {},
      }
    },
    mounted() {
    },
    methods: {
      showDeleteModal(task) {
        this.taskToDelete = task;
        this.$refs.deleteModal.show();
      }
    },
    watch: {
    },
    components: {  }
  }
</script>

<style>

  .table-results {
    margin-top: 1rem;
    font-size: 12px;
  }

  .results {
    max-height: 100px;
    overflow-y: scroll;
  }

  .pointer {
    cursor: pointer;
  }
</style>
