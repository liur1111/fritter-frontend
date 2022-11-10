<!-- Form for getting freets (all, from user) (inline style) -->
<template>
  <div>
    <div>
      <button class="current-action" v-if="isUpvoting" @click="removeUpvote">
        ▲
      </button>
      <button id="button-action" v-else @click="upvote">
        ▲
      </button>
    </div>
    <div>
      <button class="current-action" v-if="isDownvoting" @click="removeDownvote">
        ▼
      </button>
      <button id="button-action" v-else @click="downvote">
        ▼
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetReputationButton',
  props: {
    username: {
      type: String,
      required: true
    },
    profileName: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * Return True if upvoting, False otherwise
     */
    isUpvoting() {
      return this.$store.state.upvoters.includes(this.username);
    },
    /**
     * Return True if downvoting, False otherwise
     */
    isDownvoting() {
      return this.$store.state.downvoters.includes(this.username);
    }
  },
  methods: {
    /**
     * Un-upvote another profile
     */
    async removeUpvote() {
      const url = '/api/reputation/removeUpvote';
      const parameters = { 
        method: 'DELETE', 
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateUpvoters', this.$store.state.upvoters.filter((name) => name !== this.username));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    /**
     * Upvote another profile
     */
     async upvote() {
      const url = '/api/reputation/upvote';
      const parameters = { 
        method: 'PUT', 
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateUpvoters', [...this.$store.state.upvoters, this.username]);
        this.$store.commit('updateDownvoters', this.$store.state.downvoters.filter((name) => name !== this.username));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    /**
     * Un-downvote another profile
     */
     async removeDownvote() {
      const url = '/api/reputation/removeDownvote';
      const parameters = { 
        method: 'DELETE', 
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateDownvoters', this.$store.state.downvoters.filter((name) => name !== this.username));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    /**
     * Downvote another profile
     */
     async downvote() {
      const url = '/api/reputation/downvote';
      const parameters = { 
        method: 'PUT', 
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateDownvoters', [...this.$store.state.downvoters, this.username]);
        this.$store.commit('updateUpvoters', this.$store.state.upvoters.filter((name) => name !== this.username));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }

  }
};
</script>

<style>
#button-action {
  background: transparent;
  border-color: transparent;
  cursor: pointer;
}

.current-action {
  background: transparent;
  border-color: #1DA1F2;
  cursor: pointer;
}
</style>
