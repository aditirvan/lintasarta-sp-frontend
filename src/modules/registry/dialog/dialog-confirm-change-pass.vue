<template>
  <div>
    <v-dialog persistent v-model="dialog" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">
              Change Password
            </p>
          </div>
        </v-card-text>
        <v-card-text style="padding-bottom: 0px;">
          <p class="font-weight-bold">Old Password</p>
          <v-text-field
            v-model="oldpassword"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            counter
            @click:append="show1 = !show1"
            outlined
            placeholder="Old Password"
            :error-messages="$v.oldpassword.$errors.length ? $v.oldpassword.$errors[0].$message : ''"
          />
        </v-card-text>
        <v-card-text style="padding-bottom: 0px;">
          <p class="font-weight-bold">New Password</p>
          <v-text-field
            v-model="newpassword"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            counter
            @click:append="show2 = !show2"
            outlined
            placeholder="New Password"
            :error-messages="$v.newpassword.$errors.length ? $v.newpassword.$errors[0].$message : ''"
          />
        </v-card-text>
        <v-card-text >
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3" style="padding-left: 12px;padding-right: 12px;padding-top: 0px;padding-bottom: 0px;">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                 @click="() => {
                            dialog = false
                            $emit('input', false);
                        }"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3" style="padding-left: 12px;padding-right: 12px;padding-top: 0px;padding-bottom: 0px;">
              <v-btn
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref,computed } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
    data () {
      return {
        show1: false,
        show2: false,
      }
    },
  
  props: ["value", "item"],
  setup(props, { emit }) {
    // console.log("props",props)
    const { updateChangePass  } = useNamespacedActions(REGISTRY, ["updateChangePass"]);
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    const oldpassword = ref("");
    const newpassword = ref("");
    const content_error = ref("")

    const onConfirm = async () => {
      $v.value.$touch();
      content_error.value = $v.value.$errors.length ? "value is required" : ""
      if ($v.value.$errors.length) return;
        const params = {
          old_password : oldpassword.value,
          new_password: newpassword.value,
        };
        const payload={
          param:params,
          idUser: props.item.entity_id,
        }
        // console.log("payload============",payload);
        updateChangePass(payload);
        dialog.value = false
    }
    const $v = useVuelidate(
      {
        oldpassword: { required},
        newpassword: { required},
      },
      {
        oldpassword,
        newpassword,
      }
    );
    return {
      content_error,
      onConfirm,
      oldpassword,
      newpassword,
      $v,
      updateChangePass,
      dialog,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>