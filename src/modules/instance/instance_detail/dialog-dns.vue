<template>
  <v-dialog persistent v-model="dialogOpen" max-width="500">
    <v-card class="rounded-lg">
      <v-card-text class="pb-0 pt-3">
        <v-col><p class="font-weight-bold">All DNS</p></v-col>
      </v-card-text>

      <v-card-text>
        <v-data-table hide-default-footer :headers="headers" :items="itemDns"></v-data-table>
      </v-card-text>

      <v-card-text class="pb-0">
        <v-row>
          <v-col class="d-flex flex-row justify-center mb-4">
            <v-btn color="#a5b3bf" depressed block height="45" @click="onCancel()"> <span class="white--text fz-16">Close</span> </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
export default {
  props: {
    dialogOpen: {
      type: Boolean,
      default: false,
    },
    dataDns: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const headers = ref([{ text: "DNS", value: "item" }]);
    const onCancel = () => {
      context.emit("update:dialog-open", false);
    };
    const itemDns = computed(() => {
      return props.dataDns.map((item) => ({ item }));
    });

    return {
      onCancel,
      headers,
      itemDns,
    };
  },
};
</script>

<style lang="scss" scoped></style>
