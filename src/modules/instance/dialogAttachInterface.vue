<template>
<v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
        <v-card-text>
            <div class="headline font-weight-bold font--text">Attach Interface</div>
        </v-card-text>

        <v-card-text>
            <p class="titletext">Type</p>
            <v-select id="selectType" placeholder="Select Type" :items="selectTypes" v-model="selectType" outlined single-line append-icon="mdi-chevron-down" :error-messages="selectTypeError" />
        </v-card-text>

        <v-card-text v-if="selectType === 'vpc'">
            <p class="titletext">VPC</p>
            <v-select id="selectedVPC" placeholder="Select VPC" :items="vpcItems" v-model="selectedVPC" outlined single-line append-icon="mdi-chevron-down" :error-messages="selectedVPCError" />
        </v-card-text>

        <v-card-text v-if="selectType === 'vpc'">
            <p class="titletext">IP Address</p>
            <v-text-field maxlength="50" id="ipAddress" v-model="ipAddress" :error-messages="ipAddressError" outlined placeholder="IP Address"></v-text-field>
        </v-card-text>

        <v-card-text v-if="selectType === 'port'">
            <p class="titletext">Port</p>
            <v-select id="selectedVPCPort" placeholder="Select Port" :items="vpcportItems" v-model="selectedVPCPort" outlined single-line append-icon="mdi-chevron-down" :error-messages="selectedVPCPortError" />
        </v-card-text>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-btn depressed height="45" block class="accent" @click="
                () => {
                  $emit('input', false);
                }
              " :disabled="loading">
                        <!-- loading indicator -->
                        <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

                        Cancel
                    </v-btn>
                </v-col>

                <v-col>
                    <v-btn id="Add" depressed height="45" block class="secondary" @click="processAttachInterface" :disabled="loading">
                        <!-- loading indicator -->
                        <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

                        Attach
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <dialogFloatingIpConfirmation v-if="isShowConfirmDialog" :data="confirmDialogData" v-model="isShowConfirmDialog" @confirm="
        () => {
          submit();
          isShowConfirmDialog = false;
        }
      " />
</v-dialog>
</template>

<script>
import {
    computed,
    ref,
    onMounted
} from "@vue/composition-api";
import {
    useNamespacedActions,
} from "vuex-composition-helpers";
import {
    INSTANCE
} from "./namespace";
import dialogFloatingIpConfirmation from "../network/floatingip/dialogFloatingIpConfirmation.vue";
import {
    useVpc
} from "./compositionapi/usevpc";
import localstorage from "@/lib/localstorage";

export default {
    props: ["value", "item"],
    components: {
        dialogFloatingIpConfirmation,
    },
    setup(props, {
        emit
    }) {
        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                emit("input", val);
            },
        });
        const loading = ref(false);
        const projJson = localstorage.getItem("currentProj");
        const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

        const useComposable = {
            ...useVpc(),
        };

        async function getVpcs() {
            const vpcs = await useComposable.fetchvpcs();
            vpcItems.value = vpcs.map((vpc) => {
                let listSubnet = null;
                if (vpc.subnets.length >= 1)
                    for (var i = 0; i < vpc.subnets.length; i++) {
                        if (listSubnet == null)
                            listSubnet = vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
                        else
                            listSubnet = listSubnet + ", " + vpc.subnets[i].ip_prefix + "/" + vpc.subnets[i].network_size;
                    }
                else
                    listSubnet = vpc.ip_prefix + "/" + vpc.network_size;

                return {
                    text: vpc.name + " (" + listSubnet + ")",
                    value: vpc.id,
                };
            });
        }
        const selectType = ref("");
        const selectTypeError = ref("");

        const selectedVPC = ref("");
        const ipAddress = ref("");
        const selectedVPCError = ref("");
        const ipAddressError = ref("");
        const vpcItems = ref([]);
        const isShowConfirmDialog = ref(false);
        const confirmDialogData = ref(null);
        const selectTypes = ref([{
                text: "by VPC",
                value: "vpc",
            },
            {
                text: "by Port",
                value: "port",
            },
        ]);
        const vpcportItems = ref([]);
        const selectedVPCPort = ref("");
        const selectedVPCPortError = ref("");

        const {
            fetchPaginatedInstances,
            attachInterface
        } = useNamespacedActions(INSTANCE, [
            "fetchPaginatedInstances",
            "attachInterface",
        ]);

        const attachInterfaceIns = async (obj) => {
            loading.value = true;
            try {
                const response = await attachInterface(obj);
                emit("input", false);
                if (response.status === 200) await fetchPaginatedInstances();
            } catch (error) {
                console.log(error)
            }
            loading.value = false;
        };

        const processAttachInterface = async () => {
            if (!selectType.value) {
                selectTypeError.value = "Value is required";
            }
            if (selectType.value === 'vpc') {
                if (!selectedVPC.value) {
                    selectedVPCError.value = "Value is required";
                } else {
                    attachInterfaceIns({
                        instance_id: props.item.id,
                        ip_address: ipAddress.value,
                        vpc_id: (selectedVPC.value == "" ? selectedVPCPort.value.vpc_id : selectedVPC.value),
                        project_id: projObj.id,
                        port_id: selectedVPCPort.value.id,
                    });
                }
            } else {
                if (!selectedVPCPort.value) {
                    selectedVPCPortError.value = "Value is required";
                } else {
                    attachInterfaceIns({
                        instance_id: props.item.id,
                        ip_address: ipAddress.value,
                        vpc_id: (selectedVPC.value == "" ? selectedVPCPort.value.vpc_id : selectedVPC.value),
                        project_id: projObj.id,
                        port_id: selectedVPCPort.value.id,
                    });
                }
            }
        };

        async function getVpcPorts() {
            const vpcports = await useComposable.fetchvpcportdetacheds(props.item.id);
            vpcportItems.value = vpcports.map((vpcport) => {
                return {
                    text: vpcport.vpc_name + " ( " + vpcport.name + "/" + vpcport.ip_address + " )",
                    value: vpcport,
                };
            });
        }

        const submit = () => {
            attachInterfaceIns({
                instance_id: props.item.id,
                ip_address: ipAddress.value,
                vpc_id: selectedVPC.value,
                project_id: projObj.id,
                port_id: selectedVPCPort.value.id,
            });
        };

        onMounted(async () => {
            getVpcs();
            getVpcPorts();
        })

        return {
            submit,
            confirmDialogData,
            processAttachInterface,
            attachInterfaceIns,
            dialog,
            loading,
            selectedVPC,
            ipAddress,
            selectedVPCError,
            ipAddressError,
            isShowConfirmDialog,
            vpcItems,
            selectTypes,
            selectType,
            selectTypeError,
            vpcportItems,
            selectedVPCPort,
            selectedVPCPortError,
        };
    },
    computed: {

    },
    methods: {},
    mounted() {},
    watch: {},
};
</script>

<style lang="scss" scoped>
.titletext {
    font-weight: 700;
    font-size: 12px;
}
</style>
