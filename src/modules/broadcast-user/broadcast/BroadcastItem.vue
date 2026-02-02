<template>
  <div
    class="broadcast-container"
    :class="{
      'broadcast-container-gray': sameDay,
    }"
  >
    <small :style="{ color: 'gray' }">
      {{ sameDay ? "Today" : $moment(item.send_date).format("DD MMMM YYYY") }}
    </small>

    <p class="mt-2">
      <b>{{ item.broadcast_name }}</b>
    </p>

    <span class="d-block" :style="{ marginTop: '-12px' }">
      {{
        item.description.length > 300
          ? item.description.substring(0, 300) + "..."
          : item.description
      }}
    </span>

    <span
      @click="toDetailPage"
      class="primary--text d-block mt-4 cursor-pointer"
    >
      <b>See More</b>
    </span>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    toDetailPage() {
      // :to="'/broadcast-user/' + item.id"
      this.$router.push({
        path: "/broadcast-user/" + this.item.id,
        // query: this.item,
      });
    },
  },
  computed: {
    sameDay() {
      return (
        this.$moment(this.item.send_date).format("DD MMMM YYYY") ===
        this.$moment().format("DD MMMM YYYY")
      );
    },
  },
};
</script>

<style scoped>
.broadcast-container {
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 16px;
  margin: 0 -28px;
}

.broadcast-container-gray {
  background-color: #f7f7f7;
  border-left: 6px solid #1f60a8;
}
</style>
