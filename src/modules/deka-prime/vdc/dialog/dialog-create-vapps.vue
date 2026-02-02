<template>
  <v-dialog persistent v-model="dialog" max-width="600">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">{{ action == "new" ? "New vApps" : "Edit vApps" }}</p>
        </div>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3">Name</v-col>
          <v-col><v-text-field placeholder="Name" solo v-model="name"></v-text-field></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3">Description</v-col>
          <v-col><v-text-field placeholder="Description" solo v-model="desc"></v-text-field></v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="action == 'new'">
        <v-row>
          <v-col md="3" class="d-flex align-center">Power On</v-col>
          <v-col><v-checkbox v-model="vappsCheck"></v-checkbox></v-col>
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
    dialog: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const vappsCheck = ref(false);
    const desc = ref("");
    const name = ref("");
    const onCancel = () => {
      context.emit("update:dialog", false);
    };
    const onSumbit = () => {
      if (action == "new") {
        const params = {
          name: name.value,
          description: desc.value,
          check: vappsCheck.value,
        };
        console.log("params new", params);
      } else {
        console.log("Edit");
      }
    };
    return {
      onCancel,
      onSumbit,
      vappsCheck,
      desc,
      name,
    };
  },
};
</script>

<style lang="scss" scoped></style>
