<template>
  <!-- <script src="https://unpkg.com/vue@2"></script> -->
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container1">
        <div class="modal-header">
          {{ this.type }}
          <button class="modal-default-button" @click="$emit('close')">
            X
          </button>
        </div>
        <div class="modal-body1">
          <ul v-for="username in usernames">
            <li>
              {{ username }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetFollowPopUp',
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
      type: this.type,
      list: this.usernames
    };
  },
  methods: {

  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container1 {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body1 {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
