<template>
  <v-dialog persistent v-model="delRoutes" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Delete NAT</h2>
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
        <div class="text-center mt-2">
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently delete the Routing.</p>
          <p class="text-h7">I understand the consequences, delete this Routing.</p>
        </div>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn color="error" depressed block height="35" @click="onSubmit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../namespace";
export default {
  props: {
    delRoutes: {
      type: Boolean,
      default: false,
    },

    idRow: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const { listStaticRoute, payloadStaticRoute } = useNamespacedGetters(DPSECURITY, ["listStaticRoute", "payloadStaticRoute", "listObject"]);
    const { updateStaticRoutesNsxv } = useNamespacedActions(DPSECURITY, ["updateStaticRoutesNsxv"]);

    const onCancel = () => {
      context.emit("update:delRoutes", false);
    };
    const onSubmit = () => {
      const id = context.root.$route.params.idEdge;
      listStaticRoute.value.splice(props.idRow, 1);

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
      context.emit("update:delRoutes", false);
      context.emit("update:idRow", null);
      context.emit("update:dataEdit", null);
    };
    return {
      onCancel,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
