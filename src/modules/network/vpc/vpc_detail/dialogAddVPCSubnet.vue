<template>
<v-dialog max-width="600" v-model="dialog">
    <v-card class="pt-7">
        <v-card-text>
            <div class="headline font-weight-bold font--text">{{ editMode ? 'Edit' : 'Add' }} VPC Subnet</div>
        </v-card-text>
        <v-card-text>
            <p class="font-weight-bold">Name</p>
            <v-row>
                <v-col class="py-0">
                    <v-text-field maxlength="100" :disabled="editMode" placeholder="Name" flat outlined v-model="name" :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text>
            <v-row>
                <v-col class="py-0">
                    <p class="font-weight-bold">IP Address</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="7" class="py-0">
                    <v-text-field maxlength="20" :disabled="editMode" placeholder="IP Address" flat outlined v-model="ip" :error-messages="$v.ip.$errors.length ? $v.ip.$errors[0].$message : ''"></v-text-field>
                </v-col>
                <v-col cols="5" class="py-0">
                    <v-select :disabled="editMode" placeholder="Choose a Size" append-icon="mdi-chevron-down" :items="prefixes" v-model="network_size" outlined single-line :error-messages="$v.network_size.$errors.length ? $v.network_size.$errors[0].$message : ''">
                    </v-select>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text v-if="editMode">
            <v-row>
                <v-col cols="11" class="py-0">
                    <p class="font-weight-bold">DNS Name Servers</p>
                </v-col>
                <v-col cols="1" class="py-0">
                    <v-btn @click="addDnsIP()" fab color="primary">
                        <v-icon style="font-size: 17px;">
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <div>
                <dnsns v-for="(dns, i) in dnsns" :key="dns.id" ref="rulesref" :rule="dns" :index="i" @deleteDnsIP="()=>{ deleteDnsIP(i) }" />
            </div>

        </v-card-text>

        <v-card-text v-if="editMode">
            <v-row>
                <v-col cols="11" class="py-0">
                    <p class="font-weight-bold">Host Routes</p>
                </v-col>
                <v-col cols="1" class="py-0">
                    <v-btn @click="addHostIP()" fab color="primary">
                        <v-icon style="font-size: 17px;">
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <div>
                <hostips v-for="(hostip, i) in hostips" :key="hostip.id" ref="rulesref" :rule="hostip" :index="i" @deleteHostIP="()=>{ deleteHostIP(i) }" />
            </div>

            <v-row>
                <v-col class="py-0">
                    <v-checkbox v-model="enable_dhcp" label="Enable DHCP" class="font-weight-bold"></v-checkbox>
                </v-col>
            </v-row>

        </v-card-text>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-btn depressed height="45" block class="accent" @click=" () => { 
                                    $emit('input', false);  resetForm() 
                                    if (editMode == true) { editAgain() }
                                }">
                        Cancel
                    </v-btn>
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
} from "@vue/composition-api";
const {
    required,
    minLength,
} = require("@vuelidate/validators");
import {
    useNamespacedState
} from 'vuex-composition-helpers'
import {
    NETWORKVPC
} from '../namespace'
import localstorage from '@/lib/localstorage';
import dnsns from './dnsns.vue'
import hostips from './hostips.vue'

