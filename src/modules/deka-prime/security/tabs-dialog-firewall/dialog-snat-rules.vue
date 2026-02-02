<template>
  <v-dialog persistent v-model="dialogSnat" max-width="700">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Add SNAT Rule</h2>
          </v-card-text>
        </v-col>
        <v-col class="pt-0">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <span class="cursor-pointer" @click="onCancel()"><v-icon color="red">mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Applied On :</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-select :items="listIpObject" v-model="selectApplied" item-text="name" item-value="index"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center pt-0 mb-5">Original IP/Range</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field
              v-model="originalIp"
              @blur="$v.originalIp.$touch()"
              :error-messages="$v.originalIp.$errors.length ? 'Original IP/Range couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Protocol</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-select :items="listProtocol" v-model="selectProtocol" item-text="name" item-value="value" :value="selectProtocol"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <p class="ml-6 mb-0 fz-12 font-weight-light">Leaving this field empty will make this rule apply to any port</p> -->
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Original Port</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-text-field v-model="originalPort" placeholder="any" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">IMCP Type</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-text-field v-model="imcpType" placeholder="any" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Translated IP/Range</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field
              v-model="translatedIp"
              @blur="$v.translatedIp.$touch()"
              :error-messages="$v.translatedIp.$errors.length ? 'Translated IP/Range couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
            <v-col md="4"
              ><v-btn
                block
                color="primary"
                outlined
                dark
                @click="
                  () => {
                    dialogIp = true;
                  }
                "
                >SELECT</v-btn
              ></v-col
            >
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Translated Port</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field v-model="translatedPort" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Destination IP Address</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field v-model="destinationIp" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Source Port</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field v-model="destinationPort" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Description</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-textarea v-model="description" outlined></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-col cols="6" class="pt-0 pb-0">
          <v-row class="ml-2">
            <v-col class="d-flex align-items-center">Enabled</v-col>
            <v-col class="d-flex"><v-switch v-model="switch1" inset></v-switch></v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-text>
        <v-col cols="6" class="pt-0 pb-0">
          <v-row class="ml-2">
            <v-col class="d-flex align-items-center">Enable Logging</v-col>
            <v-col class="d-flex"><v-switch v-model="switch2" inset></v-switch></v-col>
          </v-row>
        </v-col>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn color="secondary" depressed block height="35" @click="onSubmit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog persistent v-model="dialogIp" max-width="500">
      <v-card class="overflow-x-hidden">
        <v-row>
          <v-col class="pt-0">
            <v-card-text>
              <h2>Select IP Address</h2>
            </v-card-text>
          </v-col>
        </v-row>

        <v-card-text>
          <v-row>
            <v-col md="3" class="d-flex align-items-center">Network</v-col>
            <v-col class="pt-0 mt-0" cols="12" sm="6">
              <v-select :items="listObject" v-model="selectApplied2" item-text="name" item-value="name" @change="changeIp($event)"></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row>
            <v-col md="3" class="d-flex align-items-center">IP Address</v-col>
            <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
              <v-text-field :items="ipFromObject" v-model="ipSelect"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="4">
              <v-btn class="white--text" color="#a5b3bf" block height="35" @click="close()"> Cancel</v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="4">
              <v-btn color="secondary" block height="35" @click="keep()"> Confirm </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: {
    dialogSnat: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { listRuleNatNsxv, payloadRuleNat, listIpObject, listObject } = useNamespacedGetters(DPSECURITY, [
      "listRuleNatNsxv",
      "payloadRuleNat",
      "listIpObject",
      "listObject",
    ]);
    const { updateRuleNatNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleNatNsxv"]);
    onMounted(() => {
      changeIp(listIpObject.value[0]?.name);
    });

    const dialogIp = ref(false);
    const listProtocol = ref([
      { id: 1, name: "TCP", value: "tcp" },
      { id: 2, name: "UDP", value: "udp" },
      { id: 3, name: "ICMP", value: "icmp" },
      { id: 4, name: "Any", value: "any" },
    ]);

    const vnic = ref("");
    const selectProtocol = ref("any");
    const sourcePort = ref("");
    const destinationPort = ref("");
    const switch1 = ref(true);
    const switch2 = ref(false);
    const originalIp = ref("");
    const translatedIp = ref("");
    const originalPort = ref("");
    const imcpType = ref("");
    const translatedPort = ref("");
    const sourceAddress = ref("");
    const description = ref("");
    const destinationIp = ref("");
    const selectApplied = ref(0);
    const selectApplied2 = ref(listIpObject.value[0].name);
    const $v = useVuelidate(
      {
        originalIp: { required },
        translatedIp: { required },
      },
      {
        originalIp,
        translatedIp,
      }
    );
    const onCancel = () => {
      context.emit("update:dialogSnat", false);
    };
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // const appliedOn = Object.assign({}, ...selectApplied.value);

      // if (appliedOn) {
      //   const data = appliedOn.value.replace("vnic-", "");
      //   vnic.value = data;
      // }
      vnic.value = selectApplied.value.toString();
      const data = {
        action: "snat",
        description: description.value,
        enabled: switch1.value,
        loggingEnabled: switch2.value,
        originalAddress: originalIp.value,
        translatedAddress: translatedIp.value,
        ruleType: "user",
        originalPort: "any",
        protocol: "any",
        snatMatchDestinationAddress: "any",
        snatMatchDestinationPort: "any",
        translatedPort: "any",
        vnic: vnic.value,
      };
      listRuleNatNsxv.value.push(data);

      const id = context.root.$route.params.idEdge;
      const params = {
        enabled: payloadRuleNat.value.enabled,
        featureType: payloadRuleNat.value.featureType,
        version: payloadRuleNat.value.version,
        nat64Rules: {},
        rules: {
          natRulesDtos: listRuleNatNsxv.value,
        },
      };
      updateRuleNatNsxv({ id: id, params: params });
      context.emit("update:dialogSnat", false);
      description.value = "";
      originalIp.value = "";
      translatedIp.value = "";
      switch1.value = true;
      switch2.value = false;
      selectApplied.value = 0;
      $v.value.$reset();
    };
    const close = () => {
      dialogIp.value = false;
    };
    const keep = () => {
      translatedIp.value = ipSelect.value;
      dialogIp.value = false;
    };
    const ipSelect = ref("");
    const ipFromObject = ref([]);
    const changeIp = (event) => {
      const ip = listIpObject.value.find((item) => {
        if (item.name == event) {
          return item;
        }
      });
      if (ip) {
        const abc = ip.addressGroups.addressGroups[0].secondaryAddresses.ipAddress
          ? JSON.parse(JSON.stringify(ip.addressGroups.addressGroups[0].secondaryAddresses.ipAddress))
          : [];
        abc.push(ip.addressGroups.addressGroups[0].primaryAddress);

        ipFromObject.value = abc;
        ipSelect.value = ip.addressGroups.addressGroups[0].primaryAddress;
      }
    };
    return {
      $v,
      onCancel,
      onSubmit,
      selectProtocol,
      listProtocol,
      sourcePort,
      destinationPort,
      switch1,
      switch2,
      selectApplied,
      dialogIp,
      close,
      keep,
      originalIp,
      translatedIp,
      originalPort,
      imcpType,
      translatedPort,
      sourceAddress,
      description,
      destinationIp,
      listIpObject,
      listObject,
      vnic,
      selectApplied2,
      changeIp,
      ipSelect,
      ipFromObject,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
