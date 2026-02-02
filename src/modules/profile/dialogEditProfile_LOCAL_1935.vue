<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">Edit Profile</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Full Name</p>
        <v-text-field
          maxlength="100"
          v-model="member.fullname"
          hide-details
          placeholder="Enter Full Name"
          flat
          outlined
          :error-messages="!member.fullname ? errors : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Phone Number</p>
        <v-text-field
          v-mask="[/[1-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/, ' ' ,/[0-9]/, /[0-9]/, /[0-9]/,' ' ,/[0-9]/, /[0-9]/, /[0-9]/]"
          v-model="member.phone"
          prefix="+62"
          hide-details
          placeholder="Enter Phone Number"
          flat
          outlined
          :error-messages="!member.phone ? errors : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Email</p>
        <v-text-field
          maxlength="50"
          v-model="member.email"
          hide-details
          placeholder="Enter Email"
          flat
          outlined
          disabled
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Address</p>
        <v-text-field
          maxlength="100"
          v-model="member.address"
          hide-details
          placeholder="Enter Address"
          flat
          outlined
          :error-messages="!member.address ? errors : ''"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
          >
            <v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="dialog = false"
            >Cancel
            </v-btn
            >
          </v-col
          >
          <v-col
          >
            <v-btn
              depressed
              height="45"
              block
              class="secondary"
              @click="Update()"
            >Update Profile
            </v-btn
            >
          </v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useDialog } from '@/composable/usedialog'
import { defineComponent, ref } from '@vue/composition-api'
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useNamespacedActions } from 'vuex-composition-helpers'
import { PROFILE } from './namespace'

export default defineComponent({
  props: ['value', 'userselected'],

  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const member = ref(props.userselected) as any
    // const fullname = member.value.fullname
    // const address =  member.value.address
    // const email =  member.value.email
    // const phone = member.value.phone

    // member.value.phone = member.value.phone.replace("+62", "")

    //  const $v = useVuelidate(
    //   {
    //     member: {
    //       fullname: { required },
    //       address: { required },
    //       phone: { required },
    //     }
    //   },
    //   {
    //      member: {
    //       fullname,
    //       address,
    //       phone,
    //     }
    //   }
    // );

    const errors = ref("");

    const { updateprofile } = useNamespacedActions(PROFILE, ['updateprofile'])

    function Update() {
      // $v.value.$touch();
      // if ($v.value.$errors.length) return;
      const membervalue = member.value as any
      if (!membervalue.address || !membervalue.phone || !membervalue.fullname) {
        errors.value = 'Required'
      } else {
        const Value = {
          id: membervalue.id,
          name: membervalue.fullname,
          phone_number: membervalue.phone,
          address: membervalue.address
        }

        console.log(Value)
        return updateprofile(Value).then(() => {
          dialog.value = false;
          context.emit("updated");
        });
      }

    }

    return {
      errors,
      dialog,
      member,
      Update
    }
  }
})
</script>
<style lang="scss" scoped>
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #F1F2F2;
  }
}
</style>