<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title>
<div class="headline font-weight-bold font--text">Create Snapshot</div>

          </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Name your snapshot</p>
        <v-text-field maxlength="50" hide-details outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              <b>Cancel</b>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              depressed
              height="50"
              color="secondary"
              block
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              <b>Take Snapshot</b>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["value"],
};
</script>
<style lang="scss" scoped>
.v-btn{
  ::v-deep .v-btn__content{
    font-size: 14px;
    font-weight: 700;
  }
}
</style>