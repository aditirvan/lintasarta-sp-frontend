<template>
  <v-card flat class="pa-7 rounded-lg">
    <v-card-text class="d-flex flex-row align-center">
      <v-row>
        <v-col class="text-center">
          <div
            style="position: relative"
            class="pa-7 rounded-circle d-inline-block primary"
          >
            <div
              class="white--text fz-18 font-weight-bold"
              style="
                font-family: Nunito Sans;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              "
            >
              1
            </div>
          </div>
          <div class="fz-16 mt-2">Form 1</div></v-col
        >
        <v-col class="text-center"
          ><div
            style="position: relative"
            class="pa-7 rounded-circle d-inline-block primary"
          >
            <div
              class="white--text fz-18 font-weight-bold"
              style="
                font-family: Nunito Sans;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              "
            >
              2
            </div>
          </div>
          <div class="fz-16 mt-2">Form 2</div>
        </v-col>
        <v-col class="text-center"
          ><div
            style="position: relative"
            class="pa-7 rounded-circle d-inline-block primary"
          >
            <div
              class="white--text fz-18 font-weight-bold"
              style="
                font-family: Nunito Sans;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              "
            >
              3
            </div>
          </div>
          <div class="fz-16 mt-2">Form 3</div></v-col
        >
      </v-row>
    </v-card-text>
    <v-divider
      style="
        margin-left: -28px;
        margin-right: -28px;
        max-width: 2000px;
        margin-top: -88px;
        margin-bottom: 59px;
      "
    />
    <div class="table-title">Create Instance</div>
    <v-row>
      <v-col>
        <h4 class="pb-3">Input Field</h4>

        <v-text-field
          maxlength="30"
          placeholder="Insert Name"
          single-line
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <h4 class="pb-3">Select Type</h4>

        <v-text-field
          maxlength="30"
          placeholder="Insert Name"
          single-line
          outlined
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="pb-3">Input Field</h4>
        <v-text-field
          maxlength="30"
          placeholder="Insert Name"
          single-line
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <h4 class="pb-3">Select Type</h4>

        <v-text-field
          maxlength="30"
          placeholder="Insert Name"
          single-line
          outlined
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="pb-3">Text Area</h4>

        <v-textarea outlined></v-textarea>
      </v-col>
      <v-col> </v-col>
    </v-row>
    <v-card-text>
        <v-row>
            <v-col>

            </v-col>
            <v-col> <v-btn
              height="50"
              depressed
            color="secondary"
            block
            @click="()=>{dialog = false}"
          >
            Next
          </v-btn></v-col>
        </v-row>
       
    </v-card-text>
  </v-card>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {},
});
</script>
<style scoped>
.table-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>