<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title>
                <div class="headline font-weight-bold font--text pb-4">
                    Location Configuration
                </div>
            </v-card-title>
            <v-card-text class="pb-0" v-if="isValidPassword === null || isValidPassword === false">
                <p class="font-weight-bold pb-2">Your Password</p>
                <v-text-field outlined placeholder="Please enter your password" v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
                    name="input-10-1" @click:append="showPassword = !showPassword"
                    :error-messages="createErrorMessage('password', $v)" />
            </v-card-text>
            <v-card-text class="pb-0" v-else>
                <v-form ref="form">
                    <span class="font-weight-bold">Location</span>
                    <v-select v-model="selectedTags" :error-messages="createErrorMessage('selectedTags', $v)"
                        :items="listTag.filter(e => e.name !== tags).map((t) => t.name.toUpperCase())" class="mt-4" height="35" outlined
                        placeholder="Select CDN Location">
                    </v-select>
                </v-form>
            </v-card-text>
            <v-card-actions class="pt-2 px-3">
                <v-row class="ma-0" v-if="!isValidPassword">
                    <v-col cols="6">
                        <v-btn color="accent" block depressed height="50" :disabled="isLoadingCheckPassword"
                            @click="onCancel('password')">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn color="secondary" block height="50" :disabled="isLoadingCheckPassword" depressed
                            @click="validatePassword">
                            <beat-loader v-if="isLoadingCheckPassword" :loading="isLoadingCheckPassword"
                                :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
                            <span v-else>Submit</span>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row class="ma-0" v-else>
                    <v-col cols="6">
                        <v-btn color="accent" block depressed height="50" :disabled="isLoadingUpdateDeployment"
                            @click="onCancel('selectedTags')">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn color="secondary" block height="50" :disabled="isLoadingUpdateDeployment" depressed
                            @click="updateCDNLocation">
                            <beat-loader v-if="isLoadingUpdateDeployment" :loading="isLoadingUpdateDeployment"
                                :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
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
    useMutations,
    useState,
} from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default;
const { required } = require("@vuelidate/validators");
import { ref, computed, onMounted, watch, onUpdated } from "@vue/composition-api";
export default {
    props: {
        value: Boolean,
        tags: String,
        id: String,
        name: String,
    },
    setup(props, context) {
        const { listTag, isValidPassword, isLoadingUpdateDeployment, isLoadingCheckPassword } = useNamespacedGetters("CDN", [
            "listTag",
            "isValidPassword",
            "isLoadingUpdateDeployment",
            "isLoadingCheckPassword",
        ]);
        const { getListTag, checkingPassword, updateDeployment } = useNamespacedActions("CDN", [
            "getListTag",
            "checkingPassword",
            "updateDeployment"
        ]);
        const { topbarloading } = useState(["topbarloading"]);
        const { dialog } = useDialog(props, context)
        const isLoading = ref(false)
        const password = ref("");
        const showPassword = ref(false);
        const selectedTags = ref(null)

        onMounted(async () => {
            await getListTag()
        });

        watch(() => props.tags, (v) => {
            selectedTags.value = props.tags
        })

        watch(dialog, (val) => {
            if (!val) {
                password.value = ""
                selectedTags.value = props.tags
            }
        })

        const rules = {
            password: { required },
            selectedTags: { required }
        }
        const $v = useVuelidate(rules, { password, selectedTags });

        async function onCancel(type) {
            dialog.value = false
            if (type === "password") {
                password.value = ""
            } else if (type === "selectedTags") {
                selectedTags.value = props.tags
            }
        }

        async function validatePassword() {
            $v.value.password.$touch();
            if ($v.value.password.$errors.length) return;
            await checkingPassword({ password: password.value })
            $v.value.password.$reset()
        }

        async function updateCDNLocation() {
            $v.value.selectedTags.$touch();
            if ($v.value.selectedTags.$errors.length) return;
            const findTagId = listTag.value.filter(e => e.name.toUpperCase() === selectedTags.value).map(e => e.id)
            const payload = {
                id: props.id,
                tagId: findTagId.length?findTagId[0]:''
            }
            topbarloading.value.start();
            await updateDeployment(payload)
            topbarloading.value.done()
            dialog.value = false
        }
        return {
            dialog,
            password,
            listTag,
            selectedTags,
            isValidPassword,
            validatePassword,
            updateCDNLocation,
            createErrorMessage,
            isLoadingUpdateDeployment,
            showPassword,
            isLoadingCheckPassword,
            $v,
            isLoading,
            onCancel,
        }
    }
};
</script>