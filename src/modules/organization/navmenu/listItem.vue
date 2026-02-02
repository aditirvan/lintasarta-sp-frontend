<template>
  <v-list-item
    @click="toDetailPage"
    class="cursor-pointer"
    :class="{
      'broadcast-container-gray': sameDay,
    }"
    :style="{ width: '350px' }"
  >
    <v-list-item-title class="d-flex align-center">
      <v-icon style="width: 20px; height: 20px" class="mr-3">
        $vuetify.icons.broadcastBlue
      </v-icon>

      <div class="py-2" :style="{ width: '100%' }">
        <div
          class="d-flex justify-space-between align-center mb-2"
          :style="{ width: '100%' }"
        >
          <span class="mr-3 primary--text font-weight-bold">
            {{ item.broadcast_name }}
          </span>

          <span :style="{ color: 'lightgray' }">
            {{
              sameDay
                ? "Today"
                : $moment(item.send_date).format("DD/MM/YYYY - HH:mm")
            }}
          </span>
        </div>

        <p>
          {{
            item.description.length > 40
              ? item.description.substring(0, 40) + "..."
              : item.description
          }}
        </p>
      </div>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  props: ["item"],
  computed: {
    sameDay() {
      return (
        this.$moment(this.item.send_date).format("DD MMMM YYYY") ===
        this.$moment().format("DD MMMM YYYY")
      );
    },
  },
  methods: {
    toDetailPage() {
      // :to="'/broadcast-user/' + item.id"
      this.$router.push({
        path: "/broadcast-user/" + this.item.id,
      });
    },
  },
};
</script>

<style scoped>
.broadcast-container-gray {
  background-color: #f7f7f7;
  border-left: 3px solid #1f60a8;
}
</style>
