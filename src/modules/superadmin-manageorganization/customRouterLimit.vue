<template>
<v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
        <div class="headline font-weight-bold font--text mb-4">
            Custom Router Limit
        </div>

        <v-card class="rounded-lg" flat v-if="isLoading">
            <v-card-text class="d-flex justify-center">
                <v-progress-circular style="margin: auto" :size="200" color="primary" indeterminate></v-progress-circular>
            </v-card-text>
        </v-card>
        <div v-else>
            <v-row>
                <v-col>
                    <p class="font-weight-bold"> NAT Gateway ( {{ getLimitRouter.nat_used  }} used )</p>
                    <v-row>
                        <v-col>
                            <v-text-field outlined placeholder="0" single-line v-model="nat" type="number" :error-messages="
                      $v.nat.$errors.length  ? $v.nat.$errors[0].$message : ''  " />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p class="font-weight-bold"> Floating IP ( {{ getLimitRouter.fip_used  }} used )</p>
                    <v-row>
                        <v-col>
                            <v-text-field outlined placeholder="0" single-line v-model="fip" type="number" :error-messages="
                      $v.fip.$errors.length  ? $v.fip.$errors[0].$message : '' " />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn height="58" depressed block color="accent" :to="`/organization-detail/${organizationId}`" exact>
                        <span style="font-size: 16px"> Cancel</span>
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn height="58" depressed block color="secondary" @click="submit">
                        <span style="font-size: 16px"> Submit</span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>

    </v-container>
</v-card>
</template>

<script>
import {
    ref,
    onMounted
} from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import {
    required,
    minValue
} from "@vuelidate/validators";
import {
    NETWORKVPC
} from '@/modules/network/vpc/namespace';
import {
    useNamespacedActions,
    useNamespacedGetters,
    useNamespacedState,
} from "vuex-composition-helpers";
export default {
    setup(props, context) {
        const {
            currentOrg
        } = useNamespacedState("SUPERADMIN", ["currentOrg"]);
        const {
            fetchRouterLimit,
            saveLimitRouter
        } = useNamespacedActions(NETWORKVPC, ["fetchRouterLimit", "saveLimitRouter"]);
        const {
            getLimitRouter
        } = useNamespacedGetters(NETWORKVPC, ["getLimitRouter"])
        const isLoading = ref(true);
        const nat = ref(0);
        const fip = ref(0);
        const organizationId = ref(currentOrg.value.id);

        function getSettings() {
            fetchRouterLimit()
                .then((res) => {
                    nat.value = res.nat_limit
                    fip.value = res.fip_limit
                    isLoading.value = false;
                })
                .catch(() => {
                    isLoading.value = false;
                })
        }
        onMounted(() => {
            getSettings()
        });

        const $v = useVuelidate({
            nat: {
                required,
                minValue: minValue(0)
            },
            fip: {
                required,
                minValue: minValue(0)
            }
        }, {
            nat,
            fip
        });

        const submit = async () => {
            $v.value.$touch();
            if ($v.value.$errors.length) return;
            const payload = {
                nat: parseInt(nat.value),
                fip: parseInt(fip.value)
            };
            isLoading.value = true;
            await saveLimitRouter({
                body: payload
            })
            getSettings()
            isLoading.value = false;
        };

        return {
            $v,
            organizationId,
            nat,
            fip,
            submit,
            isLoading,
            getLimitRouter
        };
    },
};
</script>

<style lang="scss" scoped>
.hideinput {
    ::v-deep input {
        position: relative;
        bottom: 50px;
        z-index: -4;
    }
}

.btn-delete-flavor {
    font-size: 14px;
    height: 50px !important;
}
</style>
