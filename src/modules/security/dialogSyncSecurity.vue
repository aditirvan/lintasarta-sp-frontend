<template>
    <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
        <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Sync Security</div>
        </v-card-title>
        <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
            Input Openstack Security ID
        </p>
        </div>
        <v-card-text class="pa-0 mb-4">
        <v-text-field
            id="securityID"
            v-model="securityID"
            flat
            outlined
            :error-messages="securityIDError"
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
            @click="syncSecurityHandler"
            >Sync Security</v-btn>
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
import SECURITY from "./namespace";
export default {
    props: ["value"],
    setup: (props, context) => {
        const dialog = computed({
        get: () => props.value,
        set: (val) => {
            val == false ? (securityID.value = "") : "";
            context.emit("input", val);
        },
        });
        
        const { fetchsecurity, syncSecurity } = useNamespacedActions(SECURITY, ["fetchsecurity", "syncSecurity"]);
        const { isLoading } = useNamespacedState(SECURITY, ["isLoading"]);
        const securityID = ref("");
        const securityIDError = ref("");

        const syncSecurityHandler = async () => {
            if (!securityID.value) {
                securityIDError.value = "Security ID is required";
                return;
            }
            const sync = await syncSecurity({ securityID: securityID.value });
            if (sync.status === 200) {
                context.emit("input", false);
                await fetchsecurity();
            } 
        };

        return {
            securityID,
            dialog,
            isLoading,
            syncSecurityHandler,
            securityIDError
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