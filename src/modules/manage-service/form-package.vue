<template>
    <v-row>
        <v-col cols="12">
            <v-card class="rounded-lg elevation-0">
                <v-container class="ml-3" fluid>
                    <v-row>
                        <v-col cols="12">
                            <div class="headline font-weight-bold font--text">
                                {{ getActivePackageMonthly.length && !isInstallation ? 'Change Package' : isInstallation ? 'Purchase a Add Ons' : 'Purchase a Package' }}
                            </div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                            <v-row >
                                <v-col cols="12">
                                    <p class="font-weight-bold">Project</p>
                                    <v-text-field
                                    :value="selectedProject"
                                    outlined
                                    :readonly="disabledForm"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row v-if="getActivePackageMonthly.length && !isInstallation" class="">
                                <v-col cols="12">
                                    <p class="font-weight-bold">Current Active Package</p>
                                    <v-text-field
                                    :value="getActivePackageMonthly[0].package_name"
                                    outlined
                                    :readonly="disabledForm"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="">
                                <v-col cols="12">
                                    <p class="font-weight-bold">{{ getActivePackageMonthly.length && !isInstallation ? 'Change Package to' : 'Package' }}</p>
                                    <v-text-field
                                    :value="next_package"
                                    outlined
                                    :readonly="disabledForm"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row class="">
                                <v-col cols="12">
                                    <p class="font-weight-bold">Activation</p>
                                    <v-radio-group
                                    v-model="activation"
                                    row
                                    :error-messages="
                                    $v.activation.$errors.length
                                        ? $v.activation.$errors[0].$message
                                        : ''
                                    "
                                    >
                                        <v-radio v-if="hiddenDate || isInstallation"  label="Current Month" value="1"></v-radio>
                                        <!-- <v-radio v-if="getActivePackageMonthly.length" label="Next Month" value="3"></v-radio> -->
                                        <v-radio label="Specific Future Month" value="2"></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                            
                            <v-row class="" v-if="activation == 2">
                                <v-col cols="12">
                                    <v-menu
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                        v-model="specificDate"
                                        label="Choose a Month"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        :error-messages="
                                        $v.specificDate.$errors.length
                                            ? $v.specificDate.$errors[0].$message
                                            : ''
                                        "
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                        :min="next_month"
                                        :allowed-dates="!isInstallation ? disableMonth : ''"
                                        type="month"
                                        v-model="specificDate"
                                        @input="menu2 = false"
                                        color="primary"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="d-flex flex-column justify-center align-center" cols="6">
                            <v-card>
                                <v-card-text class="pb-0">
                                    <div class="d-flex justify-center font-weight-bold font--text fz-18 mb-2">
                                        Description
                                    </div>
                                    <v-divider></v-divider>
                                    <div class="d-flex justify-center mt-2 font-weight-bold fz-18">
                                        {{ next_package }}
                                    </div>
                                    <div class="d-flex mt-1 justify-center">
                                        <VueMarkdown :source="description" show html class="mb-2" style=";" />
                                    </div>
                                    <v-divider></v-divider>
                                    <div class="d-flex flex-column py-0">
                                        <span class="d-flex ml-3 justify-center mt-4 fz-15">Quota: {{ quota | qoutaUn }}/Month</span>
                                        <span class="d-flex ml-3 justify-center mt-1 mb-8 fz-16 font-weight-bold">Price: IDR {{ Indoformat.format(price) }}</span>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col v-if="user.role.toLowerCase() !== 'superadmin'" class="d-flex justify-space-between" cols="3">
                            <v-btn block class="accent mr-3" @click="$router.go(-1)">Cancel</v-btn>
                            <v-btn block v-if="(getActivePackageMonthly.length && !isInstallation)" color="secondary" @click="displayUpgradeDialog">Change Package</v-btn>
                            <v-btn block v-if="(!getActivePackageMonthly.length || isInstallation)" color="secondary" @click="displayPurchaseDialog">Purchase Now</v-btn>
                        </v-col>
                        <v-col v-else class="d-flex justify-space-between" cols="3">
                            <v-btn block class="accent mr-3" @click="$router.go(-1)">Cancel</v-btn>
                            <v-btn block v-if="(getActivePackageMonthly.length && !isInstallation)" color="secondary" @click="changePackage">Change Package</v-btn>
                            <v-btn block v-if="(!getActivePackageMonthly.length || isInstallation)" color="secondary" @click="purchase">Purchase Now</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>

        <!-- dialog upgrade package -->
        <dialogNewServiceAvailability
          v-if="upgradeDialog" 
          :onClose="() => {upgradeDialog = false}"
          serviceName="Package"
          actionName="Upgrade Package"
          :onAvailable="changePackage"
        />

        <!-- dialog purchase package -->
        <dialogNewServiceAvailability
          v-if="purchaseDialog" 
          :onClose="() => {purchaseDialog = false}"
          serviceName="Package"
          actionName="Add Package"
          :onAvailable="purchase"
        />
    </v-row>
