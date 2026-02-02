<template>
  <v-row>
    <v-col class="d-flex flex-row align-center">
      <p class="mb-0 font-weight-bold fz-21">Repositories</p>

      <v-spacer />

      <v-text-field
        maxlength="50"
        hide-details
        outlined
        style="max-width: 200px"
        placeholder="Search"
        v-model="search"
        @keyup="onEnter"
      />

      <div style="height: auto; width: 30px" />

      <!-- <v-btn depressed height="50" class="secondary" to="/broadcast/add">
        <span class="fz-14">Add New Broadcast</span>
      </v-btn> -->
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: "",
    };
  },
  methods: {
    onEnter(e) {
      // if (e.keyCode === 13) {
        this.$emit("onSearch", this.search);
      // }
    },
  },
};
</script>
