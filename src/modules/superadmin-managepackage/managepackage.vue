<template>
    <v-container fluid class="px-0 pt-3">
        <v-card flat class="rounded-lg pa-7">
            <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
                <v-tabs v-model="tab" slider-size="4">
                    <v-tab>
                    <span class="ml-4" style="font-size: 16px">Default </span>
                    </v-tab>
                    <v-tab>
                    <span style="font-size: 16px">
                        Add Ons
                    </span>
                    </v-tab>
                    <v-tab>
                    <span style="font-size: 16px">
                        Monthly
                    </span>
                    </v-tab>
                </v-tabs>
            </v-card-text>
            <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="tab">
                        <!-- Default -->
                <v-tab-item>
                    <v-card-text class="d-flex px-8 flex-row align-center">
                        <v-row>
                            <v-col class="d-flex flex-row align-center">
                                <p class="fz-21 font-weight-bold mb-0">Default</p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-data-table
                                hide-default-footer
                                :headers="headersPackage"
                                :items-per-page="10"
                                :items="getPackageDefault"
                                :options.sync="optionsDefault"
                                :server-items-length="getTotalRowsDefault"
                                class="elevation-0"
                                >
                                    <template v-slot:item.price="{ item }">
                                        <span>Rp {{ Indoformat.format(item.price) }}</span>
                                    </template>
                                    <template v-slot:item.package_type="{ item }">
                                        <v-chip
                                        outlined
                                        class="mt-1"
                                        color="primary"
                                        small
                                        v-for="data in item.package_type" :key="data.id"
                                        >
                                        <span>{{ data.type.name }}</span>
                                        </v-chip>
                                    </template>

                                    <template v-slot:item.action="{ item }">
                                        <span
                                        @click="() => {
                                            if(read_only){
                                                return
                                            }
                                            packageselected=item;
                                            openDialogAdd=true;
                                            typePackage='default'
                                        }"
                                        class="pr-3 edit primary--text"
                                        :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                                        >Edit
                                        </span>

                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-tab-item>
                        <!-- Add Ons -->
                <v-tab-item>
                    <v-card-text class="d-flex px-8 flex-row align-center">
                        <v-row>
                            <v-col class="d-flex flex-row align-center">
                                <p class="fz-21 font-weight-bold mb-0">Add Ons</p>
                                <v-spacer />
                                <v-text-field
                                maxlength="50"
                                class="search"
                                placeholder="Search"
                                outlined
                                hide-details
                                style="max-width: 233px"
                                v-model="searchOnetime"
                                ></v-text-field>
                                
                                <v-btn
                                v-if="!read_only"
                                @click="dialogAdd('onetime')"
                                depressed
                                height="45"
                                width="200"
                                class="secondary ml-6"
                                >
                                    <span class="fz-14"> Create Add Ons Package </span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-data-table
                                hide-default-footer
                                :headers="headersPackage"
                                :items-per-page="10"
                                :items="getPackageOnetime"
                                :options.sync="optionsOnetime"
                                :server-items-length="getTotalRowsOnetime"
                                class="elevation-0"
                                >
                                    <template v-slot:item.price="{ item }">
                                        <span>Rp {{ Indoformat.format(item.price) }}</span>
                                    </template>
                                    <template v-slot:item.package_type="{ item }">
                                        <v-chip
                                        outlined
                                        class="mt-1 mr-1"
                                        color="primary"
                                        small
                                            v-for="data in item.package_type" :key="data.id"
                                        >
                                        <span>{{ data.type.name }}</span>
                                        </v-chip>
                                    </template>

                                    <template v-slot:item.action="{ item }">
                                        <popupquote
                                        v-model="item.open"
                                        :offsetTop="20"
                                        :documentid="'popup' + item.id"
                                        offset-y
                                        allow-overflow
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <label
                                                    v-bind="attrs"
                                                    class="primary--text linkpointer"
                                                    style="position: relative; white-space: nowrap"
                                                    @click="
                                                    ($event) => {
                                                        on.click($event);
                                                    }
                                                    "
                                                    >More
                                                    <v-icon
                                                    :class="{
                                                        rotate: item.open,
                                                    }"
                                                    :id="'popup' + item.id"
                                                    color="primary"
                                                    >mdi-chevron-down</v-icon
                                                    >
                                                </label>
                                            </template>
                                            <v-list>                                    
                                                <v-list-item
                                                    v-if="!read_only"
                                                    @click="
                                                    () => {
                                                        if(read_only){
                                                            return
                                                        }
                                                        packageselected=item;
                                                        openDialogAdd=true;
                                                        typePackage='onetime'
                                                    }
                                                    "
                                                >
                                                    <v-list-item-title>Edit</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item
                                                    @click="
                                                    () => {
                                                        packageselected=item;
                                                        openDialogDetail=true;
                                                        typePackage='onetime'
                                                    }
                                                    "
                                                >
                                                    <v-list-item-title>Detail</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item
                                                    style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                                                >
                                                    <v-divider style="min-width: 160px" />
                                                </v-list-item>
                                                <v-list-item
                                                    v-if="!read_only"
                                                    @click="
                                                    () => {
                                                        if(read_only){
                                                            return
                                                        }
                                                        packageselected = item.id;
                                                        opendialogdeletepackage = true;
                                                        typePackage='onetime'
                                                    }
                                                    "
                                                >
                                                    <v-list-item-title class="error--text"
                                                    > Delete</v-list-item-title
                                                    >
                                                </v-list-item>
                                            </v-list>
                                        </popupquote>
                                    </template>

                                    <template v-slot:footer="{ props }">
                                        <custom-footer-datatable
                                        @input="
                                        (val) => {
                                            optionsOnetime = { ...optionsOnetime, ...val };
                                        }
                                        "
                                        :hidden="true"
                                        :props="props"/>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-tab-item>
                        <!-- Monthly -->
                <v-tab-item>
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex flex-row align-center">
                                <p class="fz-21 font-weight-bold mb-0">Monthly</p>
                                <v-spacer />
                                <v-text-field
                                maxlength="50"
                                class="search"
                                placeholder="Search"
                                outlined
                                hide-details
                                style="max-width: 233px"
                                v-model="searchMonthly"
                                ></v-text-field>
                                <v-btn
                                v-if="!read_only"
                                @click="dialogAdd('monthly')"
                                depressed
                                height="45"
                                width="200"
                                class="secondary ml-6"
                                >
                                    <span class="fz-14"> Create Monthly Package </span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-data-table
                                hide-default-footer
                                :headers="headersPackage"
                                :items-per-page="10"
                                :items="getPackageMonthly"
                                :options.sync="options"
                                :server-items-length="getTotalRowsMonthly"
                                class="elevation-0"
                                >
                                <template v-slot:item.price="{ item }">
                                    <span>Rp {{ Indoformat.format(item.price) }}/Month</span>
                                </template>
                                <template v-slot:item.package_type="{ item }">
                                    <v-chip
                                    outlined
                                    class="ma-1"
                                    color="primary"
                                    small
                                        v-for="data in item.package_type" :key="data.id"
                                    >
                                    <span>{{ data.type.name }}</span>
                                    </v-chip>
                                </template>

                                <template #[`item.action`]="{ item }">
                                    <popupquote
                                    v-model="item.open"
                                    :offsetTop="20"
                                    :documentid="'popup' + item.id"
                                    offset-y
                                    allow-overflow
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <label
                                                v-bind="attrs"
                                                class="primary--text linkpointer"
                                                style="position: relative; white-space: nowrap"
                                                @click="
                                                ($event) => {
                                                    on.click($event);
                                                }
                                                "
                                                >More
                                                <v-icon
                                                :class="{
                                                    rotate: item.open,
                                                }"
                                                :id="'popup' + item.id"
                                                color="primary"
                                                >mdi-chevron-down</v-icon
                                                >
                                            </label>
                                        </template>
                                        <v-list>                                    
                                            <v-list-item
                                                v-if="!read_only"
                                                @click="
                                                () => {
                                                    if(read_only){
                                                        return
                                                    }
                                                    packageselected=item;
                                                    openDialogAdd=true;
                                                    typePackage='monthly'
                                                }
                                                "
                                            >
                                                <v-list-item-title>Edit</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item
                                                @click="
                                                () => {
                                                    packageselected=item;
                                                    openDialogDetail=true;
                                                    typePackage='monthly'
                                                }
                                                "
                                            >
                                                <v-list-item-title>Detail</v-list-item-title>
                                            </v-list-item>
                                            <v-list-item
                                                style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                                            >
                                                <v-divider style="min-width: 160px" />
                                            </v-list-item>
                                            <v-list-item
                                                v-if="!read_only"
                                                @click="
                                                () => {
                                                    if(read_only){
                                                        return
                                                    }
                                                    packageselected = item.id;
                                                    opendialogdeletepackage = true;
                                                    typePackage='monthly'
                                                }
                                                "
                                            >
                                                <v-list-item-title class="error--text"
                                                > Delete</v-list-item-title
                                                >
                                            </v-list-item>
                                        </v-list>
                                    </popupquote>
                                </template>

                                <template v-slot:footer="{ props }">
                                    <custom-footer-datatable
                                    @input="
                                    (val) => {
                                        options = { ...options, ...val };
                                    }
                                    "
                                    :hidden="true"
                                    :props="props"/>
                                </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-tab-item>
            </v-tabs-items>
            <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
                <dialogPackage v-if="openDialogAdd" v-model="openDialogAdd" :item="packageselected" :type="typePackage" @clearItem="packageselected = $event" @refreshTable="refreshTab"></dialogPackage>

                <dialogDetail v-if="openDialogDetail" v-model="openDialogDetail" :item="packageselected" :type="typePackage" @input="openDialogDetail = $event" @clearItem="packageselected = $event"></dialogDetail>

                <dialogDeletePackage
                v-model="opendialogdeletepackage"
                @confirm="deletepackageselected"
                />
            </v-card-text>
            
        </v-card>
    </v-container>