</template>

<script>
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { MANAGESERVICE } from './namespace'
import localstorage from "@/lib/localstorage";
import { required, requiredIf } from "@vuelidate/validators";
import moment from 'moment';
import { Indoformat } from "@/lib/formatter";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";

export default {
    components: {
      dialogNewServiceAvailability
    },
    setup(props, context){

        const { fetchActivePackage, subscribePackage, upgradePackage, fetchListSubsPackage } = useNamespacedActions(MANAGESERVICE, ["fetchActivePackage", "subscribePackage", "upgradePackage", "fetchListSubsPackage"])
        const { getActivePackageMonthly } = useNamespacedGetters(MANAGESERVICE, ["getActivePackageMonthly"])
        const {checkAvailability} = useNewServiceAvailability()
        const selectedProject = ref(null)
        const disabledForm = ref(true)
        const specificDate = ref(null)
        const activation = ref("")
        const pilihPaket = ref([])
        const next_package = ref("")
        const description = ref('')
        const quota = ref('')
        const price = ref('')
        const isInstallation = ref(false)
        const menu2 = ref(false)
        const org = JSON.parse(localstorage.getItem('currentOrg'))
        const proj = JSON.parse(localstorage.getItem('currentProj'))
        const current_date = moment(new Date()).startOf('month').format('YYYY-MM-DD')
        const next_month = moment(new Date()).startOf('month').add(1, 'months').format('YYYY-MM-DD')
        const nowDate = new Date().toISOString().slice(0,10)
        const hiddenDate = ref(false)
        const purchaseDialog = ref(false)
        const upgradeDialog = ref(false)

        const $v = useVuelidate(
            {
                selectedProject: { required },
                activation: { required },
                specificDate: { required: requiredIf( () => { return activation.value == 2})}
            },
            {
                selectedProject,
                activation,
                specificDate
            }
        )

        async function changePackage(){
            $v.value.$touch()
            if ($v.value.$errors.length) return;
            let payload = {}
            let date_activation = ''
            if(activation.value == 3){
                date_activation = next_month
            }else if(activation.value == 1){
                date_activation = current_date
            }else{
                date_activation = specificDate.value
            }
            let proj = JSON.parse(localStorage.getItem("currentProj"))
            payload = {
                user_id: JSON.parse(localstorage.getItem('userId')),
                organization_id: org.id,
                project_id: proj.id,
                package_id: pilihPaket.value[0].next_id,
                activation_date: moment(date_activation).format('YYYY-MM-DD'),
                role: localStorage.getItem("role"),
                postpaid_type: proj.postpaid_type,
                payment_method: proj.payment_method,
                service_activation_date: proj.service_activation_date
            }
            let resp = await upgradePackage(payload)
            if(resp.status){
                localStorage.removeItem('pilihPaket')
                context.root.$router.replace("/overview");
            }else{
                console.log(resp)
            }
        }

        const displayUpgradeDialog = async () => {
          $v.value.$touch()
          if ($v.value.$errors.length) return;

          await checkAvailability(
            {
              by: "custom", 
              item: {
                service_name: !isInstallation.value ? 'MANAGE_SERVICE' : 'MANAGE_SERVICE_ADDON', 
                id: `${pilihPaket.value[0].next_id}`,
              }
            }
          )

          upgradeDialog.value = true;
        };

        async function purchase(){
            $v.value.$touch()
            if ($v.value.$errors.length) return;
            let payload = {}
            let date_activation = ''
            if(activation.value == 3){
                date_activation = next_month
            }else if(activation.value == 1){
                date_activation = current_date
            }else{
                date_activation = specificDate.value
            }
            let proj = JSON.parse(localStorage.getItem("currentProj"))
            payload = {
                user_id: JSON.parse(localstorage.getItem('userId')),
                organization_id: org.id,
                project_id: proj.id,
                package_id: pilihPaket.value[0].id_package,
                activation_date: moment(date_activation).format('YYYY-MM-DD'),
                postpaid_type : proj.postpaid_type,
                role : localStorage.getItem("role"),
                payment_method: proj.payment_method,
                service_activation_date: proj.service_activation_date
            }
            let resp = await subscribePackage(payload)
            if(resp.status){
                localStorage.removeItem('pilihPaket')
                if(!isInstallation.value){
                    context.root.$router.replace("/overview");
                }else{
                    context.root.$router.replace("/overview/addons");
                }
            }else{
                console.log(resp)
            }
        }

        const displayPurchaseDialog = async () => {
          $v.value.$touch()
          if ($v.value.$errors.length) return;

          await checkAvailability(
            {
              by: "custom", 
              item: {
                service_name:  !isInstallation.value ? 'MANAGE_SERVICE' : 'MANAGE_SERVICE_ADDON', 
                id: `${pilihPaket.value[0].id_package}`,
              }
            }
          )

          purchaseDialog.value = true;
        };

        function disableMonth(val) {
            let tgl = getActivePackageMonthly.value.length>0 ? moment(getActivePackageMonthly.value[0].activation_date).format("YYYY-MM") : ''
            return val != tgl
        }

        onMounted( async () => {
            let role = localStorage.getItem('role')
            if(role == 'Superadmin'){
                await fetchListSubsPackage()
            }else{
                await fetchActivePackage()
            }
            let paket_aktif = getActivePackageMonthly.value.length > 0 ? true : false
            pilihPaket.value = JSON.parse(localStorage.getItem('pilihPaket'))
            selectedProject.value = pilihPaket.value[0].project_name
            next_package.value = pilihPaket.value[0].next_package_name ? pilihPaket.value[0].next_package_name : pilihPaket.value[0].name_package
            description.value = pilihPaket.value[0].description
            quota.value = pilihPaket.value[0].quota
            price.value = pilihPaket.value[0].price
            isInstallation.value = pilihPaket.value[0].installation
            if(paket_aktif){
                hiddenDate.value = moment(getActivePackageMonthly.value[0].activation_date).format("YYYY-MM") > moment(nowDate).format("YYYY-MM") ? true : false
            }else{
                hiddenDate.value = true
            }
        })
        
        return{
            selectedProject,
            pilihPaket,
            next_package,
            isInstallation,
            nowDate,
            disabledForm,
            specificDate,
            activation,
            menu2,
            $v,
            changePackage,
            purchase,
            fetchActivePackage,
            subscribePackage,
            upgradePackage,
            getActivePackageMonthly,
            next_month,
            hiddenDate,
            disableMonth,
            description,
            quota,
            price,
            Indoformat,
            upgradeDialog,
            displayUpgradeDialog,
            purchaseDialog,
            displayPurchaseDialog,
        }
    },
    filters: {
        qoutaUn(val){
            // return val <= 20 ? val+' Tickets' : 'Unlimited'
            return val+' Tickets'
        }
    },
    computed: {
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  },
}
</script>