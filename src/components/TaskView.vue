<template>
  <div>
    <h5>
      Task to evaluate
      <b-button v-if="administrator && !(workflowStatus != 1 && workflowStatus != 5)" @click="$emit('openModalNewTask', false)" pill variant="primary" size="sm" v-b-tooltip.hover title="Create a new task"><b-icon icon="plus"></b-icon></b-button>
      <b-button v-if="administrator && (workflowStatus == 2 || workflowStatus == 3 || workflowStatus == 4)" @click="$emit('openModalNewTask', true)" pill variant="primary" size="sm" v-b-tooltip.hover title="Create a new task"><b-icon icon="pencil"></b-icon></b-button>
    </h5>
    <small>
      <b>Task: </b>{{task.title}}<br>
      <b>Descripcion: </b>{{task.description}}
    </small>
  </div>
</template>

<script>

  export default {
    name: 'TaskView',
    props: ['task', 'workflowStatus', 'administrator'],
    data () {
      return {
      }
    },
    mounted() {
    },
    methods: {
    },
    watch: {
    },
    components: {  }
  }
</script>

<style>

</style>
