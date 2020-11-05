<template>
  <div class="card bg-light mb-3">
    <div class="card-header no-padding"><b>{{valueCard}}</b></div>
    <div class="card-body padding-sm">
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

.no-padding {
  padding: 0 !important;
}

.padding-sm {
  padding: 0.5rem !important;
}
</style>
