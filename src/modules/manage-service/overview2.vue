<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card class="rounded-lg elevation-0">
                    <v-container fluid class="">
                        <v-card-text class="d-flex px-8 flex-row align-center">
                            <div class="headline font-weight-bold font--text">
                                Overview Manage Service
                            </div>
                        </v-card-text>
                        <v-card-text class="d-flex px-8 flex-row " v-if="getActivePackageMonthly.length">
                            <div class="d-flex">
                                <table class="tab-cp" >
                                    <tbody>
                                        <tr style="height:40px">
                                            <td class="fz-16" style="width: 175px">Current Active Package</td>
                                            <td style="width:25px">:</td>
                                            <td class="fz-16 font-weight-bold">{{ getActivePackageMonthly[0].package_name }}</td>
                                        </tr>
                                        <tr>
                                            <td class="fz-16">Activation Date</td>
                                            <td>:</td>
                                            <td class="fz-16 font-weight-bold">{{ getActivePackageMonthly[0].activation_date | activeDateFilter }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <v-spacer></v-spacer>
                            <div class="d-flex justify-end align-end pb-1" v-if="getActivePackageMonthly.length">
                                <v-btn
                                color="error white--text"
                                class="mr-2"
                                height="40"
                                v-if="!read_only"
                                width="150"
                                @click=" () => {
                                    modalUnsubs()
                                    typePackage = 'monthly'
                                    id_package = getActivePackageMonthly[0].id
                                    name_package = getActivePackageMonthly[0].package_name
                                    }"
                                >Unsubscribe Package</v-btn>
                                <v-btn 
                                color="secondary" 
                                to="/overview/package-monthly" 
                                height="40"
                                width="185" 
                                link>
                                    Downgrade/Upgrade Package
                                </v-btn>
                            </div>
                        </v-card-text>
                        <v-card-text class="px-8" v-if="getActivePackageMonthly.length">
                        <v-simple-table class="tab-desc mb-4">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th>
                                            Service
                                        </th>
                                        <th colspan="">
                                            Support
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="border-right:1px solid rgba(0, 0, 0, 0.12)" rowspan="">Technical Support</td>
                                        <td>
                                            <!-- <div v-html="getActivePackageMonthly[0].description"></div> -->
                                            <VueMarkdown :source="getActivePackageMonthly[0].description" show html class="" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-right:1px solid rgba(0, 0, 0, 0.12)">Ticket Available</td>
                                        <td v-if="getActivePackageMonthly[0].quota != 9999"> <span class="font-weight-bold ml-2">{{ getActivePackageMonthly[0].ticket_available }}</span> / {{ getActivePackageMonthly[0].quota }} <span>{{ getActivePackageMonthly[0].ticket_available >=1 ? 'Tickets' : 'Ticket' }}</span></td>
                                        <td v-if="getActivePackageMonthly[0].quota == 9999"> <span class="font-weight-bold">Unlimited Tickets</span></td>
                                    </tr>
                                    <!-- <tr>
                                        <td style="border-right:1px solid rgba(0, 0, 0, 0.12);">Add ons Installation</td>
                                        <td v-if="getActivePackageAddOns.length"><p v-for="data in getActivePackageAddOns" :key="data.package_name"><span class="font-weight-bold">{{ data.quota }}</span> {{ data.package_name }}</p></td>
                                        <td v-if="!getActivePackageAddOns.length">0</td>
                                    </tr> -->
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>
                    <v-card-text v-else>
                        <v-row>
                                <v-col cols="12" class="d-flex justify-center">
                                    <span class="fz-21">You Don't have any Package</span>
                                </v-col>
                                <v-col class="d-flex justify-center" v-if="!read_only">
                                    <v-btn color="secondary" link to="/overview/package-monthly">
                                        Purchase a Package
                                    </v-btn>
                                </v-col>
                            </v-row>
                    </v-card-text>
                    </v-container>
                </v-card>
            </v-col>
            
            <v-col >
                <v-card class="elevation-0" v-if="getActivePackageAddOns.length">
                    <v-container fluid>
                        <v-card-text class="d-flex px-8 flex-row align-center">
                            <div class="headline font-weight-bold font--text">
                                Add Ons
                            </div>
                            <v-spacer></v-spacer>
                            <div class="d-flex justify-end align-end pb-1" v-if="getActivePackageAddOns.length || !read_only">
                                <v-btn
                                color="red white--text"
                                class="mr-2"
                                height="40"
                                width="150"
                                @click=" () => {
                                    modalUnsubs()
                                    typePackage = 'addons'
                                    }"
                                >Unsubscribe Package</v-btn>
                            </div>
                        </v-card-text>
                        <v-card-text class="px-8">
                            <v-simple-table >
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th>
                                                Service
                                            </th>
                                            <th colspan="">
                                                Support
                                            </th>
                                            <th>
                                                Activation Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="border-right:1px solid rgba(0, 0, 0, 0.12); width:45%;font-weight: normal;">Add ons Installation</td>
                                            <td v-if="getActivePackageAddOns.length" style="border-right:1px solid rgba(0, 0, 0, 0.12);"><p v-for="data in getActivePackageAddOns" :key="data.package_name"><span class="font-weight-bold">{{ data.quota }}</span> {{ data.package_name }}</p></td>
                                            <td v-if="getActivePackageAddOns.length"> <p v-for="data in getActivePackageAddOns" :key="data.package_name">{{ data.activation_date | activeDateFilter }}</p></td>
                                            <td v-if="!getActivePackageAddOns.length">0</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-container>
                </v-card>
            </v-col>
            <v-dialog
            v-model="unsubs"
            max-width="500px"
            >
                <v-card rounded="lg">
                    <v-card-title class="error white--text">
                        Unsubscribe Package
                    </v-card-title>
                    <v-card-text>
                        <p class="mt-3 font-weight-bold fz-20">Do You Want to Unsubscribe Your Package?</p>
                        <v-select
                        v-if="typePackage == 'addons'"
                        v-model="chooseAddOns"
                        placeholder="Choose Package"
                        outlined
                        :items="getActivePackageAddOns"
                        item-text="package_name"
                        return-object
                        class="mb-2"
                        :error-messages="
                        $v.chooseAddOns.$errors.length
                            ? $v.chooseAddOns.$errors[0].$message
                            : ''
                        "
                        ></v-select>
                        <p v-if="name_package">Please Type <span class="font-weight-bold">{{ name_package }}</span> in The Form Below</p> 
                        <v-text-field
                        v-model="textUnsub"
                        outlined
                        v-if="name_package"
                        :error-messages="
                        $v.textUnsub.$errors.length
                            ? $v.textUnsub.$errors[0].$message
                            : ''
                        "
                        ></v-text-field>
                        <!-- <span class="red--text" v-if="$v.textUnsub.$errors.length">{{ $v.textUnsub.$errors[0].$message }}</span> -->
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        class="accent mb-2"
                        text
                        @click="unsubs = false"
                        >
                        Close
                        </v-btn>
                        <v-btn
                        class="secondary mb-2 mr-2"
                        text
                        @click="confirmUnsubs"
                        >
                        Confirm
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import { onMounted, ref, reactive, computed, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import { MANAGESERVICE } from './namespace'
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, requiredIf } from "@vuelidate/validators";
import moment from 'moment'
import { AccessControl } from "@/lib/middleware";

