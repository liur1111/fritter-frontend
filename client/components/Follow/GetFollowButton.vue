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
    },
    profileName: {
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
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      const urlIsReputable = `/api/reputation/isReputable?username=${this.profileName}`;
      const urlReputation = `/api/reputation?username=${this.profileName}`;
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        const rIsReputable = await fetch(urlIsReputable);
        const resIsReputable = await rIsReputable.json();
        
        if (!rIsReputable.ok) {
          throw new Error(resIsReputable.error);
        }

        const rReputation = await fetch(urlReputation);
        const resReputation = await rReputation.json();
        
        if (!rReputation.ok) {
          throw new Error(resReputation.error);
        }

        this.$store.commit('updateFollowers', this.$store.state.followers.filter((name) => name !== this.username));
        this.$store.commit('updateIsReputable', resIsReputable.isReputable);
        this.$store.commit('updateUpvoters', resReputation.reputationObj.upvoters);
        this.$store.commit('updateUpvoting', resReputation.reputationObj.upvoting);
        this.$store.commit('updateDownvoters', resReputation.reputationObj.downvoters);
        this.$store.commit('updateDownvoting', resReputation.reputationObj.downvoting);
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
        body: JSON.stringify({'username': this.profileName}), 
        headers: {'Content-Type': 'application/json'}
      };
      const urlIsReputable = `/api/reputation/isReputable?username=${this.profileName}`;
      const urlReputation = this.value ? `/api/reputation?username=${this.value}` : '/api/reputation';
      try {
        const r = await fetch(url, parameters);
        const res = await r.json();

        const rIsReputable = await fetch(urlIsReputable);
        const resIsReputable = await rIsReputable.json();
        
        if (!rIsReputable.ok) {
          throw new Error(resIsReputable.error);
        }

        const rReputation = await fetch(urlReputation);
        const resReputation = await rReputation.json();
        
        if (!rReputation.ok) {
          throw new Error(resReputation.error);
        }

        this.$store.commit('updateFollowers', [...this.$store.state.followers, this.username]);
        this.$store.commit('updateIsReputable', resIsReputable.isReputable);
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }

  }
};
</script>

