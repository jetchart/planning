<template>
  <div>
    <table class="table table-results">
      <thead>
      <tr>
        <th scope="col" align="left">User</th>
        <th scope="col" align="center">Vote</th>
      </tr>
      </thead>
      <tbody class="results">
      <tr v-for="connection in connections">
        <td align="left">{{connection.user.name}}</td>
        <td v-if="connection.value" align="center">{{workflowStatus > 3 ? connection.value : '?'}}</td>
        <td v-else align="center">No vote</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

  export default {
    name: 'VotesTable',
    props: ['workflowStatus', 'connections'],
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

  .table-results {
    margin-top: 1rem;
    font-size: 12px;
  }

  .results {
    max-height: 100px;
    overflow-y: scroll;
  }
</style>
