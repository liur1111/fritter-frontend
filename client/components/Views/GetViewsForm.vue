<!-- Form for getting freets (all, from user) (inline style) -->

<template>
  <div>
    {{ this.viewCount }} Views
  </div>
</template>

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetViewsForm',
  mixins: [InlineForm],
  props: {
    freetId: {
      type: String,
      required: true
    }
  },
  data() {
    return {viewCount: 0};
  },
  created() {
    this.getViewCount();
  },
  mounted() {},
  methods: {
    async getViewCount() {
      /**
       * Returns number of views on freet.
       */
      const url = `/api/views?freetId=${this.freetId}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        this.viewCount = res.numViews;
      } catch (e) {
        
      }
    }
  }
};
</script>
