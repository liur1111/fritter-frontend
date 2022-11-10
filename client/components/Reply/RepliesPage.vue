<template>
  <main>
    <section>
      <header class="top">
        <FreetComponent
          v-if="freet !== undefined"
          :freet="freet"
        />
      </header>
      <section>
        <h2>
          Replies
        </h2>
        <section v-if="$store.state.username">
          <CreateReplyForm 
            :freetId="$route.params.freetId"
          />
        </section>
        <section v-if="$store.state.replies.length">
          <ReplyComponent 
            v-for="reply in $store.state.replies"
            :key="reply._id"
            :reply="reply"
            :freetId="$route.params.freetId"
          />
        </section>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import ReplyComponent from '@/components/Reply/ReplyComponent.vue';
import CreateReplyForm from '@/components/Reply/CreateReplyForm.vue';

export default {
  name: 'RepliesPage',
  components: {FreetComponent, ReplyComponent, CreateReplyForm},
  props: {},
  data() {
    return {};
  },
  computed: {
    freet() {
      for (const freet of this.$store.state.freets) {
        if (this.$route.params.freetId === freet._id) {
          return freet;
        }
      }
      return undefined;
    },
  },
  created() {
    this.getReplies();
  },
  methods: {
    getReplies() {
      if (this.freet !== undefined) {
        this.$store.commit('updateReplies', this.$route.params.freetId);
      }
    }
  }
}
</script>

<style scoped>
.top {
  margin-top: 4vh;
}
</style>