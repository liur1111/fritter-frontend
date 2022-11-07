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
    profileFreets: [], // All freets to show up under profilePage for user
    profileName: null, // Username of profilePage
    followers: [], // All followers under profilePage
    following: [], // All following of profilePage
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
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshFollowCondition(state) {
      /**
       * Request the server for the currently available follow status.
       */
      const urlFollowObj = state.profileName ? `/api/follow?username=${state.profileName}` : '/api/follow';
      const resFollowObj = await fetch(urlFollowObj).then(async r => r.json());
      state.followers = resFollowObj.followers;
      state.following = resFollowObj.following;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
