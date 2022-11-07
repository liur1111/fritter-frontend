<!-- Form for getting freets (all, from user) (inline style) -->
<template>
  <div>
    <button v-if="isFollowing" @click="unFollow">
      Unfollow
    </button>
    <button v-else @click="follow">
      Follow
    </button>
  </div>
</template>

<script>
export default {
  name: 'GetFollowButton',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * Return True if following, False otherwise
     */
    isFollowing() {
      return this.$store.state.followers.includes(this.username);
    }
  },
  methods: {
    /**
     * Follow another profile
     */
    async unFollow() {
      const url = '/api/follow';
      const parameters = { 
        method: 'DELETE', 
        body: JSON.stringify({'username': this.username}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateFollowers', this.$store.state.followers.filter((name) => name !== this.username));
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async follow() {
      /**
       * Unfollow another profile
       */
      const url = '/api/follow';
      const parameters = {
        method: 'PUT',
        body: JSON.stringify({'username': this.username}), 
        headers: {'Content-Type': 'application/json'}
      };
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        this.$store.commit('updateFollowers', [...this.$store.state.followers, this.username]);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }

  }
};
</script>

