<template>
  <div>
    <div class="row">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <v-overlay :value="overlay">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
            <v-row>
              <v-col cols="8">
                <div class="fz-21 font-weight-bold font--text">
                  Create Ticket
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  maxlength="50"
                  v-model="subject"
                  outlined
                  placeholder="Enter Subject Ticket"
                  :error-messages="
                    $v.subject.$errors.length
                      ? $v.subject.$errors[0].$message
                      : ''
                  "
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="d-flex flex-row">
                <v-card
                  height="80"
                  min-width="372"
                  outlined
                  class="rounded-lg pl-2"
                  flat
                  :style="{
                    border: type == '1' ? '1px solid #2C94D2' : '',
                  }"
                  @click="
                    () => {
                      type = '1'
                      getReqType()
                    }
                  "
                >
                  <div class="d-flex pa-1 align-center">
                    <div>
                      <v-radio-group v-model="type" class="mr-3 ml-1">
                        <v-radio value="1"></v-radio>
                      </v-radio-group>
                    </div>
                    <div>
                      <p class="fz-16 font-weight-bold mb-2">
                        Account and Billing Support
                      </p>
                      <p class="fz-12 accent--text mb-0">
                        Assistance with account and billing related inquires
                      </p>
                    </div>
                  </div>
                </v-card>
                <div style="height: auto; width: 40px" />
                <v-card
                  outlined
                  height="80"
                  min-width="372"
                  flat
                  class="rounded-lg pl-2"
                  :style="{
                    border: type == '2' ? '1px solid #2C94D2' : '',
                  }"
                  @click="
                    () => {
                      type = '2'
                      getReqType()
                    }
                  "
                >
                  <div class="d-flex pa-1 align-center">
                    <div>
                      <v-radio-group v-model="type" class="mr-3 ml-1">
                        <v-radio value="2"></v-radio>
                      </v-radio-group>
                    </div>
                    <div>
                      <p class="fz-16 font-weight-bold mb-2">
                        Technical Support
                      </p>
                      <p class="fz-12 accent--text mb-0">
                        Service related technical issues
                      </p>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <br />
            <v-divider />
            <br />
            <v-row>
              <v-col cols="6">
                <div class="fz-20 font-weight-bold font--text">
                  Ticket Details
                </div>

                <br />
                <h4 class="pt-3">Project Name*</h4>
                <v-text-field
                v-if="projek"
                :value="projek.name"
                outlined
                readonly></v-text-field>

                <h4 class="pt-3">Request Type Ticket</h4>
                <v-select
                  placeholder="Choose Request Type"
                  :items="requestItemFilter"
                  outlined
                  v-model="request"
                  item-text="name"
                  item-value="ID"
                  single-line
                  append-icon="mdi-chevron-down"
                  :error-messages="
                    $v.request.$errors.length
                      ? $v.request.$errors[0].$message
                      : ''
                  "
                ></v-select>

                <div class="d-flex">
                  <!-- Paket Active Monthly -->
                  <div class="d-flex flex-column mb-1" v-if="getActivePackageMonthly.length > 0 && type_ms && type == 2">
                    <div class="d-flex">
                      <v-card
                      v-if="getActivePackageMonthly[0].ticket_available>0"
                      border-color="primary"
                      width="170"
                      outlined
                      class="rounded-lg mt-1 mr-2 active-card"
                      @click="()=>{
                          click_id_paket = getActivePackageMonthly[0].package_id
                          subs_package_id = getActivePackageMonthly[0].id
                        }"
                        :style="{ border: click_id_paket == getActivePackageMonthly[0].package_id ? '1px solid #2C94D2' : ''}">
                        <v-card-text class="pa-1 mt-2">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Package Active</div>
                            <div class="d-flex justify-center font-weight-bold">{{ getActivePackageMonthly[0].package_name }}</div>
                          </div>
                        </v-card-text>
                        <v-divider :color="click_id_paket == getActivePackageMonthly[0].package_id ? '#2C94D2' : ''"></v-divider>
                        <v-card-text class="pa-1 mt-2 mb-1">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Ticket Available</div>
                            <div class="d-flex justify-center font-weight-bold"> {{ getActivePackageMonthly[0].package_name == 'Total Care' ? 'Unlimited' : getActivePackageMonthly[0].ticket_available }}</div>
                          </div>
                        </v-card-text>
                      </v-card>

                      <v-card
                      v-if="getActivePackageMonthly[0].ticket_available<=0"
                      border-color="primary"
                      width="170"
                      outlined
                      class="rounded-lg mt-1 mr-2">
                        <v-card-text class="pa-1 mt-2">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Package Active</div>
                            <div class="d-flex justify-center font-weight-bold">{{ getActivePackageMonthly[0].package_name }}</div>
                          </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text class="pa-1 mt-2 mb-1">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Ticket Available</div>
                            <div class="d-flex justify-center font-weight-bold"> {{ getActivePackageMonthly[0].ticket_available }}</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                  <!-- Default Package -->
                  <div class="d-flex flex-column" v-if="(type==2 && !isCurrentMonth && (request == 2 || request == 3)) || (!empty_kuota && type_not_exist && type == 2) || (getActivePackageMonthly.length==0 && (request == 2 || request == 3) && type == 2) || (empty_kuota && type == 2)">
                    <div class="d-flex">
                      <v-card
                      border-color="primary"
                      width="170"
                      outlined
                      class="rounded-lg mt-1 mr-2 active-card"
                      @click="()=>{
                        click_id_paket = default_pckg[0].id
                        subs_package_id = ''
                      }"
                      :style="{ border: click_id_paket == default_pckg[0].id ? '1px solid #2C94D2' : ''}"
                      >
                        <v-card-text class="pa-1 mt-2">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Package</div>
                            <div class="d-flex justify-center font-weight-bold text-center">{{ default_pckg[0].name }}</div>
                          </div>
                        </v-card-text>
                        <v-divider :color="click_id_paket == default_pckg[0].id ? '#2C94D2' : ''"></v-divider>
                        <v-card-text class="pa-1 mt-2 mb-1">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Price</div>
                            <div class="d-flex justify-center font-weight-bold">IDR {{ Indoformat.format(default_pckg[0].price) }}/Ticket</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                </div>
                <div class="d-flex red--text" v-if="$v.click_id_paket.$errors.length">
                  {{ $v.click_id_paket.$errors[0].$message}}
                </div>

                <div class="d-flex">
                  <!-- Paket Active Add Ons -->
                  <div class="d-flex flex-column mb-1" v-if="getActivePackageAddOns.length>0 && request == 4 && type == 2">
                    <div class="d-flex">
                      <v-card
                      border-color="primary"
                      width="170"
                      outlined
                      class="rounded-lg mt-1 mr-2 active-card"
                      v-for="data in filterMonthAddons"
                      :key="data.package_id"
                       @click="()=>{
                        click_id_order = data.package_id
                        subs_package_id = data.id
                      }"
                      :style="{ border: click_id_order == data.package_id ? '1px solid #2C94D2' : ''}">
                        <v-card-text class="pa-1 mt-2">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Package Active</div>
                            <div class="d-flex justify-center font-weight-bold">{{ data.package_name }}</div>
                          </div>
                        </v-card-text>
                        <v-divider :color="click_id_order == data.package_id ? '#2C94D2' : ''"></v-divider>
                        <v-card-text class="pa-1 mt-2 mb-1">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Ticket Available</div>
                            <div class="d-flex justify-center font-weight-bold"> {{ data.ticket_available }}</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                  
                  <!-- All Paket Add Ons -->
                  <div class="d-flex flex-column" v-if="request == 4 && type == 2">
                    <div class="d-flex">
                      <v-card
                      v-for="data in filter_onetime"
                      :key="data.id"
                      border-color="primary"
                      width="170"
                      outlined
                      class="rounded-lg mt-1 mr-2 active-card"
                      @click="()=>{
                        click_id_order = data.id
                        subs_package_id = ''
                      }"
                      :style="{ border: click_id_order == data.id ? '1px solid #2C94D2' : ''}"
                      >
                        <v-card-text class="pa-1 mt-2">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Package</div>
                            <div class="d-flex justify-center font-weight-bold text-center">{{ data.name }}</div>
                          </div>
                        </v-card-text>
                        <v-divider :color="click_id_order == data.id ? '#2C94D2' : ''"></v-divider>
                        <v-card-text class="pa-1 mt-2 mb-1">
                          <div class="d-flex flex-column">
                            <div class="d-flex justify-center mb-1">Price</div>
                            <div class="d-flex justify-center font-weight-bold">IDR {{ Indoformat.format(data.price) }}/Ticket</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                </div>
                <div class="d-flex red--text" v-if="$v.click_id_order.$errors.length">
                  {{ $v.click_id_order.$errors[0].$message}}
                </div>

                <h4 class="pt-5" v-if="request && request != 1">Product</h4>
                <v-select
                  v-if="request && request != 1"
                  placeholder="Choose Product"
                  :items="products"
                  v-model="product"
                  item-text="name"
                  item-value="ID"
                  outlined
                  single-line
                  append-icon="mdi-chevron-down"
                  :error-messages="
                    $v.product.$errors.length
                      ? $v.product.$errors[0].$message
                      : ''
                  "
                ></v-select>

                <h4 class="pt-5" v-if="request && request != 1">Asset</h4>
                <v-select
                  v-if="request && request != 1"
                  placeholder="Choose Asset"
                  :items="assets"
                  v-model="asset"
                  item-text="Name"
                  item-value="Id"
                  outlined
                  single-line
                  return-object
                  append-icon="mdi-chevron-down"
                ></v-select>

                <!-- <h4 class="pt-3">Service List</h4>
                <v-select
                  placeholder="Normal"
                  :items="severities"
                  outlined
                  v-model="severity"
                  :item-text="'text'"
                  :item-value="'value'"
                  single-line
                  append-icon="mdi-chevron-down"
                ></v-select>

                 <h4 class="pt-3">Priority</h4>
                <v-select
                  placeholder="Normal"
                  :items="priorityitems"
                  outlined
                  v-model="severity"
                  item-text="name"
                  item-value="id"
                  single-line
                  append-icon="mdi-chevron-down"
                ></v-select> -->

                <h4 class="pt-3">Description</h4>
                <v-textarea
                  v-model="limittype"
                  outlined
                  name="input-7-4"
                  placeholder="Enter Description"
                  :error-messages="
                    $v.limittype.$errors.length
                      ? $v.limittype.$errors[0].$message
                      : ''
                  "
                ></v-textarea>

                <h4 class="pt-5">Site</h4>
                <v-select
                  placeholder="Choose Site"
                  :items="sitesitem"
                  v-model="website"
                  item-text="name"
                  item-value="ID"
                  outlined
                  single-line
                  append-icon="mdi-chevron-down"
                  :error-messages="
                    $v.website.$errors.length
                      ? $v.website.$errors[0].$message
                      : ''
                  "
                ></v-select>

              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <v-btn @click="$router.go(-1)" class="accent" dark depressed block
                  ><span class="fz-14">Cancel</span></v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn
                :loading="loadingBtnSubmit"
                :disabled="loadingBtnSubmit"
                 depressed 
                 class="secondary" 
                 block 
                 @click="submitTicket()"
                  ><span class="fz-14">Submit</span></v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  height: 55px !important;
}
</style>

