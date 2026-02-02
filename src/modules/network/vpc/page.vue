<template>
<div>
    <v-card class="pa-7 rounded-0 rounded-b-lg" flat>
        <!-- <v-row>
        <v-col class="d-flex align-center justify-end pt-0 pb-4">
          <v-btn
            width="150"
            class="secondary fz-14"
            depressed
            to="/network/vpc/create"
            v-if="vpcs.length && !read_only"
          >
            Create VPC
          </v-btn>
        </v-col>
      </v-row> -->
        <v-data-table v-if="vpcList.length" :headers="headers" :items="vpcList" :items-per-page="10" class="elevation-0" hide-default-footer>
            <template v-slot:item.name="{ item }">
                <router-link :to="{ path: `/network/vpc/${item.id}` }">
                    {{ item.name }}
                </router-link>
            </template>
            <template v-slot:item.region="{ item }">
                {{ item.region }}
            </template>
            <template v-slot:item.subnets="{ item }">
                <div v-for="subnet in item.subnets" :key="subnet">
                    {{ subnet.ip_prefix }}/{{ subnet.network_size }}
                </div>
            </template>
            <template v-slot:item.resource="{ item }">
                {{
            item.resources && item.resources.length ? `${item.resources.length} Resources` : "-"
          }}
            </template>
            <template v-slot:item.billing_type="{ item }">
                <span class="v-badge v-badge--inline theme--light" v-if="item.billing_type == 'Trial' && item.trial_voucher_expired">
                    {{ item.billing_type }}
                    <span class="v-badge__wrapper">
                        <span aria-atomic="true" aria-label="Badge" aria-live="polite" role="status" class="v-badge__badge pink">
                            Expired
                        </span>
                    </span>
                </span>
                <span v-else-if="item.billing_type">
                    {{ item.billing_type }}
                </span>
                <span v-else>-</span>
            </template>
            <template v-slot:item.type="{ item }">
                {{ item.type }}
            </template>
            <template v-slot:item.action="{ item }">
                <popupquote v-model="item.open" :offsetTop="20" :documentid="'popup' + item.id" offset-y allow-overflow>
                    <template v-slot:activator="{ on, attrs }">
                        <label v-bind="attrs" class="primary--text linkpointer" style="position: relative; white-space: nowrap" @click="
                            ($event) => {
                              on.click($event);                        
                              show($event, item);                        
                            }
                          ">More
                            <v-icon :class="{ rotate: item.open }" :id="'popup' + item.id" color="primary">
                              mdi-chevron-down
                            </v-icon>
                        </label>
                    </template>

                    <v-list>
                        <v-list-item :to="{ path: `/network/vpc/${item.id}` }">
                            <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                            <v-divider style="min-width: 160px" />
                        </v-list-item>
                        <v-list-item @click="
                          () => {
                            validateprivilages(['Network', 'editor', true]).then(() => {
                              vpcselected = item;
                              opendialogdeletevpc = true;
                              DETAIL_VPC2({id: item.id})
                            });
                          }
                        ">
                            <v-list-item-title class="error--text">Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </popupquote>
            </template>
            <template v-slot:footer="{ props }">
                <custom-footer-datatable v-if="vpcList.length > 5" :props="props" />
            </template>
        </v-data-table>
        <v-card flat outlined class="rounded-lg" v-else>
            <v-row>
                <v-col md="12">
                    <v-card flat class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                        <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                            <p style=" font-size:16px; margin-bottom: 10px; text-transform:capitalize;" class="font-weight-bold">
                                Looks like you don’t have any VPC Networks
                            </p>
                            <v-row>
                                <v-col>
                                    <p style=" font-size: 12px; color: #a5b3bf; margin-bottom: 20px; ">
                                        Resources assigned to the same VPC network can communicate
                                        securely with each other via private IP. Communication with
                                        resources outside the VPC must use a public network IP.
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row v-if="!read_only">
                                <v-col>
                                    <v-btn v-if=" user_role === 'Superadmin'" width="100%" append max-width="150" height="50" depressed class="secondary mr-5" exact @click="() => {openSyncDialog = true;}">
                                        Sync VPC Network
                                    </v-btn>
                                    <v-btn width="100%" append max-width="300" height="50" depressed class="secondary" exact to="/network/vpc/create">
                                        Create VPC Network
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-card>
    <dialogDeleteVpc v-model="opendialogdeletevpc" @confirm="
        () => {
          vpcselected.type != 'Expert' ? deleteSelectedVPC() : deleteVpcAdvanced()
        }
      " />
    <dialogSyncNetwork
    v-if="openSyncDialog" 
    v-model="openSyncDialog"
    :isLoading="isLoading"
    @close="openSyncDialog = false" />
