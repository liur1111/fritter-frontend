<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        <router-link style="text-decoration: none; color: black;" :to="{name: 'Profile', params: {name: freet.author}}">
          <span v-on:click="goToProfile">@{{ freet.author }}</span>
          <!-- @{{ freet.author }} -->
        </router-link>
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <div class="info-format">
      <p class="info left">
        Posted at {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
      <p>
        {{ this.viewCount }} {{ this.viewCount === 1 ? "View" : "Views" }}
      </p>
      <router-link style="text-decoration: none; color: black; font-weight: bold;" :to="{name: 'Replies', params: {freetId: freet._id}}">
        <span v-on:click="increaseViews">Replies</span>
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
  },
  mounted() {
    this.getViewCount();
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      viewCount: 0,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    goToProfile() {
      this.$store.commit('updateProfileFreets', []);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async increaseViews() {
      const url = '/api/views';
      const params = {
        method: 'POST',
        message: 'Successfully added view!',
        body: JSON.stringify({'freetId': this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      }
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      options.body = params.body;
      try {
        const r = await fetch(url, options);
        const res = await r.json();
      } catch (e) {

      }
    },
    async getViewCount() {
      /**
       * Returns number of views on freet.
       */
      const url = `/api/views?freetId=${this.freet._id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.viewCount = res.numViews;
        console.log('viewcount:', res.numViews);
      } catch (e) {
        this.viewCount = 0;
      }
    },
      
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    border-radius: 1vh;
    margin-bottom: 1vh;
}
.info-format {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

