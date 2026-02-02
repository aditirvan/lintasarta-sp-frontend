<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <v-card-title class="pb-7">
        <div class="headline font-weight-bold font--text">
          Reveal Your Private Key
        </div>
      </v-card-title>
      <!-- <v-card-text v-if="privateKey">
        <p class="font-weight-bold">Private Key ID</p>
        <v-textarea
          id="accessKeyID"
          :value="privateKey"
          maxlength="50"
          outlined
          filled
          readonly
          flat
          solo
          hide-details
          class="v-input-append"
        >
          <template v-slot:append>
            <v-btn
              depressed
              class="secondary"
              width="100"
              height="56"
              style="
                position: relative;
                right: -12px;
                border-radius: 0 4px 4px 0;
              "
              @click="copyText(privateKey)"
              >Copy</v-btn
            >
          </template>
        </v-textarea>
      </v-card-text> -->

      <v-card-text class="pb-0" v-if="!privateKey">
        <v-form ref="form">
          <p class="font-weight-bold pb-2">Your Password</p>
          <v-text-field
            outlined
            placeholder="Please enter your password"
            type="password"
            @input="(inputPassword = $event), (errors = '')"
            :rules="[rules.required]"
            :error-messages="errors"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-3 pt-0">
        <v-col class="pb-0 pt-0">
          <v-btn
            depressed
            height="50"
            color="secondary"
            block
            :disabled="!privateKey"
            @click="copyText(privateKey)"
          >
            Copy Key
          </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-actions class="pt-2 px-3" v-if="!privateKey">
        <v-row class="ma-0">
          <v-col cols="6">
            <v-btn depressed height="50" color="accent" block @click="onCancel">
              Cancel
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn
              depressed
              height="50"
              color="secondary"
              block
              @click="reveal"
              :loading="loadingRev"
            >
              Reveal
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-actions v-else class="px-3 pt-0">
        <v-col>
          <v-btn depressed height="50" color="accent" block @click="onCancel">
            OK
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, computed } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    dataKey: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      required: true,
    },
  },

  setup(props, context) {
    const { privateKey, loadingRev } = useNamespacedGetters("SSL", [
      "privateKey",
      "loadingRev",
    ]);
    const { getPrivateKey, onClear } = useNamespacedActions("SSL", [
      "getPrivateKey",
      "onClear",
    ]);
    const inputPassword = ref("");
    const rules = ref({
      required: (value) => !!value || "Content couldn't be empty.",
    });
    const errors = ref("");
    const showSecretKey = ref(false);
    const secretKey = ref(null);
    const reveal = async () => {
      if (!inputPassword.value) {
        return (errors.value = "Content couldn't be empty.");
      }
      const params = {
        keyName: props.dataKey.fileName,
        password: inputPassword.value,
        id: props.id,
      };
      console.log("params private key", params);
      getPrivateKey(params);
      inputPassword.value = "";
      context.refs.form.reset();
    };

    const onCancel = () => {
      context.emit("update:show", false);
      inputPassword.value = "";
      onClear();
      errors.value = "";
      context.refs.form.resetValidation();
      context.refs.form.reset();
    };

    const closeDialog = () => {
      showSecretKey.value = false;
      secretKey.value = null;
      context.emit("close");
    };

    const copyText = (text) => {
      // var copyText = document.getElementById(id);
      /* Select the text field */
      // copyText.select();
      // copyText.setSelectionRange(0, 99999); /* For mobile devices */
      /* Copy the text inside the text field */
      // document.execCommand("copy");
      navigator.clipboard.writeText(text);
      context.root.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Copied to clipboard",
        { root: true }
      );
    };

    return {
      closeDialog,
      reveal,
      inputPassword,
      secretKey,
      showSecretKey,
      copyText,
      onCancel,
      privateKey,
      getPrivateKey,
      onClear,
      rules,
      errors,
      loadingRev,
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
