<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link 
        style="text-decoration: none; color: #F5F8FA" 
        to="/"
      >
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        style="text-decoration: none; color: #F5F8FA"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-if="$store.state.username"
        style="text-decoration: none; color: #F5F8FA"
        :to="{name: 'Profile', params: {name: $store.state.username}}"
      >
        <span v-on:click="goToProfile">Profile</span>
      </router-link>
      <router-link
        v-else
        style="text-decoration: none; color: #F5F8FA"
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<!-- Form for getting freets (all, from user) (inline style) -->

<script>
export default {
  name: 'NavBar',
  props: {},
  data() {
    return {};
  },
  created() {
  },
  methods: {
    goToProfile() {
      this.$store.commit('updateProfileFreets', []);
      this.update();
    },
    async update() {
      // console.log(this.$store.state.profileName);
      const urlFreets = `/api/freets?author=${this.$store.state.username}`;
      const urlFollow = `/api/follow?username=${this.$store.state.username}`;
      const urlReputation = `/api/reputation?username=${this.$store.state.username}`;
      const urlIsReputable = `/api/reputation/isReputable?username=${this.$store.state.username}`;
      try {
        const rFreets = await fetch(urlFreets);
        const resFreets = await rFreets.json();
        
        if (!rFreets.ok) {
          throw new Error(resFreets.error);
        }
        const rFollow = await fetch(urlFollow);
        const resFollow = await rFollow.json();
        
        if (!rFollow.ok) {
          throw new Error(resFollow.error);
        }

        const rReputation = await fetch(urlReputation);
        const resReputation = await rReputation.json();
        
        if (!rReputation.ok) {
          throw new Error(resReputation.error);
        }

        const rIsReputable = await fetch(urlIsReputable);
        const resIsReputable = await rIsReputable.json();
        
        if (!rIsReputable.ok) {
          throw new Error(resIsReputable.error);
        }

        this.$store.commit('setProfileName', this.$store.state.username);
        this.$store.commit('updateFollowers', resFollow.followObj.followers);
        this.$store.commit('updateFollowing', resFollow.followObj.following);
        this.$store.commit('updateUpvoters', resReputation.reputationObj.upvoters);
        this.$store.commit('updateUpvoting', resReputation.reputationObj.upvoting);
        this.$store.commit('updateDownvoters', resReputation.reputationObj.downvoters);
        this.$store.commit('updateDownvoting', resReputation.reputationObj.downvoting);
        this.$store.commit('updateIsReputable', resIsReputable.isReputable);
        this.$store.commit('updateProfileFreets', resFreets);
      } catch (e) {
        if (this.$store.state.username === this.$store.state.ProfileName) {
          // This section triggers if you filter to a profileName but they
          // change their username when you refresh
          this.$store.commit('setProfileName', null);
          this.value = ''; // Clear filter to show user profile
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.$store.state.username = this.$store.state.profileName;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>


<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #1DA1F2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
    color: #F5F8FA;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
