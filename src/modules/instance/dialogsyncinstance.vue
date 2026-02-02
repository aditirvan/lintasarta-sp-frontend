<template>
    <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
        <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Sync Instance</div>
        </v-card-title>
        <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
            Input Openstack Instance ID
        </p>
        </div>
        <v-card-text class="pa-0 mb-4">
        <v-text-field
            id="instanceID"
            v-model="instanceID"
            flat
            outlined
            :error-messages="instanceIDError"
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
            @click="syncInstanceHandler"
            >Sync Instance</v-btn>
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
import INSTANCE from "./namespace";
export default {
    props: ["value", "instanceName", "selectedinstance"],
    setup: (props, context) => {
        const dialog = computed({
        get: () => props.value,
        set: (val) => {
            val == false ? (instanceID.value = "") : "";
            context.emit("input", val);
        },
        });
        
        const { fetchPaginatedInstances, syncInstance } = useNamespacedActions(INSTANCE, ["fetchPaginatedInstances", "syncInstance"]);
        const { isLoading } = useNamespacedState(INSTANCE, ["isLoading"]);
        const instanceID = ref("");
        const instanceIDError = ref("");

        const syncInstanceHandler = async () => {
            if (!instanceID.value) {
                instanceIDError.value = "Instance ID is required";
                return;
            }
            const sync = await syncInstance({ instanceID: instanceID.value });
            if (sync.status === 200) {
                context.emit("input", false);
                await fetchPaginatedInstances();
            } 
        };

        return {
            instanceID,
            dialog,
            isLoading,
            syncInstanceHandler,
            instanceIDError
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
  