<template>
  <div>
    <button id="button-info" @click="open">
      <b>{{ usernames.length }}</b>
    </button>
    &nbsp;{{ this.type }}
    <GetFollowPopUp 
      v-if="this.isOpen == true"
      @close="close"
      :type="this.type" 
      :usernames="this.usernames"
    />
  </div>
</template>

<script>
import GetFollowPopUp from '@/components/Follow/GetFollowPopUp.vue';

export default {
  name: 'GetFollowForm',
  components: {GetFollowPopUp},
  props: {
    type: {
      type: String,
      required: true
    },
    usernames: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      list: this.usernames
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

<style>
#button-info {
  background: transparent;
  color: black;
  border: none !important;
  font-family: inherit;
  font-size: inherit;
}
</style>