<template>
  <div class="card bg-light mb-3">
    <div class="card-header"><b>{{valueCard}}</b></div>
    <div class="card-body">
      <div class="card-title">
        <button-card :valueCard="valueCard" :valueSelected="valueSelected" :confirmed="confirmed" :workflowStatus="workflowStatus" :confirmedTask="confirmedTask" @confirm="confirm()" @sendCard="sendCard($event)"></button-card>
      </div>
    </div>
  </div>
</template>

<script>

  import ButtonCard from './ButtonCard';

  export default {
    name: 'Card',
    props: ['valueCard', 'valueSelected', 'confirmedTask', 'confirmed', 'workflowStatus'],
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
    components: { ButtonCard }
  }
</script>

<style>
</style>
