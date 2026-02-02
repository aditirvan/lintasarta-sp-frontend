<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title>
                <div class="headline font-weight-bold font--text pb-4">
                    Renewal SSL
                </div>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-form ref="form">
                    <span class="font-weight-bold">SSL</span>
                    <v-select v-model="ssl" :error-messages="createErrorMessage('ssl', $v)"
                        v-if="listSsl"
                        :items="listSsl.filter(t => t.fqdn !== existingSSL).map((e) => e.fqdn)" class="mt-4" height="35"
                        outlined placeholder="Select SSL">
                    </v-select>
                </v-form>
            </v-card-text>
            <v-card-actions class="pt-2 px-3">
                <v-row class="ma-0">
                    <v-col cols="6">
                        <v-btn @click="onCancel()" color="accent" block depressed height="50">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn @click="onSubmit()" color="secondary" block height="50" depresse>
                            <beat-loader v-if="isLoadingRenewalSSL" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
                            <span v-else>Apply Changes</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { useDialog } from '@/composable/usedialog';
import { createErrorMessage } from '@/lib/validator';
import {
    useNamespacedActions,
    useNamespacedGetters,
    useState,
} from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default;
const { required } = require("@vuelidate/validators");
import { ref, onMounted, watch } from "@vue/composition-api";
export default {
    props: {
        value: Boolean,
        id: String,
        name: String,
        existingSSL: String
    },
    setup(props, context) {
        const { listSsl, isLoadingRenewalSSL } = useNamespacedGetters("CDN", [
            "listSsl",
            "isLoadingRenewalSSL"
        ]);
        const { getListSSL, reuploadSSL } = useNamespacedActions("CDN", [
            "getListSSL",
            "reuploadSSL"
        ]);
        const { topbarloading } = useState(["topbarloading"]);
        const { showErrorToast, showSuccessToast } = useNamespacedActions(
            "HOMEPAGE",
            ["showErrorToast", "showSuccessToast"]
        );
        const { dialog } = useDialog(props, context)
        const ssl = ref('')

        onMounted(async () => {
            await getListSSL({ isNotExpired: true })
        });

        const $v = useVuelidate({ ssl: { required } }, { ssl });


        const onCancel = () => {
            dialog.value = false
        }

        const onSubmit = async () => {
            $v.value.ssl.$touch();
            if ($v.value.ssl.$errors.length) return;
            topbarloading.value.start();
            await reuploadSSL({ id: props.id, ssl: ssl.value })
            topbarloading.value.done()
            dialog.value = false
        }


        return {
            dialog,
            ssl,
            listSsl,
            createErrorMessage,
            $v,
            onCancel,
            onSubmit,
            isLoadingRenewalSSL
        }
    }
};
</script>