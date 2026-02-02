<template>
  <v-dialog persistent v-model="editRoutes" max-width="600">
    <v-card class="overflow-x-hidden" v-if="dataEdit">
      <v-row>
        <v-col class="pt-0" cols="9">
          <v-card-text>
            <h2>Edit Static Route</h2>
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
      <v-card-text class="pb-2">
        <v-row>
          <v-col class="d-flex align-items-center">Network</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-text-field
              v-model="network"
              @blur="$v.network.$touch()"
              :error-messages="$v.network.$errors.length ? 'Network couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <p class="ml-6 mb-0 fz-12 font-weight-light">Network should be entered in CIDR format e.g 192.169.1.0/24</p>

      <v-card-text class="pb-2">
        <v-row>
          <v-col class="d-flex align-items-center">Next Hop</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-text-field
              v-model="nextHop"
              @blur="$v.nextHop.$touch()"
              :error-messages="$v.nextHop.$errors.length ? 'Next Hop couldnt be empty.' : ''"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 || event.charCode == 47"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="pb-2">
        <v-row>
          <v-col>MTU</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-text-field outlined dense v-model="mtu" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="pb-2">
        <v-row>
          <v-col>Admin Distance</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-text-field outlined dense v-model="adminDistance"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="pb-2">
        <v-row>
          <v-col>Interface</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-select :items="listIpObject" v-model="vnic" item-text="name" item-value="index"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="pb-2">
        <v-row>
          <v-col>Description</v-col>
          <v-col class="pt-0 mt-0 pb-0 mb-0" cols="12" sm="6">
            <v-textarea outlined v-model="description"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn color="secondary" block height="35" @click="onSubmit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { reactive, ref, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: {
    editRoutes: {
      type: Boolean,
      default: false,
    },
    dataEdit: {
      type: Object,
      default: null,
    },
    idRow: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const { listStaticRoute, payloadStaticRoute, listObject, listIpObject } = useNamespacedGetters(DPSECURITY, [
      "listStaticRoute",
      "payloadStaticRoute",
      "listObject",
      "listIpObject",
    ]);
    const { updateStaticRoutesNsxv } = useNamespacedActions(DPSECURITY, ["updateStaticRoutesNsxv"]);
    const network = ref(props.dataEdit.network);
    const nextHop = ref(props.dataEdit.nextHop);

    const description = ref(props.dataEdit.description);

    const mtu = ref(props.dataEdit.mtu);
    const vnic = ref(parseInt(props.dataEdit.vnic));
    const adminDistance = ref(props.dataEdit.adminDistance);
    const onCancel = () => {
      context.emit("update:editRoutes", false);
    };
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // const patern = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}?(\/([0-9]{1,3}))/;
      // const satu = network.value.match(patern);
      // console.log("satu", satu);

      // const vnic = getVnic(selectInterface.value);

      const id = context.root.$route.params.idEdge;
      listStaticRoute.value.find((item, index) => {
        if (index == props.idRow) {
          return (
            (item.description = description.value),
            (item.vnic = vnic.value.toString()),
            (item.network = network.value),
            (item.nextHop = nextHop.value),
            (item.adminDistance = parseInt(adminDistance.value)),
            (item.mtu = parseInt(mtu.value))
          );
        }
      });

      const params = {
        defaultRoute: {
          adminDistance: payloadStaticRoute.value.defaultRoute.adminDistance,
          gatewayAddress: payloadStaticRoute.value.defaultRoute.gatewayAddress,
          mtu: payloadStaticRoute.value.defaultRoute.mtu,
          vnic: payloadStaticRoute.value.defaultRoute.vnic,
        },
        staticRoutes: {
          staticRoutes: listStaticRoute.value,
        },
      };
      updateStaticRoutesNsxv({ id: id, params: params });
      context.emit("update:editRoutes", false);
      context.emit("update:idRow", null);
      context.emit("update:dataEdit", null);
    };

    const $v = useVuelidate(
      {
        network: { required },
        nextHop: { required },
      },
      {
        network,
        nextHop,
      }
    );
    const getVnic = (id) => {
      const desti = listObject.value.map((item) => {
        return { name: item.name, type: item.type, requiredProperties: Object.assign({}, ...item.requiredProperties) };
      });

      const data = desti.find((element) => {
        if (element.name == id) {
          return element;
        }
      });
      const data1 = data.requiredProperties.value;
      return data1.replace("vnic-", "");
    };

    const getVnicName = (id) => {
      const vnic = `vnic-${id}`;
      const desti = listObject.value.map((item) => {
        return { name: item.name, type: item.type, requiredProperties: Object.assign({}, ...item.requiredProperties) };
      });

      const data = desti.find((element) => {
        if (element.requiredProperties.value == vnic) {
          return element;
        }
      });
      return data?.name;
    };
    return {
      onCancel,
      onSubmit,
      getVnic,
      getVnicName,
      $v,
      nextHop,
      mtu,
      adminDistance,
      vnic,
      listObject,
      network,
      description,
      listStaticRoute,
      payloadStaticRoute,
      listIpObject,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
