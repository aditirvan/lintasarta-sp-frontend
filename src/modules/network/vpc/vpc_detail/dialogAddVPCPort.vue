<template>
<v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
        <v-card-text>
            <div class="headline font-weight-bold font--text">{{ editMode ? 'Edit' : 'Add' }} VPC Port</div>
        </v-card-text>
        <v-card-text class="pb-0">
            <v-row>
                <v-col cols="12" class="pt-0">
                    <p class="titletext">Name
                        <small class="error--text" v-if="$v.name.$errors.length ">&nbsp;*{{ $v.name.$errors[0].$message }}</small>
                    </p>
                    <v-text-field maxlength="100" v-model="name" placeholder="Name" flat outlined></v-text-field>
                </v-col>

                <v-col cols="12" class="pt-0">
                    <p class="titletext">Type
                        <small class="error--text" v-if="$v.type.$errors.length ">&nbsp;*{{ $v.type.$errors[0].$message }}</small>
                    </p>
                    <v-select id="type" placeholder="Select Type" v-model="type" :disabled="editMode" :items="types" outlined single-line append-icon="mdi-chevron-down" />
                </v-col>

                <v-col cols="12" class="pt-0" v-if="type == 'subnet'">
                    <p class="titletext">Subnet
                        <small class="error--text" v-if="$v.subnets.$errors.length ">&nbsp;*{{ $v.subnets.$errors[0].$message }}</small>
                    </p>
                    <v-select id="subnets" placeholder="Select Subnet" v-model="subnets" :disabled="editMode" :items="vpc.vpc_subnets" :item-text="(val) => { return val.name + ' - ' + val.ip_prefix  }" item-value="id" outlined single-line append-icon="mdi-chevron-down" />
                </v-col>

                <v-col cols="12" class="pt-0" v-if="type == 'fixed ip' || editMode == true ">
                    <p class="titletext">IP Address
                        <small class="error--text" v-if="$v.ip_address.$errors.length ">&nbsp;*{{ $v.ip_address.$errors[0].$message }}</small>
                    </p>
                    <v-text-field maxlength="100" v-model="ip_address" :disabled="editMode" placeholder="IP Address" flat outlined></v-text-field>
                </v-col>

                <v-col cols="12" class="pt-0">
                    <p class="titletext">Mac Address
                        <small class="error--text" v-if="$v.mac_address.$errors.length ">&nbsp;*{{ $v.mac_address.$errors[0].$message }}</small>
                    </p>
                    <v-text-field maxlength="100" v-model="mac_address" :disabled="editMode" placeholder="Mac Address" flat outlined></v-text-field>
                </v-col>
                <v-col cols="12" class="pt-0">
                    <p class="titletext">Port Security
                        <small class="error--text" v-if="$v.portSecurity.$errors.length ">&nbsp;*{{ $v.portSecurity.$errors[0].$message }}</small>
                    </p>
                    <v-select id="portSecurity" placeholder="Select Port Security" :items="portSecurities" v-model="portSecurity" outlined single-line append-icon="mdi-chevron-down" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text>
            <v-row>
                <v-col>
                    <v-btn depressed height="45" block class="accent" @click="
                () => {
                  $emit('input', false);
                  resetForm()
                  if (editMode == true){
                    editAgain()
                  }
                }
              ">Cancel</v-btn>
                </v-col>
                <v-col>
                    <v-btn id="Add" depressed height="45" block class="secondary" @click="save" :disabled="isLoading">
                        <beat-loader v-if="isLoading" size="10px" color="white" :loading="isLoading" />
                        <span v-else>
                            {{ editMode ? 'Edit' : 'Add' }}
                        </span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</v-dialog>
</template>

<script>
import {
    computed,
    onMounted,
    ref,
    watch
} from "@vue/composition-api";
const {
    required,
    minLength,
    requiredIf,
} = require("@vuelidate/validators");
import {
    useNamespacedMutations,
    useNamespacedState
} from 'vuex-composition-helpers'
import {
    NETWORKVPC
} from '../namespace'
import {
    async
} from "@firebase/util";

const allowedTypes = ["application/json"];

