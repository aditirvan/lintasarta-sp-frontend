<template>
  <v-app class="d-flex justify-center" id="signup">
    <v-container>
      <SignUp></SignUp>
    </v-container>
  </v-app>
</template>

<script>
import SignUp from "./SignUp.vue";
export default {
  components: {
    SignUp,
  },
  setup(props, context) {
    return {};
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-application--wrap {
  justify-content: center;
}
</style>
