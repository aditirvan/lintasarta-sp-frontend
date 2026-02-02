<template>
  <v-dialog persistent v-model="addRoutes" max-width="600">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0" cols="9">
          <v-card-text>
            <h2>Add Static Route</h2>
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
              v-model="nextHoop"
              @blur="$v.nextHoop.$touch()"
              :error-messages="$v.nextHoop.$errors.length ? 'Next Hop couldnt be empty.' : ''"
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
            <v-select
              :items="listObject"
              v-model="selectInterface"
              item-text="name"
              item-value="name"
              @blur="$v.selectInterface.$touch()"
              :error-messages="$v.selectInterface.$errors.length ? 'Interface couldnt be empty.' : ''"
            ></v-select>
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
            <v-btn color="secondary" block height="35" @click="onSubmit()" :loading="loadingRoute"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: {
    addRoutes: {
      type: Boolean,
      default: false,
    },
    idRow: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const { listStaticRoute, payloadStaticRoute, listObject, loadingRoute, statusRoute } = useNamespacedGetters(DPSECURITY, [
      "listStaticRoute",
      "payloadStaticRoute",
      "listObject",
      "loadingRoute",
      "statusRoute",
    ]);
    const { updateStaticRoutesNsxv } = useNamespacedActions(DPSECURITY, ["updateStaticRoutesNsxv"]);
    onMounted(() => {
      $v.value.$reset();
    });

    const network = ref("");
    const nextHoop = ref("");
    const description = ref("");
    const mtu = ref(1500);
    const selectInterface = ref("");
    const adminDistance = ref(1);
    const onCancel = () => {
      $v.value.$reset();
      network.value = "";
      nextHoop.value = "";
      description.value = "";
      selectInterface.value = "";
      adminDistance.value = 1;
      mtu.value = 1500;
      context.emit("update:addRoutes", false);
    };
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // const patern = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}?(\/([0-9]{1,3}))/;
      // const satu = network.value.match(patern);
      // console.log("satu", satu);

      const vnic = getVnic(selectInterface.value);

      const id = context.root.$route.params.idEdge;
      const data = {
        description: description.value,
        type: "user",
        vnic: vnic,
        network: network.value,
        nextHop: nextHoop.value,
        adminDistance: adminDistance.value,
        mtu: mtu.value,
      };
      listStaticRoute.value.push(data);

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
      context.emit("update:addRoutes", false);
      context.emit("update:idRow", null);
    };

    const $v = useVuelidate(
      {
        network: { required },
        nextHoop: { required },
        selectInterface: { required },
      },
      {
        network,
        nextHoop,
        selectInterface,
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

    watch(statusRoute, () => {
      if (statusRoute.value == true) {
        network.value = "";
        nextHoop.value = "";
        description.value = "";
        selectInterface.value = "";
        adminDistance.value = 1;
        mtu.value = 1500;
        context.emit("update:addRoutes", false);
        context.emit("update:idRow", null);
      }
    });

    return {
      onCancel,
      onSubmit,
      getVnic,
      $v,
      network,
      nextHoop,
      mtu,
      adminDistance,
      selectInterface,
      listObject,
      description,
      loadingRoute,
      statusRoute,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
