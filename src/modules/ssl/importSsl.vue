<template>
    <div>
        <v-row>
            <v-col cols="12" class="pt-3">
                <v-card flat class="rounded-lg">
                    <v-container fluid class="pa-7">
                        <v-row>
                            <v-col cols="12">
                                <div class="headline font-weight-bold font--text">
                                    Import SSL
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-row>
                                    <v-col cols="12" sm="12" md="6" class="mt-2">
                                        <span class="font-weight-bold">Certificate</span>
                                        <v-file-input v-model="certificateFile" outlined
                                            placeholder="Choose certificate file" class="mt-1"
                                            :error-messages="createErrorMessage('certificateFile')"></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="6" class="mt-2">
                                        <span class="font-weight-bold">Key</span>
                                        <v-file-input v-model="keyFile" outlined placeholder="Choose key file"
                                            :error-messages="createErrorMessage('keyFile')"></v-file-input>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="6" class="mt-2">
                                        <span class="font-weight-bold">Description</span>
                                        <v-textarea :disabled="isLoading" maxlength="300" v-model="description" outlined
                                            placeholder="Description">
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <v-btn :disabled="isLoading" depressed block height="50" class="accent"
                                            to="/ssl">
                                            Cancel
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-btn depressed id="CreateSSL" @click="create" block height="50"
                                            class="secondary">
                                            <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'"
                                                :size="'10px'"></beat-loader>
                                            <span v-else>Import SSL</span>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import {
    useNamespacedActions,
    useNamespacedGetters,
    useState,
} from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default;
const { required, minLength } = require("@vuelidate/validators");
import moment from "moment";
export default {
    components: {},
    setup(props, context) {
        context.root.$router;
        const description = ref("");
        const certificateFile = ref(null);
        const keyFile = ref(null);
        const { listSsl, isLoading, isCreated } = useNamespacedGetters(
            "SSL",
            ["listSsl", "isLoading", "isCreated"]
        );
        const { importSSL } = useNamespacedActions("SSL", [
            "importSSL",
        ]);
        const { topbarloading } = useState(["topbarloading"]);


        const $v = useVuelidate({
            certificateFile: { required },
            keyFile: { required } 
        },
        {  certificateFile, keyFile }
        );
        const toFormData = (o) => {
            return Object.entries(o).reduce(
                (d, e) => (d.append(...e), d),
                new FormData()
            );
        };

        async function create() {
            $v.value.$touch();
            if ($v.value.$errors.length) return;
            const payload = {
                certificate: certificateFile.value,
                key: keyFile.value,
                description: description.value,
            };

            topbarloading.value.start();
            await importSSL(toFormData(payload));
            topbarloading.value.done();
            context.root.$router.push("/ssl");
        }
        function createErrorMessage(element) {
            return $v.value[element].$errors.length
                ? $v.value[element].$errors[0].$message
                : "";
        }

        watch(isCreated, (val) => {
            if (val) {
                description.value = "";
            }
        });

        return {
            listSsl,
            isLoading,
            isCreated,
            create,
            description,
            createErrorMessage,
            certificateFile,
            keyFile,
        };
    },
};
</script>