</template>

<script>
import { defineComponent, computed, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogPackage from './dialogPackage.vue'
import dialogDeletePackage from './dialogDeletePackage.vue'
import dialogDetail from './dialogDetail.vue'
import { PACKAGE } from "./namespace";
import { Indoformat } from "@/lib/formatter";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
    components: {
        dialogPackage,
        dialogDeletePackage,
        dialogDetail
    },
    setup(props, context) {
       const access_control = new AccessControl(context.root.$store);
       const read_only = ref(access_control.is_read_mode('Manage Package'));
       const { fetchListPackageMonthly, fetchListPackageOnetime, fetchListPackageDefault, deletePackage  } = useNamespacedActions(PACKAGE, ["fetchListPackageMonthly", "fetchListPackageOnetime", "fetchListPackageDefault", "deletePackage"])
       const { 
           getPackageMonthly, 
           getTotalRowsMonthly, 
           getPackageOnetime, 
           getTotalRowsOnetime,
           getPackageDefault, 
           getTotalRowsDefault, 
           } = useNamespacedGetters(PACKAGE, 
           ["getPackageMonthly", 
           "getTotalRowsMonthly", 
           "getPackageOnetime", 
           "getTotalRowsOnetime",
           "getPackageDefault", 
           "getTotalRowsDefault",  ])
       const { packageMonthly } = useNamespacedState(PACKAGE, ["packageMonthly"])

        const headersPackage = ref([
            { text: "Package Name", value: "name", width: "150px", sortable: false },
            { text: "Quota", width: "100px", value: "quota" },
            { text: "Price", width: "100px", value: "price" },
            { text: "Type", width: "150px", value: "package_type", sortable: false},
            { text: "Action", value: "action", align: "center", width: "150px", sortable: false },
        ]);
        const loading = ref(true);
        const openDialogAdd = ref(false)
        const openDialogDetail = ref(false)
        const typePackage = ref("")
        const packageselected = ref({})
        const searchOnetime = ref("")
        const searchMonthly = ref("")
        const options = ref({
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
        })
        const optionsOnetime = ref({
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
        })
        const optionsDefault = ref({
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
        })

        const dialogAdd = (val) => {
            openDialogAdd.value = true
            typePackage.value = val
            // console.log(val)
        }
        const deletepackageselected = async (val) => {
            // console.log(packageselected.value)
            let resp = await deletePackage({id: packageselected.value})
            if(resp.data.status){
                await refreshTab(typePackage.value)
            }
        }
        const refreshTab = async (val) => {
            if(val == 'monthly'){
                await fetchListPackageMonthly(options.value)
            }else if(val == 'default'){
                await fetchListPackageDefault(optionsDefault.value)
            }else{
                await fetchListPackageOnetime(optionsOnetime.value)
            }
        }

        let search = null;
        watch(searchOnetime, (val) => {
            if (search) {
                clearTimeout(search);
                search = setTimeout(function() {
                optionsOnetime.value = { ...options.value, search: val };
                }, 1000);
            } else {
                search = setTimeout(function() {}, 1000);
            }
        });
        let searchM = null;
        watch(searchMonthly, (val) => {
            if (searchM) {
                clearTimeout(searchM);
                searchM = setTimeout(function() {
                options.value = { ...options.value, search: val };
                }, 1000);
            } else {
                searchM = setTimeout(function() {}, 1000);
            }
        });
        watch(
        options,
        async (val) => {
            try {
                await fetchListPackageMonthly(val)
            } finally {
                loading.value = false;
            }
        },
            { deep: true }
        );
        watch(
        optionsOnetime,
        async (val) => {
            try {
                await fetchListPackageOnetime(val)
            } finally {
                loading.value = false;
            }
        },
            { deep: true }
        );
        watch(
        optionsDefault,
        async (val) => {
            try {
                await fetchListPackageDefault(val)
            } finally {
                loading.value = false;
            }
        },
            { deep: true }
        );
        return{
            read_only,

            headersPackage,
            openDialogAdd,
            openDialogDetail,
            opendialogdeletepackage: ref(false),
            typePackage,
            searchOnetime,
            searchMonthly,
            packageselected,
            tab: ref(''),
            loading,
            options,
            optionsOnetime,
            optionsDefault,
            Indoformat,
            dialogAdd,
            deletepackageselected,
            refreshTab,
            fetchListPackageMonthly,
            fetchListPackageOnetime,
            fetchListPackageDefault,
            packageMonthly,
            getPackageMonthly,
            getPackageOnetime,
            getTotalRowsMonthly,
            getTotalRowsOnetime,
            getPackageDefault, 
            getTotalRowsDefault,
            deletePackage,
        }
    },
})
</script>

<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>