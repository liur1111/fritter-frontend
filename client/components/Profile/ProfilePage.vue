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
      <GetFollowButton 
        v-if="$store.state.profileName !== $store.state.username"
        :username="$store.state.username"
        :profileName="$store.state.profileName"
      />
      <GetReputationButton
        v-if="($store.state.profileName !== $store.state.username) && $store.state.isReputable"
        :username="$store.state.username"
        :profileName="$store.state.profileName"
      />
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
