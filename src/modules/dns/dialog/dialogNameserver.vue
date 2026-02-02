<template>
  <div>
    <v-dialog v-model="show" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Setup Custom Nameservers </v-card-title
        ><br />
        <v-card-text
          >The domains entered here will be created and enabled immediately. If
          Custom Nameservers are currently enabled, they will be replaced with
          the new records</v-card-text
        >
        <v-col>
          <span>Nameservers</span>
          <v-select
            height="35"
            outlined
            v-model="select"
            :items="[detailDns]"
            item-text="name"
            item-value="name"
            placeholder="Select Nameservers"
          ></v-select>
        </v-col>
        <v-col>
          <span>ns1</span>
          <v-text-field
            placeholder="input data"
            outlined
            v-model="inputData1"
            :suffix="`.${select}`"
          ></v-text-field>
        </v-col>
        <v-col>
          <span>ns2</span>
          <v-text-field
            placeholder="input data"
            outlined
            v-model="inputData2"
            :suffix="`.${select}`"
          ></v-text-field>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#CDCDCD" @click="closeDialog()"> Cancel </v-btn>
          <v-btn color="primary" @click="onSubmit()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, defineComponent } from "@vue/composition-api";
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { DNS } from "../namespace";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { customNameserver } = useNamespacedActions(DNS, [
      "customNameserver",
    ]);
    const { detailDns } = useNamespacedGetters("DNS", ["detailDns"]);
    const inputData1 = ref("");
    const inputData2 = ref("");
    const select = ref("");
    function closeDialog() {
      this.$emit("update:show", false);
      inputData1.value = "";
      inputData2.value = "";
      select.value = "";
    }
    function onSubmit() {
      const params = {
        zone_id: detailDns.value.id,
        name: detailDns.value.name,
        ns1_name: `${inputData1.value}.${select.value}`,
        ns2_name: `${inputData2.value}.${select.value}`,
      };
      customNameserver(params);
      inputData1.value = "";
      inputData2.value = "";
      select.value = "";
    }
    return {
      closeDialog,
      onSubmit,
      detailDns,
      customNameserver,
      select,
      inputData1,
      inputData2,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>