<script>
import ticket from "./ticket";
import { onMounted, ref, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, requiredIf, minLength } from "@vuelidate/validators";
import { TICKET } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters
} from "vuex-composition-helpers";
import { PROJECT } from "../project/namespace";
import { SUPERADMIN } from '../superadmin/namespace'
import { MANAGESERVICE } from '../manage-service/namespace'
import { Indoformat } from "@/lib/formatter";
import moment from 'moment'

export default {
  setup(props, context) {
    const test = ref("");
    const test2 = ref("");
    const types = ref(["Billing", "Technical"]);
    const severities = ref([
      {
        text: "Low",
        value: "low",
      },
      {
        text: "Normal",
        value: "normal",
      },
      {
        text: "Medium",
        value: "medium",
      },
      {
        text: "High",
        value: "high",
      },
    ]);

    const request = ref("")
    const { fetchorganizations } = useNamespacedActions(SUPERADMIN, [
      "fetchorganizations"
    ]);
    const { organizations } = useNamespacedState(SUPERADMIN, [
      "organizations",
    ]);

    const { 
      loginMS, 
      fetchListSubsPackage,
      fetchListPackageDefault,
      fetchListPackageOnetime } = useNamespacedActions(MANAGESERVICE, 
      ["loginMS", 
      "fetchListSubsPackage",
      "fetchListPackageDefault",
      "fetchListPackageOnetime"])
    const { 
      getActivePackageMonthly, 
      getActivePackageAddOns, 
      getPackageDefault,
      getPackageOnetime} = useNamespacedGetters(MANAGESERVICE, 
      ["getActivePackageMonthly", 
      "getActivePackageAddOns",
      "getPackageDefault",
      "getPackageOnetime"])

    const { 
      addticket,
      AddTicket,
      fetchRequestType, 
      fetchpriority,
      fetchimpact,
      fetchurgency,
      fetchStatus,
      fetchsites,
      fetchServiceCategory,
      fetchProducts,
      fetchAssets } = useNamespacedActions(TICKET, 
      ["addticket",
      "AddTicket", 
      "fetchRequestType", 
      "fetchpriority",
      "fetchimpact",
      "fetchurgency",
      "fetchStatus",
      "fetchsites",
      "fetchServiceCategory",
      "fetchProducts",
      "fetchAssets"]);
    const { 
      requestType, 
      status, 
      priorityitems,
      impactitem,
      urgencyitem,
      sitesitem,
      serviceCategoryItem, 
      products,
      assets } = useNamespacedState(TICKET, 
      ["requestType", 
      "status", 
      "priorityitems",
      "impactitem",
      "urgencyitem",
      "sitesitem",
      "serviceCategoryItem",
      "products",
      "assets"]);

    const { fetchUserProfile } = useNamespacedActions("ROLEPERMISSION", [
      "fetchUserProfile",
    ]);
    const { userprofile } = useNamespacedState("ROLEPERMISSION", [
      "userprofile",
    ]);

    function check1() {
      test.value = "checked";
      test2.value = "";
    }

    function check2() {
      test.value = "";
      test2.value = "checked";
    }

    const type = ref("");
    const limittype = ref("");
    const subject = ref("");
    const project = ref("");
    const website = ref("")
    const locals = JSON.parse(localStorage.getItem('currentOrg'))
    let projek = JSON.parse(localStorage.getItem('currentProj'))
    let superadmin = JSON.parse(localStorage.getItem('login_ms'))
    const user_id = locals.user_id ? locals.user_id : superadmin.user_id;
    const customer_name = locals.name;
    const serviceCategory = ref(1);
    const impact = ref(3);
    const urgency = ref(3);
    const resultPriorityId = ref("");
    const severity = ref("");
    const overlay = ref(false)
    const requestItemFilter = ref([]);
    const type_not_exist = ref(false)
    const empty_kuota = ref(false)
    const type_ms = ref(false)
    const click_id_order = ref(null)
    const click_id_paket = ref(null)
    const default_pckg = ref([])
    const filter_onetime = ref([])
    const loadingBtnSubmit = ref(false)
    const product = ref("")
    const asset = ref("")
    let token_ms = localStorage.getItem('token_ms')
    const nowDate = new Date().toISOString().slice(0,10)
    const isCurrentMonth = ref(false)
    const filterMonthAddons = ref([])
    const subs_package_id = ref("")
    
    const $v = useVuelidate(
      {
        subject: {
          required: required,
          minLength: minLength(5),
        },
        type: { required: required },
        limittype: { required: required },
        // project: { required: required },
        request: { required: required },
        serviceCategory: { required: required },
        website: { required: required },
        impact: { required: required },
        click_id_order: { required: requiredIf( () => { return request.value == 4 })},
        click_id_paket: { required: requiredIf( () => { return (request.value == 2 || request.value == 3)})},
        product: { required: requiredIf( () => { return type.value == 2 && request.value != 1 })},
      },
      {
        subject,
        type,
        limittype,
        // project,
        request,
        serviceCategory,
        website,
        impact,
        click_id_order,
        click_id_paket,
        product,
        asset
      }
    );
    watch(type, (newVal) => {
      product.value = ''
      request.value = ''
      asset.value = ''
      subs_package_id.value = ''
    })
    watch(product, async (newVal) => {
      if(newVal != ''){
        overlay.value = true
        let nameProduct = ''
        if(newVal == 1){
          nameProduct = 'flexi'
        }else if(newVal == 2){
          nameProduct = 'objectstorage'
        }else if(newVal == 3){
          nameProduct = 'storage'
        }else if(newVal == 4){
          nameProduct = 'dns'
        }else if(newVal == 5){
          nameProduct = 'dbaas'
        }else if(newVal == 6){
          nameProduct = 'registry'
        }
        let payload = {
          productName: nameProduct,
          project_id: projek.id
        }

        let resp = await fetchAssets(payload)
        if(resp.status){
          overlay.value = false
        }
      }
    })
    watch(project, async (newVal) => {
      request.value = ''
      overlay.value = true
      localStorage.setItem('currentProj', JSON.stringify(newVal))
      // await loginMS()
      await fetchListPackageDefault()
      await fetchListPackageOnetime()
      let resp = await fetchListSubsPackage()
      if(resp.status){
        overlay.value = false
      }
    })
    watch(request, (newVal) => {
      $v.value.click_id_order.$reset()
      $v.value.click_id_paket.$reset()
      let id_tipe = newVal
      let tipe_default_id = null
      type_not_exist.value = false
      empty_kuota.value = false
      type_ms.value = false
      click_id_order.value = null
      click_id_paket.value = null
      product.value = ''
      let monthPackage = getActivePackageMonthly.value.length>0 ? moment(getActivePackageMonthly.value[0].activation_date).format("YYYY-MM") : ''
      let onMonth = moment(nowDate).format("YYYY-MM")

      if(newVal == 2 || newVal == 3){
        tipe_default_id = newVal == 2 ? 2 : newVal == 3 ? 1 : 55
        default_pckg.value = getPackageDefault.value.filter( data => data.id == tipe_default_id)

        if(monthPackage == onMonth){
          isCurrentMonth.value = true
          type_ms.value =  getActivePackageMonthly.value.length>0 ? getActivePackageMonthly.value[0].subs_package_type.some(data => data.type_id == id_tipe) : false

          if(getActivePackageMonthly.value.length > 0 && !type_ms.value){
            type_not_exist.value = true
          }else{
            type_not_exist.value = false
          }
          if(getActivePackageMonthly.value.length > 0 && getActivePackageMonthly.value[0].ticket_available <= 0){
            empty_kuota.value = true
          }else{
            empty_kuota.value = false
          }
        }else{
          isCurrentMonth.value = false
        }
      }else if(newVal == 1){
        console.log('id_tipe = 1')
      }else{
        if(getActivePackageAddOns.value.length>0){
          filterMonthAddons.value = getActivePackageAddOns.value.filter( x => moment(x.activation_date).format("YYYY-MM") == onMonth)
          filter_onetime.value = getPackageOnetime.value.filter(x => filterMonthAddons.value.every(x2 => x2.package_name != x.name))
        }else{
          filter_onetime.value = getPackageOnetime.value
        }
        // console.log(filter_onetime.value)
      }
    })
    async function submitTicket() {
      Priority()
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      loadingBtnSubmit.value = true
      let paket_id = null
      let assetVal = []
      if(request.value == 4){
        paket_id = click_id_order.value
        if(asset.value != ""){
          assetVal = [{
            name: asset.value.Ci_Name,
            id: asset.value.CiId
          }]
        }
      }else if(request.value == 1){
        console.log('Information Request')
        paket_id = 0
      }else{
        let monthPackage = getActivePackageMonthly.value.length>0 ? moment(getActivePackageMonthly.value[0].activation_date).format("YYYY-MM") : ''
        let onMonth = moment(nowDate).format("YYYY-MM")
        if(getActivePackageMonthly.value.length>0){
          if(monthPackage == onMonth){
            if(getActivePackageMonthly.value[0].ticket_available>0){
              if(type_ms.value){
                console.log('type ada')
                // paket_id = getListPackageMonthly.value.filter( data => data.name == getActivePackageMonthly.value[0].package_name)
              }else{
                console.log('type tidak ada di paket')
              } 
            }else{
              console.log('kuota habis')
            }
          }else{
            console.log('bukan bulannya')
          }
        }else{
          console.log('tidak punya paket')
        }
        paket_id = click_id_paket.value
        if(asset.value != ""){
          assetVal = [{
            name: asset.value.Ci_Name,
            id: asset.value.CiId
          }]
        }
      }
      let proj = JSON.parse(localStorage.getItem("currentProj"))

      const Value = {
        organization_id: locals.id,
        project_id: projek.id,
        project_name: projek.name,
        user_id: user_id,
        subject: subject.value,
        description: limittype.value,
        customer_name: customer_name,
        ticket_type_id: parseInt(type.value),
        request_type_id: request.value,
        impact_id: impact.value,
        urgency_id: urgency.value,
        priority_id: resultPriorityId.value,
        status_id: 5,
        category_id: 1,
        subcategory_id: 1,
        item_id: product.value ? product.value : 1,
        assets: assetVal,
        site_id: website.value,
        service_category_id: serviceCategory.value,
        package_id: paket_id,
        ticket_date: moment(new Date()).format('YYYY-MM-DD'),
        requester: userprofile.value.fullname,
        sp_token: token_ms,
        postpaid_type: proj.postpaid_type,
        role: localStorage.getItem("role"),
        subs_package_id: subs_package_id.value.toString(),
        payment_method: proj.payment_method,
        service_activation_date: proj.service_activation_date
      }; //
      // console.log(Value)
      let resp = await AddTicket(Value)
      if(resp.status == 200){
        context.root.$router.replace("/manage-ticket");
        loadingBtnSubmit.value = false
      }else{
        console.log(resp)
        loadingBtnSubmit.value = false
      }
    }

    const Priority = () => {
      priorityitems.value.map((x) => {
        if (x.impact_id == impact.value && x.urgency_id == urgency.value) {
          resultPriorityId.value = x.ID;
        }
      });
    };
    const getReqType = () => {
      if(type.value == 1){
        const resultTe = requestType.value.filter(
          (x) => x.ticket_type_id == type.value
        )
        return (requestItemFilter.value = resultTe);
      }else{
        return (requestItemFilter.value = requestType.value);
      }
    };
    
    const { fetchprojects } = useNamespacedActions(PROJECT, ["fetchprojects"]);
    const { projects } = useNamespacedState(PROJECT, ["projects"]);
    const { fetchticketstype } = useNamespacedActions(PROJECT, ["fetchticketstype"]);
    // const { ticket_type, } = useNamespacedState(TICKET, ["typetickets"]);
    onMounted(() => {
      fetchprojects();
      fetchStatus()
      fetchpriority()
      fetchimpact()
      fetchurgency()
      fetchsites()
      fetchServiceCategory()
      // fetchticketstype();
      fetchUserProfile()
      fetchRequestType()
      fetchorganizations();
      fetchListPackageDefault()
      fetchListPackageOnetime()
      fetchListSubsPackage()
      fetchProducts()

    });
    return {
      projects,
      request,
      project,
      projek,
      $v,
      subject,
      types,
      type,
      severities,
      severity,
      limittype,
      check1,
      check2,
      test,
      test2,
      submitTicket,
      getReqType,
      getActivePackageMonthly, 
      getActivePackageAddOns, 
      getPackageDefault,
      getPackageOnetime,
      priorityitems,
      sitesitem,
      serviceCategoryItem,
      overlay,
      Indoformat,
      requestItemFilter,
      products,
      assets,
      website,
      type_not_exist,
      empty_kuota,
      type_ms,
      loadingBtnSubmit,
      click_id_order,
      click_id_paket,
      default_pckg,
      filter_onetime,
      product,
      asset,
      isCurrentMonth,
      filterMonthAddons,
      subs_package_id
    };
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  ::v-deep .v-card--link::before {
    background: none;
  }
}

.title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.title-info {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}
h4 {
  padding-bottom: 10px;
}

input[type="radio"] {
  width: 30px;
  height: 30px;
}

.v-input {
  ::v-deep .v-text-field__details .v-messages__wrapper :not(.error--text) {
    z-index: -1;
    width: 100px;
  }
}

.active-card:hover{
  border: 1px solid #2C94D2
}
</style>