<template>
  <v-dialog v-model="value" persistent max-width="612">
    <v-card class="pa-7 rounded-lg">
      <v-card-text class="pb-0 text-center">
        <p class="font-weight-bold mb-6" style="font-size:28px">Verification Successful!</p>
        <p class="fz-20 mb-1 accent--text">
          You have successfully email verification,
          </p><p class="fz-20  accent--text">now you can login to
          Lintasarta
        </p>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn
              class="mx-auto"
              width="400" height="50"
              color="secondary"
              depressed
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              <span class="fz-16">Ok</span>
            </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["value", "email"],
};
</script>