const useVuelidate = require("@vuelidate/core").default;
export default {
    props: ["value", 'selectedVPCSubnet'],
    components: {
        dnsns,
        hostips
    },
    setup(props, {
        root,
        emit
    }) {

        // Reset Form if create success
        root.$on('resetFormVPCSUbnet', () => {
            resetForm()
        })

        const {
            isLoading,
        } = useNamespacedState(NETWORKVPC, [
            "isLoading",
        ])

        const editMode = ref(false)
        const dnsns = ref([])
        const hostips = ref([])
        onMounted(() => {
            console.log(props.selectedVPCSubnet)
            if (props.selectedVPCSubnet === null) {
                editMode.value = false
                resetForm()
            } else {
                editMode.value = true
                name.value = props.selectedVPCSubnet.name
                ip.value = props.selectedVPCSubnet.ip_prefix
                network_size.value = props.selectedVPCSubnet.network_size
                enable_dhcp.value = props.selectedVPCSubnet.enable_dhcp
                if (props.selectedVPCSubnet.dns_name_servers != '') {
                    let listDataDNS = props.selectedVPCSubnet.dns_name_servers.split(" ")
                    dnsns.value = listDataDNS.map((dnsIP) => {
                        return {
                            id: Math.random(),
                            dns_ip: dnsIP ? dnsIP : '',
                        }
                    })
                }

                if (props.selectedVPCSubnet.host_routes != '') {
                    let listHostRoute = props.selectedVPCSubnet.host_routes.split(" ")
                    hostips.value = listHostRoute.map((hostIP) => {
                        return {
                            id: Math.random(),
                            host_ip: hostIP ? hostIP : '',
                        }
                    })
                }

            }
        })

        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                emit("input", val);
            },
        })

        const projectid = localstorage.getItem('projectid')
        const name = ref(null)
        const ip = ref(null)
        const network_size = ref("");
        const prefixes = ref([8, 16, 24, 29])
        const dns_name_servers = ref(null)
        const host_routes = ref(null)
        const enable_dhcp = ref("")

        const $v = useVuelidate({
            name: {
                required,
                minLength: minLength(5),
            },
            ip: {
                required,
                regex: {
                    $message: "Invalid ip value",
                    $validator: (val) => {
                        return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                            val
                        );
                    },
                },
            },
            network_size: {
                required,
            },

        }, {
            name,
            ip,
            network_size,
        })

        const resetForm = () => {
            name.value = null
            ip.value = null
            network_size.value = null
            $v.value.$reset()
        }

        const editAgain = () => {
            name.value = props.selectedVPCSubnet.name
            ip.value = props.selectedVPCSubnet.ip
            network_size.value = props.selectedVPCSubnet.network_size
            dns_name_servers.value = props.selectedVPCSubnet.dns_name_servers
            enable_dhcp.value = props.selectedVPCSubnet.enable_dhcp
            if (props.selectedVPCSubnet.dns_name_servers != '') {
                let listDataDNS = props.selectedVPCSubnet.dns_name_servers.split(" ")
                dnsns.value = listDataDNS.map((dnsIP) => {
                    return {
                        id: Math.random(),
                        dns_ip: dnsIP ? dnsIP : '',
                    }
                })
            }

            if (props.selectedVPCSubnet.host_routes != '') {
                let listHostRoute = props.selectedVPCSubnet.host_routes.split(" ")
                hostips.value = listHostRoute.map((hostIP) => {
                    return {
                        id: Math.random(),
                        host_ip: hostIP ? hostIP : '',
                    }
                })
            }
        }

        const url = root._route.path;
        const lastIndex = url.lastIndexOf('/');
        const vpcID = url.substring(lastIndex + 1)

        const save = async () => {
            $v.value.$touch()
            if ($v.value.$invalid)
                return false

            const payload = {
                project_id: projectid,
                name: name.value,
                ip: ip.value,
                network_size: network_size.value,
                vpc_id: vpcID,
            }

            if (editMode.value) {
                let listDns = null;
                for (let i = 0; i < dnsns.value.length; i++) {
                    if (listDns == null) {
                        listDns = dnsns.value[i].dns_ip
                    } else {
                        listDns += " " + dnsns.value[i].dns_ip
                    }
                }
                let listHostRoute = null;
                for (let i = 0; i < hostips.value.length; i++) {
                    if (listHostRoute == null) {
                        listHostRoute = hostips.value[i].host_ip
                    } else {
                        listHostRoute += " " + hostips.value[i].host_ip
                    }
                }
                payload.id = props.selectedVPCSubnet.id
                payload.dns_name_servers = listDns
                payload.host_routes = listHostRoute
                payload.enable_dhcp = enable_dhcp.value ? true : false
                emit('update', payload)
            } else {
                emit('create', payload)
            }
        }

        function addDnsIP() {
            dnsns.value.push({
                id: Math.random(),
                dns_ip: null,
            })
        }

        function deleteDnsIP(index) {
            dnsns.value.splice(index, 1)
        }

        function addHostIP() {
            hostips.value.push({
                id: Math.random(),
                host_ip: null,
            })
        }

        function deleteHostIP(index) {
            hostips.value.splice(index, 1)
        }

        return {
            addDnsIP,
            deleteDnsIP,
            addHostIP,
            deleteHostIP,
            resetForm,
            save,
            editAgain,
            editMode,
            dialog,
            isLoading,
            $v,
            ip,
            name,
            prefixes,
            network_size,
            dns_name_servers,
            host_routes,
            hostips,
            enable_dhcp,
            dnsns,
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

.v-btn {
    width: 25px;
    height: 25px;
}
</style>
