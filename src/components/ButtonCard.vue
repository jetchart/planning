<template>
  <div>
    <button v-if="workflowStatus == 2 && valueSelected != valueCard" class="btn btn-sm btn-outline-primary" @click="sendCard()">Select</button>
    <button v-if="(workflowStatus != 2) && valueSelected != valueCard" :disabled="true" class="btn btn-sm btn-outline-primary">Select</button>
    <button v-if="workflowStatus == 3 && valueSelected == valueCard" class="btn btn-sm btn-success" @click="confirm()">Confirm</button>
  </div>
</template>

<script>

  export default {
    name: 'Cards',
    props: ['valueCard', 'valueSelected', 'confirmed', 'confirmedTask', 'workflowStatus'],
    data () {
      return {
      }
    },
    mounted() {
    },
    methods: {
      sendCard() {
        this.$emit('sendCard', this.valueCard);
      },
      confirm() {
        this.$emit('confirm');
      },
    },
    watch: {
    },
    components: { }
  }
</script>

<style>
</style>
