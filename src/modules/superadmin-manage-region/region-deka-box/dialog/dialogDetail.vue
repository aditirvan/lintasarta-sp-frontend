<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Region Detail</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">Name</p>
        <v-text-field :value="selectedRegion.name" disabled flat outlined></v-text-field>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="12" class="pt-0">
            <p class="titletext">Volume Limit (GB)</p>
            <v-text-field maxlength="100" :value="selectedRegion.volume_limit" disabled flat outlined></v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="pt-0">
            <p class="titletext">URL</p>
            <v-text-field maxlength="100" placeholder="URL" :value="selectedRegion.s3_url" disabled flat outlined></v-text-field>
          </v-col> -->
          <v-col cols="12" class="pt-0">
            <p class="titletext">API URL</p>
            <v-text-field maxlength="100" placeholder="API URL" :value="selectedRegion.s3_api_url" disabled flat outlined></v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="pt-0">
            <p class="titletext">Region Name</p>
            <v-text-field maxlength="100" placeholder="Region Name" :value="selectedRegion.s3_region_name" disabled flat outlined></v-text-field>
          </v-col> -->
          <v-col cols="12" class="pt-0">
            <p class="titletext">ADMIN USERNAME</p>
            <v-text-field maxlength="100" placeholder="ADMIN USERNAME" :value="selectedRegion.s3_admin_username" disabled flat outlined></v-text-field>
          </v-col>
            <v-col cols="12" class="pt-0">
            <p class="titletext">TYPE REGION</p>
            <v-text-field maxlength="100"  :value="selectedRegion.type_region" disabled flat outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">Description</p>
        <v-textarea
          rows="5"
          id="description"
          flat
          outlined
          maxlength="255"
          :value="selectedRegion.description"
          placeholder="Description"
          style="margin-bottom: 22px"
          disabled
        ></v-textarea>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              >Close</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed } from "@vue/composition-api";

export default {
  props: ["value", "selectedRegion"],
  setup(props, { root, emit }) {

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    return {
      dialog,
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
