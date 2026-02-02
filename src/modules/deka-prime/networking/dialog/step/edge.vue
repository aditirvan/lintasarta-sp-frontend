<template>
  <div>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col sm="12" md="12" class="pt-0 pb-0"
          ><p class="font-weight-bold fz-16">Edge Connection</p>
          <v-data-table :headers="headers" :items="edgeConnection" item-key="HREF" single-line class="elevation-0 mt-9" hide-default-footer>
            <template #[`item.id`]="{ item }">
              <v-radio-group v-model="radioTable">
                <v-radio :value="item.HREF" @click="getRow(item)" :key="edgeConnection.indexOf(item)"></v-radio>
              </v-radio-group> </template
          ></v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col class="d-flex mt-3" md="3" sm="3">
          <p class="font-weight-bold">Connection Type</p>
        </v-col>
        <v-col class="d-flex" md="6" sm="6">
          <v-select :items="items" label="select" solo v-model="selectConnection"></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col class="d-flex align-content-center align-center" md="3" sm="3">
          <p class="font-weight-bold">Guest VLAN Allowed</p>
        </v-col>
        <v-col class="d-flex pt-0" md="6" sm="6">
          <v-switch v-model="guestVlan" inset></v-switch>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link to="/networking"> <v-btn color="#a5b3bf" class="white--text fz-16" block height="40"> Cancel </v-btn></router-link>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step > 1">
          <v-btn class="fz-16" color="secondary" block outlined height="40" @click="prev()"> Previous </v-btn>
        </v-col>
        <v-col class="d-flex flex-row justify-center" cols="3" v-if="step <= 6">
          <v-btn class="white--text fz-16" color="secondary" block height="40" @click="next()" :disabled="radioTable == false"> Next </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useNamespacedGetters } from "vuex-composition-helpers";
import { DPNETWORK } from "../../namespace";
export default {
  props: {
    step: {
      type: Number,
      default: 0,
    },
    connect: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { edgeConnection } = useNamespacedGetters(DPNETWORK, ["edgeConnection"]);
    const radioTable = ref(props.connect.HREF);
    const guestVlan = ref(false);
    const connectionName = ref(props.connect.connectionName);
    const selectConnection = ref("Internal");
    const idGateway = ref(props.connect.idGateway);
    const idVdc = ref(props.connect.idVdc);
    const idHref = ref(props.connect.HREF);
    const headers = ref([
      { text: "", value: "id" },
      { text: "Name", value: "Name" },
      { text: "External Network", value: "NumberOfExtNetworks" },
      { text: "Org VDC Network", value: "NumberOfOrgNetworks" },
    ]);

    const items = ref(["Internal", "Distributed", "Subinterface"]);
    const getRow = (row) => {
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const id_gateway = row.HREF.match(pattern);
      const id_vdc = row.Vdc.match(pattern);
      idVdc.value = id_vdc[6];
      idGateway.value = id_gateway[6];
      connectionName.value = row.Name;
      idHref.value = row.HREF;
    };

    const next = () => {
      const data = {
        selectConnection: selectConnection.value.toUpperCase(),
        connectionName: connectionName.value,
        guestVlan: guestVlan.value,
        idGateway: `urn:vcloud:gateway:${idGateway.value}`,
        idVdc: `urn:vcloud:vdc:${idVdc.value}`,
        HREF: idHref.value,
      };
      context.emit("get-data", data);
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return {
      radioTable,
      headers,
      items,
      edgeConnection,
      connectionName,
      selectConnection,
      guestVlan,
      idGateway,
      idVdc,
      idHref,
      getRow,
      next,
      prev,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
  box-shadow: none;
  border: 1px solid black;
}
</style>
