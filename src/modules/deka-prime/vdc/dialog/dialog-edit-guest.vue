<template>
  <v-dialog persistent v-model="openGuest" max-width="1200">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">Edit Guest Properties</p>
        </div>
      </v-card-text>
      <br />

      <v-card-text>
        <p class="fz-16 ml-8">General</p>
      </v-card-text>

      <v-card-text class="pb-0">
        <v-checkbox v-model="enableGuest" label="Enable guest customization" class="ml-8 font-weight-bold"></v-checkbox>
      </v-card-text>
      <v-card-text class="mb-5">
        <p class="ml-8 fz-14 pt-0">
          The computer name and network settings configured for this VM are applied to its Guest OS when the VM is powered on. The following settings are only
          applied the 1st time the VM is powered on or if "Power on and Force Recustomization" is performed: Change SID, Password Reset, Join Domain and
          Customization Script. Guest customization should not be enabled if the VM uses Guest Properties for customization.
        </p>
      </v-card-text>

      <v-card-text class="pb-0" v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-checkbox v-model="ChangeSid" label="Change SID" class="ml-8 font-weight-bold" :disabled="enableGuest == false"></v-checkbox>
      </v-card-text>
      <v-card-text class="mb-5" v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <p class="ml-8 fz-14 pt-0">
          Applicable for Windows VMs and will run Sysprep to change Windows SID. On Windows NT, VMware Cloud Director uses Sidgen. Running sysprep is a
          prerequisite for completing domain join.
        </p>
      </v-card-text>

      <v-card-text class="pb-0">
        <p class="ml-8 fz-16">Password Reset</p>
      </v-card-text>

      <v-card-text class="pb-0 pt-0">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-checkbox
              label="Allow local administrator password"
              hide-details
              class="ml-8 font-weight-bold fz-12"
              v-model="AdminPasswordEnabled"
              :disabled="enableGuest == false"
            ></v-checkbox>
            <v-checkbox
              label="Require Administrator to change password on first login"
              hide-details
              class="ml-8 font-weight-bold fz-12"
              v-model="ResetPasswordRequired"
              :disabled="enableGuest == false"
            ></v-checkbox>
            <v-checkbox
              label="Auto generate password"
              hide-details
              class="ml-8 font-weight-bold fz-12"
              v-model="AdminPasswordAuto"
              :disabled="enableGuest == false || AdminPasswordEnabled == false"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Specify password</p>
          </v-col>
          <v-col>
            <v-text-field v-model="adminPassword" :disabled="enableGuest == false || AdminPasswordAuto == true"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Number of times to log on automatically</p>
          </v-col>
          <v-col>
            <v-text-field
              v-model="AdminAutoLogonCount"
              :disabled="enableGuest == false || AdminPasswordEnabled == false"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
              @blur="$v.AdminAutoLogonCount.$touch()"
              :error-messages="$v.AdminAutoLogonCount.$errors.length ? $v.AdminAutoLogonCount.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="mb-5">
        <p class="ml-8 fz-12 pt-0">Value of 0 will disable automatic log on as administrator</p>
      </v-card-text>

      <v-card-text class="pb-0" v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <p class="ml-8 fz-16">Join Domain</p>
      </v-card-text>

      <v-card-text class="pb-0 pt-0" v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-checkbox
              label="Enable this VM to join a domain"
              hide-details
              class="ml-8 font-weight-bold fz-12"
              v-model="JoinDomainEnabled"
              :disabled="enableGuest == false || ChangeSid == false"
            ></v-checkbox>
            <v-radio-group v-model="UseOrgSettings" column class="ml-8" :disabled="enableGuest == false || ChangeSid == false">
              <v-radio label="Use organization's domain" :value="true"></v-radio>
              <v-radio label="Override organization's domain" :value="false"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Domain Name</p>
          </v-col>
          <v-col>
            <v-text-field
              v-if="JoinDomainEnabled == true"
              v-model="DomainName"
              :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"
              @blur="$v.DomainName.$touch()"
              :error-messages="$v.DomainName.$errors.length ? $v.DomainName.$errors[0].$message : ''"
            ></v-text-field>
            <v-text-field v-else v-model="DomainName" :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Username</p>
          </v-col>
          <v-col>
            <v-text-field
              v-if="JoinDomainEnabled == true"
              v-model="DomainUserName"
              :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"
              @blur="$v.DomainUserName.$touch()"
              :error-messages="$v.DomainUserName.$errors.length ? $v.DomainUserName.$errors[0].$message : ''"
            ></v-text-field>
            <v-text-field v-else v-model="DomainUserName" :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Password</p>
          </v-col>
          <v-col>
            <v-text-field
              v-if="JoinDomainEnabled == true"
              v-model="DomainUserPassword"
              :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"
              @blur="$v.DomainUserPassword.$touch()"
              :error-messages="$v.DomainUserPassword.$errors.length ? $v.DomainUserPassword.$errors[0].$message : ''"
              :type="show1 ? 'text' : 'password'"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              v-else
              v-model="DomainUserPassword"
              :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="getOs(detail.GuestOS) == 'Microsoft'">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Account organization unit</p>
          </v-col>
          <v-col>
            <v-text-field v-model="MachineObjectOU" :disabled="enableGuest == false || ChangeSid == false || JoinDomainEnabled == false"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- <v-card-text class="pb-0">
        <p class="ml-8 fz-16">Script</p>
      </v-card-text>

      <v-card-text class="pb-0 mb-4">
        <v-row>
          <v-col cols="4" class="d-flex flex-end">
            <p class="ml-8 fz-16 font-weight-bold mb-2">Script File</p>
          </v-col>
          <v-col cols="5"></v-col>
          <v-col cols="3" class="d-flex justify-end">
            <v-btn color="primary" outlined>UPLOAD</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"> </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="6">
            <v-textarea solo outlined></v-textarea>
          </v-col>
        </v-row>
      </v-card-text> -->

      <v-card-text class="mt-6">
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn color="secondary" block height="35" @click="onSumbit()" :loading="updateCustomization"> Save </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { VDC } from "../namespace";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: {
    openGuest: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { detailGuest, updateCustomization, statusUpdate } = useNamespacedGetters(VDC, ["detailGuest", "updateCustomization", "statusUpdate"]);
    const { setGuestCustomization } = useNamespacedActions(VDC, ["setGuestCustomization"]);
    const onCancel = () => {
      if (JoinDomainEnabled.value == true) {
        // DomainName.value = detailGuest.value.DomainName;
        // DomainUserName.value = detailGuest.value.DomainUserName;
        // DomainUserPassword.value = detailGuest.value.DomainUserPassword;
        // MachineObjectOU.value = detailGuest.value.MachineObjectOU;
        $v.value.$reset();
      }
      context.emit("update:open-guest", false);
    };
    const onSumbit = () => {
      if (JoinDomainEnabled.value == true) {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
      }

      const body = {
        AdminAutoLogonCount: AdminAutoLogonCount.value,
        AdminAutoLogonEnabled: detailGuest.value.AdminAutoLogonEnabled,
        AdminPassword: adminPassword.value,
        AdminPasswordAuto: AdminPasswordAuto.value,
        AdminPasswordEnabled: AdminPasswordEnabled.value,
        ChangeSid: ChangeSid.value,
        ComputerName: detailGuest.value.ComputerName,
        CustomizationScript: detailGuest.value.CustomizationScript,
        DomainName: DomainName.value,
        DomainUserName: DomainUserName.value,
        DomainUserPassword: DomainUserPassword.value,
        Enabled: enableGuest.value,
        JoinDomainEnabled: JoinDomainEnabled.value,
        MachineObjectOU: MachineObjectOU.value,
        ResetPasswordRequired: ResetPasswordRequired.value,
        UseOrgSettings: UseOrgSettings.value,
        VirtualMachineId: detailGuest.value.VirtualMachineId,
      };
      const id = {
        id_vdc: context.root.$route.params.id,
        id_vapp: context.root.$route.params.id_vapp,
        id_vm: context.root.$route.params.id_vm,
      };
      const payload = {
        body: body,
        id: id,
      };
      setGuestCustomization(payload);
    };
    const adminPassword = ref(detailGuest.value.AdminPassword);
    const AdminPasswordEnabled = ref(detailGuest.value.AdminPasswordEnabled);
    const enableGuest = ref(detailGuest.value.Enabled);
    const AdminAutoLogonCount = ref(detailGuest.value.AdminAutoLogonCount);
    const AdminPasswordAuto = ref(detailGuest.value.AdminPasswordAuto);
    const ResetPasswordRequired = ref(detailGuest.value.ResetPasswordRequired);
    const ChangeSid = ref(detailGuest.value.ChangeSid);
    const UseOrgSettings = ref(detailGuest.value.UseOrgSettings);
    const JoinDomainEnabled = ref(detailGuest.value.JoinDomainEnabled);
    const DomainName = ref(detailGuest.value.DomainName);
    const DomainUserName = ref(detailGuest.value.DomainUserName);
    const DomainUserPassword = ref(detailGuest.value.DomainUserPassword);
    const MachineObjectOU = ref(detailGuest.value.MachineObjectOU);
    const show1 = ref(false);

    const $v = useVuelidate(
      {
        AdminAutoLogonCount: {
          valueLength: helpers.withMessage("You can enter only numbers in the range of 0 to 100", (val) => {
            return parseInt(val) <= 100;
          }),
        },
        DomainName: {
          required: helpers.withMessage("Domain Name couldnt be empty if Join Domain is selected.", (val) => {
            return val;
          }),
        },
        DomainUserName: {
          required: helpers.withMessage("Username couldnt be empty if Join Domain is selected.", (val) => {
            return val;
          }),
        },
        DomainUserPassword: {
          required: helpers.withMessage("Password couldnt be empty if Join Domain is selected.", (val) => {
            return val;
          }),
        },
      },
      {
        AdminAutoLogonCount,
        DomainName,
        DomainUserName,
        DomainUserPassword,
      }
    );
    const detail = ref(JSON.parse(localStorage.getItem("dataVM") || "{}"));
    const getOs = (item) => {
      let OSDekaprime = item.split(" ")[0];
      return OSDekaprime;
    };
    watch(statusUpdate, () => {
      if (statusUpdate.value == true) {
        context.emit("update:open-guest", false);
      }
    });
    return {
      onCancel,
      onSumbit,
      detailGuest,
      enableGuest,
      adminPassword,
      AdminPasswordEnabled,
      AdminAutoLogonCount,
      AdminPasswordAuto,
      ResetPasswordRequired,
      updateCustomization,
      $v,
      statusUpdate,
      detail,
      getOs,
      ChangeSid,
      UseOrgSettings,
      JoinDomainEnabled,
      DomainName,
      DomainUserName,
      DomainUserPassword,
      MachineObjectOU,
      show1,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-input--selection-control {
  margin-top: 0;
}
.flex-end {
  align-items: flex-end;
}
::v-deep .v-text-field__details {
  position: static;
}
</style>
