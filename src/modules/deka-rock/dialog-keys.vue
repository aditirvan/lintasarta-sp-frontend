<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <v-card-title class="pb-7">
        <div class="headline font-weight-bold font--text">Private Key</div>
      </v-card-title>
      <v-card-text class="pb-0" v-if="!copyConfig">
        <v-form ref="form">
          <p class="font-weight-bold pb-2">Your Password</p>
          <v-text-field
            outlined
            placeholder="Please enter your password"
            type="password"
            v-model="inputPassword"
            @blur="$v.inputPassword.$touch()"
            :error-messages="$v.inputPassword.$errors.length ? $v.inputPassword.$errors[0].$message : ''"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-3 pt-0">
        <v-col class="pb-0 pt-0">
          <v-btn depressed height="50" color="secondary" block :disabled="!copyConfig" @click="copyText(copyConfig)"> Copy Key </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-actions class="pt-2 px-3" v-if="!copyConfig">
        <v-row class="ma-0">
          <v-col cols="6">
            <v-btn depressed height="50" color="accent" block @click="onCancel"> Cancel </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn depressed height="50" color="secondary" block @click="confirm"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-actions v-else class="px-3 pt-0">
        <v-col>
          <v-btn depressed height="50" color="accent" block @click="onCancel"> OK </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { DEKAROCK } from "./namespace";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const { copyConfig } = useNamespacedState(DEKAROCK, ["copyConfig"]);
    const { retrievePassword } = useNamespacedActions(DEKAROCK, ["retrievePassword"]);
    const inputPassword = ref("");
    const confirm = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = { password: inputPassword.value, id: context.root.$route.params.id };
      retrievePassword(params);
    };

    const onCancel = () => {
      context.emit("update:show", false);
      inputPassword.value = "";
      $v.value.$reset();
    };

    const copyText = (text) => {
      navigator.clipboard.writeText(text);
      context.root.$store.dispatch("HOMEPAGE/showSuccessToast", "Copied to clipboard", { root: true });
    };

    const $v = useVuelidate(
      {
        inputPassword: { required },
      },
      { inputPassword }
    );

    return {
      confirm,
      inputPassword,
      copyText,
      onCancel,
      $v,
      copyConfig,
      retrievePassword,
    };
  },
};
</script>
<style scoped lang="scss">
button {
  ::v-deep .v-btn__content {
    font-size: 14px;
  }
}

::v-deep .v-text-field__details {
  position: static;
}
</style>
