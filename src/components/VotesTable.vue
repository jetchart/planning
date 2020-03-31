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
      <tr v-for="value in values">
        <td align="left">{{value.user.name}}</td>
        <td align="center">{{workflowStatus > 3 ? value.value : '?'}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

  export default {
    name: 'VotesTable',
    props: ['values', 'workflowStatus'],
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
