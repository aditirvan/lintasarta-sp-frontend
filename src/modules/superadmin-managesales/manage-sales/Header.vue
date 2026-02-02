<template>
  <v-card-text class="d-flex">
    <div class="headline font-weight-bold font--text d-flex align-center">
      Manage Sales
    </div>

    <v-spacer />

    <v-text-field
      width="300"
      height="50"
      placeholder="Search"
      outlined
      v-model="search"
      @keyup="onEnter"
    />

    <div style="height: auto; width: 20px" />

    <v-btn
      v-if="!read_only"
      depressed
      height="50"
      width="200"
      class="secondary"
      @click="$emit('add')"
    >
      <span class="fz-14">Create New Sales</span>
    </v-btn>
  </v-card-text>
</template>

<script>
import { ref } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";
export default {
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Sales'));
    return {
      read_only
    };
  },
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
