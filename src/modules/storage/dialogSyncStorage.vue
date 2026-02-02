<template>
    <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
        <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Sync Storage</div>
        </v-card-title>
        <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
            Input Openstack Storage ID
        </p>
        </div>
        <v-card-text class="pa-0 mb-4">
        <v-text-field
            id="storageID"
            v-model="storageID"
            flat
            outlined
            :error-messages="storageIDError"
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
            @click="syncStorageHandler"
            >Sync Storage</v-btn>
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
import STORAGE from "./namespace";
export default {
    props: ["value"],
    setup: (props, context) => {
        const dialog = computed({
        get: () => props.value,
        set: (val) => {
            val == false ? (storageID.value = "") : "";
            context.emit("input", val);
        },
        });
        
        const { fetchstorages, syncStorage } = useNamespacedActions(STORAGE, ["fetchstorages", "syncStorage"]);
        const { isLoading } = useNamespacedState(STORAGE, ["isLoading"]);
        const storageID = ref("");
        const storageIDError = ref("");

        const syncStorageHandler = async () => {
            if (!storageID.value) {
                storageIDError.value = "Storage ID is required";
                return;
            }
            const sync = await syncStorage({ storageID: storageID.value });
            if (sync.status === 200) {
                context.emit("input", false);
                await fetchstorages();
            } 
        };

        return {
            storageID,
            dialog,
            isLoading,
            syncStorageHandler,
            storageIDError
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
  