Default page that also displays profiles

<template>
  <main class="view">
    <section>
      <header>
        <div class="left">
          <h2 v-if="$store.state.profileName">
            @{{ $store.state.profileName }}'s Profile
          </h2>
          <h2 v-else>
            @{{ $store.state.username }}'s Profile
          </h2>
        </div>
        <div class="right">
          <GetProfilesForm
            ref="getProfilesForm"
            value="profileName"
            placeholder="🔍 Search for a profile"
            button="🔄 Search" 
          />
        </div>
      </header>
      <header>
        <div class="left">
          <GetFollowButton 
            v-if="$store.state.profileName !== $store.state.username"
            :username="$store.state.username"
            :profileName="$store.state.profileName"
          />
        </div>
        <div class="right">
          <GetReputationButton
            v-if="($store.state.profileName !== $store.state.username) && $store.state.isReputable"
            :username="$store.state.username"
            :profileName="$store.state.profileName"
          />
        </div>
      </header>
      <header class="info-header">
        <div v-if="$store.state.profileFreets.length !== 1">
          <b>{{ $store.state.profileFreets.length }}</b> &nbsp; Freets
        </div>
        <div v-else>
          <b>{{ $store.state.profileFreets.length }}</b> &nbsp; Freet
        </div>
        <GetFollowForm 
        :type="'Followers'"
        :usernames="$store.state.followers"
        />
        <GetFollowForm 
          :type="'Following'"
          :usernames="$store.state.following"
        />
        <GetReputationForm
          :upvoters="$store.state.upvoters"
          :upvoting="$store.state.upvoting"
          :downvoters="$store.state.downvoters"
          :downvoting="$store.state.downvoting"
        /> 
      </header>
      <section>
        <h2>
          Freets
        </h2>
        <div>
          <FreetComponent 
            v-for="freet in $store.state.profileFreets"
            :key="freet.id"
            :freet="freet"
          />
        </div>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetProfilesForm from '@/components/Profile/GetProfilesForm.vue';
import GetFollowButton from '@/components/Follow/GetFollowButton.vue';
import GetFollowForm from '@/components/Follow/GetFollowForm.vue';
import GetReputationForm from '@/components/Reputation/GetReputationForm.vue';
import GetReputationButton from '@/components/Reputation/GetReputationButton.vue';

export default {
  name: 'ProfilePage',
  components: {FreetComponent, GetProfilesForm, GetFollowButton, GetFollowForm, GetReputationForm, GetReputationButton},
  mounted() {
    console.log('profile page: profileFreets', this.$store.state.profileFreets);
    // this.$refs.getProfilesForm.submit();
  },
  beforeMount(){
    this.updating();
  },
  methods: {
    async updating() {
      const urlFreets = `/api/freets?author=${this.$route.params.name}`;
      const urlFollow = `/api/follow?username=${this.$route.params.name}`;
      const urlReputation = `/api/reputation?username=${this.$route.params.name}`;
      const urlIsReputable = `/api/reputation/isReputable?username=${this.$route.params.name}`;
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

        this.$store.commit('setProfileName', this.$route.params.name);
        console.log('updating:', this.$route.params.name);
        this.$store.commit('updateProfileFreets', resFreets);
        this.$store.commit('updateFollowers', resFollow.followObj.followers);
        this.$store.commit('updateFollowing', resFollow.followObj.following);
        this.$store.commit('updateUpvoters', resReputation.reputationObj.upvoters);
        this.$store.commit('updateUpvoting', resReputation.reputationObj.upvoting);
        this.$store.commit('updateDownvoters', resReputation.reputationObj.downvoters);
        this.$store.commit('updateDownvoting', resReputation.reputationObj.downvoting);
        this.$store.commit('updateIsReputable', resIsReputable.isReputable);
        console.log('finished updating:', this.$store.state.profileFreets);
      } catch (e) {
        if (this.$route.params.name === this.$store.state.ProfileName) {
          // This section triggers if you filter to a profileName but they
          // change their username when you refresh
          this.$store.commit('setProfileName', null);
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.profileName;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.view {
  margin-left: 22.5%;
  width: 55%;
}

.info-section {
  margin-top: 1vh;
}
</style>
