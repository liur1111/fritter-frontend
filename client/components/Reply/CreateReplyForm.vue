<!-- Form for creating freets (block style) -->

<script>
import ReplyBlockForm from '@/components/Reply/ReplyBlockForm.vue';
import BlockForm from '@/components/common/BlockForm.vue';


export default {
  name: 'CreateReplyForm',
  mixins: [ReplyBlockForm],
  props: {
    freetId: {
      type: String, 
      required: true
    }
  },
  data() {
    return {
      url: `/api/replies`,
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
      ],
      title: 'Create a reply',
      refreshReplies: this.freetId,
      callback: () => {
        const message = 'Successfully created a reply!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
