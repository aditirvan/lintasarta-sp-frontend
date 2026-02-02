<template>
    <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
        <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Sync VPC Network</div>
        </v-card-title>
        <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
            Input Openstack Network ID
        </p>
        </div>
        <v-card-text class="pa-0 mb-4">
        <v-text-field
            id="networkID"
            v-model="networkID"
            flat
            outlined
            :error-messages="networkIDError"
        ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-0">
        <v-row class="ma-0">
            <v-btn
            id="confirm"
            class="secondary"
            block
            height="50"
            depressed
            @click="syncNetworkHandler"
            >Sync VPC Network</v-btn>
        </v-row>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>
<script>
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { computed, ref, watch } from "@vue/composition-api";
import NETWORKVPC from "./vpc/namespace";
export default {
    props: ["value"],
    setup: (props, context) => {
        const dialog = computed({
        get: () => props.value,
        set: (val) => {
            val == false ? (networkID.value = "") : "";
            context.emit("input", val);
        },
        });
        
        const { FETCH_VPC, syncVPC } = useNamespacedActions(NETWORKVPC, ["FETCH_VPC", "syncVPC"]);
        const { isLoading } = useNamespacedState(NETWORKVPC, ["isLoading"]);
        const networkID = ref("");
        const networkIDError = ref("");

        const syncNetworkHandler = async () => {
            if (!networkID.value) {
                networkIDError.value = "Network ID is required";
                return;
            }
            const sync = await syncVPC({ networkID: networkID.value });
            if (sync.status === 200) {
                context.emit("input", false);
                await FETCH_VPC();
            } 
        };

        return {
            networkID,
            dialog,
            isLoading,
            syncNetworkHandler,
            networkIDError
        };
    },
};
</script>
<style lang="css">
.banner {
    background-color: #faefd0;
    padding: 10px;
    border-radius: 8px;
}
</style>