<template>
  <v-dialog v-model="show" max-width="500" persistent>
    <v-card>
      <v-card-title class="pb-7">
        <div class="headline font-weight-bold font--text">Reveal Openshift Password</div>
      </v-card-title>
      <v-card-text class="pb-0" v-if="!privateKey">
        <v-form ref="form">
          <p class="font-weight-bold pb-2">Account Password</p>
          <v-text-field
            outlined
            placeholder="Please enter your password"
            v-model="inputPassword"
            type="password"
            @input="errors = ''"
            :rules="[rules.required]"
            :error-messages="errors ? errors : ''"
            :type="show1 ? 'text' : 'password'"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-3 pt-0">
        <v-col class="pb-0 pt-0">
          <v-btn depressed height="50" color="secondary" block v-if="privateKey" @click="copyText(privateKey)"> Copy Openshift Password </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-actions class="pt-2 px-3" v-if="!privateKey">
        <v-row class="ma-0">
          <v-col cols="6">
            <v-btn depressed height="50" color="accent" block @click="onCancel()"> Cancel </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn depressed height="50" color="secondary" block @click="reveal"> Reveal </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-card-actions v-else class="px-3 pt-0">
        <v-col>
          <v-btn depressed height="50" color="accent" block @click="onCancel()"> OK </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import { DEKAROCK } from "@/modules/deka-rock/namespace";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";

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
  },

  setup(props, context) {
    const { getOpenshiftPassword } = useNamespacedActions(DEKAROCK, ["getOpenshiftPassword"]);
    const privateKey = ref("");
    const inputPassword = ref("");
    const rules = ref({
      required: (value) => !!value || "Content couldn't be empty.",
    });
    const errors = ref("");
    const showSecretKey = ref(false);
    const show1 = ref(false);
    const secretKey = ref(null);
    const reveal = async () => {
      if (!inputPassword.value) {
        return (errors.value = "Content couldn't be empty.");
      }

      let res = await getOpenshiftPassword({ id: props.dataKey.id, password: inputPassword.value });
      if (res) {
        privateKey.value = res.data.password;
        inputPassword.value = "";
      }
    };

    const onCancel = () => {
      inputPassword.value = "";
      errors.value = "";
      if (context.refs && context.refs.form){
        context.refs.form.reset();
      }
      context.emit("update:show", false);
    };

    const closeDialog = () => {
      showSecretKey.value = false;
      // inputPassword.value = ""
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
      context.root.$store.dispatch("HOMEPAGE/showSuccessToast", "Copied to clipboard", { root: true });
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
      rules,
      errors,
      show1,
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