</div>
</template>

<script>
import {
    useNamespacedActions,
    useNamespacedState,
} from "vuex-composition-helpers";
import {
    ref,
    onMounted
} from "@vue/composition-api";
import {
    NETWORKVPC
} from "./namespace";
import dialogDeleteVpc from "./dialogDeleteVpc";
import dialogSyncNetwork from "../dialogSyncNetwork.vue";
import localstorage from "@/lib/localstorage";
import {
    AccessControl
} from "@/lib/middleware";

export default {
    components: {
        dialogDeleteVpc, dialogSyncNetwork
    },
    setup(props, context) {
        const headers = ref([{
                text: "Name",
                value: "name"
            },
            {
                text: "Region",
                value: "region"
            },
            {
                text: "Available IP",
                value: "subnets"
            },
            {
                text: "Resources",
                value: "resource"
            },
            {
                text: "Billing Type",
                value: "billing_type"
            },
            {
                text: "Type",
                value: "type"
            },
            {
                text: "Action",
                value: "action"
            },
        ])
        const access_control = new AccessControl(context.root.$store);
        const read_only = ref(access_control.is_read_mode('Project Network'));
        const {
            DELETE_VPC,
            FETCH_VPC,
            DELETE_VPC_ADVANCED,
            DETAIL_VPC2
        } = useNamespacedActions(NETWORKVPC, [
            "DELETE_VPC",
            "FETCH_VPC",
            "DELETE_VPC_ADVANCED",
            "DETAIL_VPC2"
        ]);
        const {
            vpcList,
            vpc
        } = useNamespacedState(NETWORKVPC, ["vpcList", "vpc"]);
        const vpcselected = ref();
        const {
            validateprivilages,
            validateprivilagesync,
        } = useNamespacedActions("HOMEPAGE", [
            "validateprivilages",
            "validateprivilagesync",
        ]);

        const openSyncDialog = ref(false);

        const openSyncDialogHandler = () => {
            openSyncDialog.value = true;
        };

        onMounted(() => {
            if (read_only.value) {
                headers.value.pop()
            }
        })

        return {
            read_only,
            headers,
            validateprivilages,
            validateprivilagesync,
            vpcList,
            DELETE_VPC,
            opendialogdeletevpc: ref(false),
            vpcselected,
            FETCH_VPC,
            DETAIL_VPC2,
            vpc,
            openSyncDialog,
            openSyncDialogHandler,
            async deleteSelectedVPC() {
                this.DELETE_VPC({
                    id: vpcselected.value.id,
                    // resources: vpcselected.value.instance.length,
                });
            },
            async deleteVpcAdvanced() {
                let payload = {
                    id_vpc: vpcselected.value.id,
                    name: vpcselected.value.name,
                    status: vpcselected.value.status
                }
                let resp = await DELETE_VPC_ADVANCED(payload)
                if (resp.status == 200) {
                    FETCH_VPC()
                }

                // if(vpc.value.vyos.id){
                //   console.log('vyos exist')
                //   // localStorage.setItem('is_network', 'no')
                //   let payload = {
                //     id_vpc: vpcselected.value.id,
                //     name: vpcselected.value.name,
                //     vyos: true
                //   }
                //   // console.log(payload)
                //   let resp = await DELETE_VPC_ADVANCED(payload)
                //   if(resp.status == 200){
                //     FETCH_VPC()
                //   }
                // }else{
                //   console.log('vyos not exist')
                //   let payload = {
                //     id_vpc: vpcselected.value.id,
                //     name: vpcselected.value.name,
                //     vyos: false
                //   }
                //   // console.log(payload)
                //   let resp = await DELETE_VPC_ADVANCED(payload)
                //   if(resp.status == 200){
                //     FETCH_VPC()
                //   }
                // }
            }
        };
    },
    computed: {
        userType() {
            return localstorage.getItem("type");
        },
        userRole() {
            return localstorage.getItem("role");
        },
    },
    created() {
        this.FETCH_VPC();
    }
};
</script>

<style scoped>
.v-btn {
    height: 55px !important;
}

.mdi-chevron-down.rotate::before {
    transform: rotate(-180deg);
    transition: 100ms linear all;
}

.mdi-chevron-down::before {
    transition: 100ms linear all;
}
</style>
