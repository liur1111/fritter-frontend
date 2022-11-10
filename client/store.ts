import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    replies: [], // All replies given freetId
    profileFreets: [], // All freets to show up under profilePage for user
    profileName: null, // Username of profilePage
    followers: [], // All followers under profilePage
    following: [], // All following of profilePage
    upvoters: [], // All upvoters under profilePage
    upvoting: [], // All upvoting of profilePage
    downvoters: [], // All downvoters under profilePage
    downvoting: [], // All downvoting of profilePage
    isReputable: false, // True if can upvote/downvote, False otherwise
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setProfileName(state, profileName) {
      /**
       * Update the stored profileName to the specified one.
       * @param profileName - new profileName to set
       */
      state.profileName = profileName;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateProfileFreets(state, profileFreets) {
      /**
       * Update the stored profileFreets in profilePage to the provided freets.
       * @param profileFreets - Freets to store
       */
      state.profileFreets = profileFreets;
    },
    updateFollowers(state, followers) {
      /**
       * Update the stored followers in profilePage to the provided followers.
       * @param followers - followers to store
       */
      state.followers = followers;
    },
    updateFollowing(state, following) {
      /**
       * Update the stored following in profilePage to the provided following.
       * @param following - following to store
       */
      state.following = following;
    },
    updateUpvoters(state, upvoters) {
      /**
       * Update the stored upvoters in profilePage to the provided upvoters.
       * @param upvoters - upvoters to store
       */
      state.upvoters = upvoters;
    },
    updateUpvoting(state, upvoting) {
      /**
       * Update the stored upvoting in profilePage to the provided upvoting.
       * @param upvoting - upvoting to store
       */
      state.upvoting = upvoting;
    },
    updateDownvoters(state, downvoters) {
      /**
       * Update the stored downvoters in profilePage to the provided downvoters.
       * @param downvoters - downvoters to store
       */
      state.downvoters = downvoters;
    },
    updateDownvoting(state, downvoting) {
      /**
       * Update the stored downvoting in profilePage to the provided downvoting.
       * @param downvoting - downvoting to store
       */
      state.downvoting = downvoting;
    },
    updateIsReputable(state, isReputable) {
      /**
       * Update the stored isReputable of a profilePage to the provided isReputable.
       * @param isReputable - isReputable to store
       */
      state.isReputable = isReputable;
    },
    async updateReplies(state, freetId) {
      /**
       * Update the stored replies of a freet given the freetId.
       * @param freetId - freetId of the freet
       */
      const url = `/api/replies?freetId=${freetId}`;
      const res = await fetch(url).then(async r => r.json());
      state.replies = res;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
