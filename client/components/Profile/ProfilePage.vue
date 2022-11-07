Default page that also displays profiles

<template>
  <main>
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
        class="left"
        v-if="$store.state.profileName !== $store.state.username"
        :username="$store.state.username"
      />
      <GetFollowForm 
        :type="Followers"
        :usernames="$store.state.followers"
      />
      <GetFollowForm 
        :type="Following"
        :usernames="$store.state.following"
      />
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

export default {
  name: 'ProfilePage',
  components: {FreetComponent, GetProfilesForm, GetFollowButton, GetFollowForm},
  mounted() {
    // this.$store.commit('refreshFollowCondition');
    this.$refs.getProfilesForm.submit();
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
</style>
