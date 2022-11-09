<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetProfilesForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.profileName};
  },
  mounted() {
    this.value = '';
  },
  methods: {
    async submit() {
      const urlFreets = this.value ? `/api/freets?author=${this.value}` : `/api/freets?author=${$store.state.username}`;
      const urlFollow = this.value ? `/api/follow?username=${this.value}` : '/api/follow';
      const urlReputation = this.value ? `/api/reputation?username=${this.value}` : '/api/reputation';
      const urlIsReputable = this.value ? `/api/reputation/isReputable?username=${this.value}` : `/api/reputation/isReputable?username=${$store.state.username}`;
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

        this.$store.commit('setProfileName', this.value);
        this.$store.commit('updateFollowers', resFollow.followObj.followers);
        this.$store.commit('updateFollowing', resFollow.followObj.following);
        this.$store.commit('updateUpvoters', resReputation.reputationObj.upvoters);
        this.$store.commit('updateUpvoting', resReputation.reputationObj.upvoting);
        this.$store.commit('updateDownvoters', resReputation.reputationObj.downvoters);
        this.$store.commit('updateDownvoting', resReputation.reputationObj.downvoting);
        this.$store.commit('updateIsReputable', resIsReputable.isReputable);
        this.$store.commit('updateProfileFreets', resFreets);
      } catch (e) {
        if (this.value === this.$store.state.ProfileName) {
          // This section triggers if you filter to a profileName but they
          // change their username when you refresh
          this.$store.commit('setProfileName', null);
          this.value = ''; // Clear filter to show user profile
          this.$store.commit('refreshFollowCondition');
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
