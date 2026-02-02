<template>
  <v-row>
    <v-col class="d-flex flex-row align-center">
      <p class="mb-0 font-weight-bold fz-21">Broadcast</p>

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

      <v-btn depressed height="50" class="secondary" to="/broadcast/add" v-if="!read_only">
        <span class="fz-14">Add New Broadcast</span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";
export default {
  data() {
    return {
      search: "",
    };
  },
  setup(props, context){
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Broadcast'));
    return {
      read_only
    }
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