const useVuelidate = require("@vuelidate/core").default;
export default {
    props: ["value", 'selectedVPCPort'],
    setup(props, {
        root,
        emit
    }) {
        const {
            setopendialogcommonsuccess
        } = useNamespacedMutations("DASHBOARD", [
            "setopendialogcommonsuccess",
        ])

        const {
            vpc,
        } = useNamespacedState(NETWORKVPC, [
            "vpc",
        ]);

        // Reset Form if create success
        root.$on('resetFormVPCPort', () => {
            resetForm()
        })

        const {
            isLoading,
        } = useNamespacedState(NETWORKVPC, [
            "isLoading",
        ])

        const editMode = ref(false)
        watch(() => props.selectedVPCPort, (val) => {
            if (val === null) {
                editMode.value = false
                resetForm()
                types.value.splice(2, 1)
            } else {
                if (types.value.length == 2) {
                    types.value.push({
                        text: "Subnet",
                        value: "auto",
                    });
                }
                editMode.value = true
                name.value = props.selectedVPCPort.name
                type.value = props.selectedVPCPort.type
                subnets.value = props.selectedVPCPort.subnet_id
                ip_address.value = props.selectedVPCPort.ip_address
                mac_address.value = props.selectedVPCPort.mac_address
                portSecurity.value = props.selectedVPCPort.port_security_enabled
            }
        })

        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                emit("input", val);
            },
        })

        const name = ref(null)
        const subnets = ref(null)
        const ip_address = ref(null)
        const mac_address = ref(null)
        const portSecurity = ref(null)
        const portSecurities = ref([{
                text: "Enabled",
                value: true,
            },
            {
                text: "Disabled",
                value: false,
            },
        ]);
        const type = ref('')
        const types = ref([{
                text: "Subnet",
                value: "subnet",
            },
            {
                text: "Fixed IP",
                value: "fixed ip",
            },
        ]);

        const $v = useVuelidate({
            name: {
                required,
                minLength: minLength(5),
            },
            mac_address: {},
            portSecurity: {
                required,
            },
            type: {
                required,
            },
            ip_address: {
                required: requiredIf(() => type.value != 'subnet'),
                $autoDirty: true,
                regex: {
                    $validator: (val) => {
                        if (type.value != 'subnet') {
                            return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                                val
                            );
                        } else {
                            return true
                        }
                    },
                },
            },
            subnets: {
                required: requiredIf(() => type.value == 'subnet'),
                $autoDirty: true
            },
        }, {
            name,
            subnets,
            ip_address,
            mac_address,
            portSecurity,
            type,
        })

        const resetForm = () => {
            name.value = null
            ip_address.value = null
            mac_address.value = null
            portSecurity.value = null
            type.value = null
            subnets.value = null
            $v.value.$reset()
        }

        const editAgain = () => {
            name.value = props.selectedVPCPort.name
            subnets.value = props.selectedVPCPort.subnet_id
            ip_address.value = props.selectedVPCPort.ip_address
            mac_address.value = props.selectedVPCPort.mac_address
            portSecurity.value = props.selectedVPCPort.port_security_enabled
            type.value = props.selectedVPCPort.type
        }

        const url = root._route.path;
        const lastIndex = url.lastIndexOf('/');
        const vpcID = url.substring(lastIndex + 1)

        const save = async () => {
            $v.value.$touch()
            if ($v.value.$invalid) return false
            const payload = {
                id: (editMode.value == true ? props.selectedVPCPort.id : ""),
                name: name.value,
                type: type.value,
                ip_address: ip_address.value == null ? null : ip_address.value,
                subnet_id: type.value == "subnet" ? subnets.value : null,
                mac_address: mac_address.value,
                vpc_id: vpcID,
                port_security_enabled: portSecurity.value,
            }
            if (props.selectedVPCPort) payload.sourceName = props.selectedVPCPort.name
            if (editMode.value) emit('update', payload)
            else emit('create', payload)
        }

        onMounted(async () => {
            // portSecurities.value.pop()
        })

        return {
            resetForm,
            editMode,
            dialog,
            save,
            isLoading,
            $v,
            name,
            subnets,
            ip_address,
            mac_address,
            portSecurity,
            editAgain,
            portSecurities,
            type,
            types,
            vpc,
        }
    },
}
</script>

<style lang="scss" scoped>
.titletext {
    font-weight: 700;
    font-size: 12px;
}

.v-input--is-disabled {
    ::v-deep .v-input__slot {
        background: #f1f2f2;
    }
}
</style>
