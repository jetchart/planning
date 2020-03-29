<template>
  <div>
    <h5>
      Task to evaluate
      <b-button :disabled="workflowStatus != 1 && workflowStatus != 5" @click="$emit('openModalNewTask', null)" pill variant="primary" size="sm"><b-icon icon="plus"></b-icon></b-button>
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
    props: ['task', 'workflowStatus', ],
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
