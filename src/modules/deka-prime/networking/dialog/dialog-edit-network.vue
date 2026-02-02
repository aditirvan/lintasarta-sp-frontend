<template>
  <v-dialog persistent v-model="dialog" max-width="700">
    <v-card class="pt-7 rounded-lg">
      <v-card-text>
        <div class="d-flex flex-row">
          <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
          <p class="fz-21 font-weight-bold mb-0">Edit Network</p>
        </div>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3">Name</v-col>
          <v-col
            ><v-text-field
              placeholder="Name"
              solo
              v-model="name"
              @blur="$v.name.$touch()"
              :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3">Description</v-col>
          <v-col><v-textarea placeholder="Description" solo v-model="desc"></v-textarea></v-col>
        </v-row>
      </v-card-text>
      <!-- <v-divider></v-divider> -->
      <!-- <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Dual-Stack Mode</v-col>
          <v-col><v-switch v-model="switch1" inset></v-switch></v-col>
        </v-row>
      </v-card-text> -->
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Gateway CIDR</v-col>
          <v-col><v-text-field placeholder="10.0.0.1/24" solo :value="cidr" disabled></v-text-field></v-col>
        </v-row>
      </v-card-text>
      <!-- <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Gateway CIDR - IPv6</v-col>
          <v-col><v-text-field placeholder="IPv6" solo></v-text-field></v-col>
        </v-row>
      </v-card-text> -->
      <!-- <v-divider></v-divider> -->
      <!-- <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Dual-Stack Mode</v-col>
          <v-col><v-switch v-model="switch1" inset></v-switch></v-col>  
        </v-row>
      </v-card-text> -->
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Shared</v-col>
          <v-col><v-switch v-model="shared" inset></v-switch></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-data-table :headers="headers" :items="edgeConnection" item-key="HREF" single-line class="elevation-0 mt-9" hide-default-footer>
          <template #[`item.id`]="{ item }">
            <v-radio-group v-model="radioTable">
              <v-radio :value="item.Name" :key="edgeConnection.indexOf(item)"></v-radio>
            </v-radio-group> </template
        ></v-data-table>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Connection Type</v-col>
          <v-col><v-select :items="items" label="Select" v-model="connectingType" solo></v-select></v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col md="3" class="d-flex align-center">Guest VLAN Allowed</v-col>
          <v-col><v-switch v-model="switch1" inset></v-switch></v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn class="white--text" color="#a5b3bf" depressed block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn color="secondary" depressed block height="35" @click="onSumbit()" :loading="loadingUpdate"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, onMounted, ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../namespace";
import { required, minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    dataConnect: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const cidr = computed(() => {
      return `${detailSubnets.value.gateway}/${detailSubnets.value.prefixLength}`;
    });
    const { updateNetwork } = useNamespacedActions(DPNETWORK, ["updateNetwork"]);
    const { detailNetwork, detailOrg, detailVdc, detailSubnets, detailConnection, edgeConnection, loadingUpdate } = useNamespacedGetters(DPNETWORK, [
      "detailNetwork",
      "detailOrg",
      "detailVdc",
      "detailSubnets",
      "detailConnection",
      "edgeConnection",
      "loadingUpdate",
    ]);
    // onMounted(() => {
    //   // getEdgeConnection(props.dataConnect);
    // });
    const switch1 = ref(detailNetwork.value.guestVlanTaggingAllowed);
    const desc = ref(detailNetwork.value.description);
    const name = ref(detailNetwork.value.name);
    const shared = ref(detailNetwork.value.shared);
    const selected = ref([]);
    const singleSelect = ref(true);
    const items = ref(["INTERNAL", "DISTRIBUTED", "SUBINTERFACE"]);
    const onCancel = () => {
      context.emit("update:dialog", false);
    };

    const onSumbit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = {
        id: detailNetwork.value.id,
        name: name.value,
        description: detailNetwork.value.description,
        subnets: detailNetwork.value.subnets,
        backingNetworkType: detailNetwork.value.backingNetworkType,
        networkType: detailNetwork.value.networkType,
        orgVdc: detailNetwork.value.orgVdc,
        ownerRef: detailNetwork.value.ownerRef,
        orgRef: detailNetwork.value.orgRef,
        connection: {
          routerRef: detailNetwork.value.connection.routerRef,
          connectionType: connectingType.value,
          connectionTypeValue: connectingType.value,
        },
        shared: shared.value,
        enableDualSubnetNetwork: false,
        status: detailNetwork.value.status,
        guestVlanTaggingAllowed: switch1.value,
        retainNicResources: detailNetwork.value.retainNicResources,
        totalIpCount: detailNetwork.value.totalIpCount,
        usedIpCount: detailNetwork.value.usedIpCount,
        routeAdvertised: detailNetwork.value.routeAdvertised,
      };
      console.log("kirim", params);
      updateNetwork(params);
    };
    const headers = ref([
      { text: "", value: "id" },
      { text: "Name", value: "Name" },
      { text: "External Network", value: "NumberOfExtNetworks" },
      { text: "Org VDC Networ", value: "NumberOfOrgNetworks" },
    ]);
    
    const radioTable = ref(detailConnection.value.routerRef.name);
    const connectingType = ref(detailConnection.value.connectionType);
    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
      },
      {
        name,
      }
    );

    return {
      onCancel,
      onSumbit,
      switch1,
      desc,
      name,
      selected,
      headers,
      singleSelect,
      items,
      edgeConnection,
      detailNetwork,
      detailOrg,
      detailSubnets,
      detailVdc,
      detailConnection,
      cidr,
      radioTable,
      connectingType,
      loadingUpdate,
      shared,
      $v,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
