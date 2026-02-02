<template>
  <v-dialog persistent v-model="editDnat" max-width="700">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Edit DNAT Rule</h2>
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
              v-model="originalAddress"
              @blur="$v.originalAddress.$touch()"
              :error-messages="$v.originalAddress.$errors.length ? 'Original IP/Range couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
            <v-col md="3"
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
          <v-col md="3" class="d-flex align-items-center">Protocol</v-col>
          <v-col class="pt-0 mt-0" cols="12" sm="6">
            <v-select :items="listProtocol" v-model="protocol" item-text="name" item-value="value"></v-select>
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
            <v-text-field v-model="protocol" placeholder="any" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Translated IP/Range</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field
              v-model="translatedAddress"
              @blur="$v.translatedAddress.$touch()"
              :error-messages="$v.translatedAddress.$errors.length ? 'Translated IP/Range couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
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
          <v-col md="3" class="d-flex align-items-center">Source IP Address</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field v-model="dnatMatchSourceAddress" disabled></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-items-center">Source Port</v-col>
          <v-col class="pt-0 mt-0 mt-5" cols="12" sm="6">
            <v-text-field v-model="dnatMatchSourcePort" disabled></v-text-field>
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
            <v-col class="d-flex"><v-switch v-model="enabled" inset></v-switch></v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-text>
        <v-col cols="6" class="pt-0 pb-0">
          <v-row class="ml-2">
            <v-col class="d-flex align-items-center">Enable Logging</v-col>
            <v-col class="d-flex"><v-switch v-model="loggingEnabled" inset></v-switch></v-col>
          </v-row>
        </v-col>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn class="" color="secondary" block height="35" @click="onSubmit()"> Confirm </v-btn>
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
              <v-select :items="listIpObject" v-model="selectApplied2" item-text="name" item-value="name" @change="changeIp($event)"></v-select>
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
              <v-btn class="white--text" color="#a5b3bf" block height="35" @click="close()"> Cancel </v-btn>
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
    editDnat: {
      type: Boolean,
      default: false,
    },
    dataEdit: {
      type: Object,
      default: () => {},
    },
    idRow: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { listRuleNatNsxv, payloadRuleNat, listObject, listIpObject } = useNamespacedGetters(DPSECURITY, [
      "listRuleNatNsxv",
      "payloadRuleNat",
      "listObject",
      "listIpObject",
    ]);
    const { updateRuleNatNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleNatNsxv"]);

    onMounted(() => {
      changeIp(listIpObject.value[0]?.name);
    });

    const selectApplied = ref(parseInt(props.dataEdit.vnic));
    const dialogIp = ref(false);
    const listProtocol = ref([
      { id: 1, name: "TCP", value: "tcp" },
      { id: 2, name: "UDP", value: "udp" },
      { id: 3, name: "ICMP", value: "icmp" },
      { id: 4, name: "Any", value: "any" },
    ]);
    const vnic = ref("");
    const ipFromObject = ref([]);
    const ipSelect = ref("");
    const originalAddress = ref(props.dataEdit.originalAddress);
    const selectApplied2 = ref(listIpObject.value[0]?.name);
    const protocol = ref(props.dataEdit.protocol);
    const originalPort = ref(props.dataEdit.originalPort);
    const translatedAddress = ref(props.dataEdit.translatedAddress);
    const translatedPort = ref(props.dataEdit.translatedPort);
    const dnatMatchSourceAddress = ref(props.dataEdit.dnatMatchSourceAddress);
    const dnatMatchSourcePort = ref(props.dataEdit.dnatMatchSourcePort);
    const description = ref(props.dataEdit.description);
    const enabled = ref(props.dataEdit.enabled);
    const loggingEnabled = ref(props.dataEdit.loggingEnabled);
    const imcpType = ref("");
    const $v = useVuelidate(
      {
        originalAddress: { required },
        translatedAddress: { required },
      },
      {
        originalAddress,
        translatedAddress,
      }
    );
    const onCancel = () => {
      context.emit("update:editDnat", false);
    };
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      vnic.value = selectApplied.value.toString();

      listRuleNatNsxv.value.find((item) => {
        if (item.ruleId == props.dataEdit.ruleId) {
          return (
            (item.description = description.value),
            (item.enabled = enabled.value),
            (item.loggingEnabled = loggingEnabled.value),
            (item.originalAddress = originalAddress.value),
            (item.originalPort = originalPort.value),
            (item.protocol = protocol.value),
            (item.dnatMatchSourceAddress = dnatMatchSourceAddress.value),
            (item.dnatMatchSourcePort = dnatMatchSourcePort.value),
            (item.translatedAddress = translatedAddress.value),
            (item.translatedPort = translatedPort.value),
            (item.vnic = vnic.value)
          );
        }
      });

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
      console.log("paramss", params);
      updateRuleNatNsxv({ id: id, params: params });
      context.emit("update:editDnat", false);
      context.emit("update:idRow", 0);
    };
    const close = () => {
      dialogIp.value = false;
    };
    const keep = () => {
      originalAddress.value = ipSelect.value;
      dialogIp.value = false;
    };
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
      listProtocol,
      dialogIp,
      close,
      keep,
      originalPort,
      imcpType,
      translatedPort,
      description,
      listIpObject,
      listObject,
      selectApplied,
      originalAddress,
      selectApplied2,
      ipFromObject,
      changeIp,
      ipSelect,
      protocol,
      translatedAddress,
      dnatMatchSourceAddress,
      dnatMatchSourcePort,
      enabled,
      loggingEnabled,
      vnic,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
