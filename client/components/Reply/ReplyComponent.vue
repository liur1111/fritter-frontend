<template>
  <article 
    class="reply"
  >
    <header>
      <h4 class="author">
        @{{ reply.author }}
      </h4>
    </header>
    <div
      v-if="$store.state.username === reply.author"
      class="actions"
    >
      <button @click="deleteReply">
        🗑️ Delete
      </button>
    </div>
    <p class="content">
      {{ reply.content }}
    </p>
  </article>
</template>

<script>
export default {
  name: 'ReplyComponent',
  props: {
    reply: {
      type: Object,
      required: true
    },
    freetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    deleteReply() {
      /**
       * Deletes this reply.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted reply!', status: 'success'
          });
        }
      };
      this.request(params);
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
        const r = await fetch(`/api/replies/${this.reply._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('updateReplies', this.freetId);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style>
.reply {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-radius: 1vh;
}
</style>