export default {
    setup(props, context){
        const access_control = new AccessControl(context.root.$store);
        const read_only = ref(access_control.is_read_mode('Manage Service'));
        const { fetchActivePackage, unsubscribePackage, loginMS, fetchListSubsPackage } = useNamespacedActions(MANAGESERVICE,["fetchActivePackage", "unsubscribePackage", "loginMS", "fetchListSubsPackage"])
        const { getActivePackageMonthly, getActivePackageAddOns } = useNamespacedGetters(MANAGESERVICE, ["getActivePackageMonthly", "getActivePackageAddOns"])

        const selfSupport = reactive(
            {
                support: [
                    {
                        id: 2,
                        name : 'FAQ & Documentation'
                    }]
            })
        const ts = reactive({
            corebusiness:{
                rem_ticket: '0',
                response_time: '<15 Minutes',
                service_availability: '7 x 24'
            },
            nfi: {
                rem_ticket: '6',
                response_time: '<18 Hours',
                service_availability: 'Local Business Hours: 7 x 24'
            }
        })
        const unsubs = ref(false)
        const name_package = ref('')
        const textUnsub = ref('')
        const typePackage = ref('')
        const chooseAddOns = ref('')
        const id_package = ref(null)

        const $v = useVuelidate(
            {
                textUnsub: { 
                    required,
                    sameAs: helpers.withMessage( 'The value must be the same as your package name' ,sameAs(name_package)) 
                },
                chooseAddOns: { required: requiredIf( () => { return typePackage.value == 'addons' }) }
            },
            {
                textUnsub,
                chooseAddOns
            }
        )
        
        const modalUnsubs = (data) => {
            unsubs.value = true
        }

        watch(unsubs, (newVal) => {
            if(!newVal){
                name_package.value = ''
                id_package.value = null
                chooseAddOns.value = ''
                textUnsub. value = ''
                $v.value.$reset()
            }
        })
        watch(chooseAddOns, (newVal) => {
            $v.value.$reset()
            textUnsub.value = ''
            if(newVal != '' ){
                name_package.value = newVal.package_name
                id_package.value = newVal.id
            }
        })

        async function confirmUnsubs(data) {
            $v.value.$touch()
            if ($v.value.$errors.length) return;
            // console.log($v.value)
            let proj = JSON.parse(localStorage.getItem("currentProj"))
            let payload = {
                id_package: id_package.value,
                postpaid_type: proj.postpaid_type,
                role: localStorage.getItem("role")
            }
            let resp = await unsubscribePackage(payload)
            if(resp.status){
                let role = localStorage.getItem('role')
                if(role == 'Superadmin'){
                    await fetchListSubsPackage()
                }else{
                    await fetchActivePackage()
                }
                textUnsub.value = ''
                unsubs.value = false
                $v.value.$reset()
            }else{
                console.log(resp)
            }
        }

        onMounted(async () => {
            let role = localStorage.getItem('role')
            if(role == 'Superadmin'){
                await fetchListSubsPackage()
            }else{
                await fetchActivePackage()
            }
        })

        return {
            getActivePackageMonthly,
            getActivePackageAddOns,
            selfSupport,
            name_package,
            id_package,
            chooseAddOns,
            typePackage,
            textUnsub,
            unsubs,
            read_only,
            ts,
            $v,
            loginMS,
            fetchActivePackage,
            unsubscribePackage,
            fetchListSubsPackage,
            modalUnsubs,
            confirmUnsubs
        }
    },
    filters:{
        activeDateFilter(val){
            return moment(val).format('DD/MM/YYYY')
        }
    },
    mounted(){
    }
}
</script>

<style scoped>
.tab-desc > .v-data-table__wrapper > table tbody tr td{
    font-weight: normal;
    font-size: 13px !important;
}
.tab-cp > .v-data-table__wrapper > table tbody tr td{
    border: none !important;
    font-size: 15px !important;
}
</style>