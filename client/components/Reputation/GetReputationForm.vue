<template>
  <div>
    <button id="button-info" @click="open">
      <b>{{ upvoters.length - downvoters.length }}</b>
    </button>
    &nbsp;Reputation
    <GetReputationPopUp 
      v-if="this.isOpen == true"
      @close="close"
      :upvoters="this.upvoters" 
      :downvoters="this.downvoters"
      :upvoting="this.upvoting" 
      :downvoting="this.downvoting"
    />
  </div>
</template>

<script>
import GetReputationPopUp from '@/components/Reputation/GetReputationPopUp.vue';

export default {
  name: 'GetReputationForm',
  components: {GetReputationPopUp},
  props: {
    upvoters: {
      type: Array,
      required: true
    }, 
    upvoting: {
      type: Array,
      required: true
    }, 
    downvoters: {
      type: Array,
      required: true
    }, 
    downvoting: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      uppers: this.upvoters,
      downers: this.downvoters,
      upping: this.upvoting,
      downing: this.downvoting
    };
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },

  }
};
</script>
