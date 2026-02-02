<template>
  <v-dialog persistent v-model="leases" max-width="700">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">Renew Leases</p>
        </div>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="4"><v-checkbox v-model="checkbox" label="Runtime lease"></v-checkbox></v-col>
          <v-col md="4"><v-select :items="items" label="Select" solo></v-select></v-col>
          <v-col md="2"><v-select :items="items" label="Select" solo></v-select></v-col>
        </v-row>
        <v-row>
          <v-col md="4"></v-col>
          <v-col class="pt-0"><span>How long any the VMs in the vApp can run before the vApp is automatically powered off or suspended</span></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="4"><v-checkbox v-model="checkbox1" label="Storage lease"></v-checkbox></v-col>
          <v-col md="4"><v-select :items="items" label="Select" solo></v-select></v-col>
          <v-col md="2"><v-select :items="items" label="Select" solo></v-select></v-col>
        </v-row>
        <v-row>
          <v-col md="4"></v-col>
          <v-col class="pt-0"><span>How long it is available before being automatically deleted or marked as expired</span></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn color="#CDCDCD" depressed block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn color="primary" depressed block height="35" @click="onSumbit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  props: {
    leases: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const vappsCheck = ref(false);
    const checkbox = ref(false);
    const checkbox1 = ref(false);
    const items = ref(["Foo", "Bar", "Fizz", "Buzz"]);
    const onCancel = () => {
      context.emit("update:leases", false);
    };
    const onSumbit = () => {
      console.log("Edit");
    };
    return {
      onCancel,
      onSumbit,
      vappsCheck,
      checkbox,
      checkbox1,
      items,
    };
  },
};
</script>

<style lang="scss" scoped></style>
