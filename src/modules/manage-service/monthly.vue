<template>
  <div>
    <v-card-text class="d-flex px-8 pb-0 flex-row align-center">
      <div class="headline font-weight-bold font--text">
          Monthly
      </div>
    </v-card-text>
    <v-card-text class="pt-2">
      <v-row class="d-flex justify-center">
        <v-col v-for="list in getListPackageMonthly" :key="list.id" class="d-flex flex-column" cols="3">
          <v-card class="d-flex flex-column justify-space-around rounded-lg elevation-3 px-2">
            <span class="d-flex justify-center my-2 fz-20 indigo--text">{{ list.name }}</span>
            <v-divider></v-divider>
            <!-- <div v-html="list.description"></div> -->
            <VueMarkdown :source="list.description" show html class="mt-1" style=";" />
            <span class="d-flex ml-3 mt-4 fz-15">Quota: {{ list.quota | qoutaUn }}/Month</span>
            <span class="d-flex ml-3 mt-1 mb-8 fz-16 font-weight-bold">Price: IDR {{ Indoformat.format(list.price) }}</span>
            <div class="d-flex justify-center align-center my-2" v-if="getActivePackageMonthly.length && getActivePackageMonthly[0].monthly == 'true'">
                <v-chip v-if="getActivePackageMonthly[0].package_name == list.name" class="mb-1 font-weight-bold" color="primary" outlined>Your Active Package</v-chip>
                <v-btn
                v-if="getActivePackageMonthly[0].package_name != list.name && list.price > getActivePackageMonthly[0].price" 
                class="mb-1" color="success" 
                link
                @click.native="choosePackage(list)"
                to="/overview/package-monthly/form-package">Upgrade Package</v-btn>

                <v-btn
                v-if="getActivePackageMonthly[0].package_name != list.name && list.price < getActivePackageMonthly[0].price"
                class="mb-1 white--text" 
                color="orange" 
                link
                @click.native="choosePackage(list)"
                to="/overview/package-monthly/form-package">Downgrade Package</v-btn>
            </div>
            <div class="d-flex justify-center align-center my-2" v-else>
                <v-btn class="mb-1" color="secondary" @click.native="purchasePackage(list)" link to="/overview/package-monthly/form-package">Purchase</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
        <v-row v-if="lengthPage>1" class="d-flex justify-center">
          <v-col>
              <v-pagination
              v-model="page"
              :length="lengthPage"
              circle
              ></v-pagination>
          </v-col>
        </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { onMounted, ref, watch, reactive, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import { Indoformat } from "@/lib/formatter";
import { MANAGESERVICE } from './namespace'

export default {
    setup(){
       const { fetchListPackageMonthly, fetchListPackageOnetime, fetchActivePackage, fetchListSubsPackage } = useNamespacedActions(MANAGESERVICE, ["fetchListPackageMonthly", "fetchListPackageOnetime", "fetchActivePackage", "fetchListSubsPackage"])
       const { getListPackageMonthly, getActivePackageMonthly, getListOtherPackage, getTotalRows, getTotalAddons } = useNamespacedGetters(MANAGESERVICE, ["getListPackageMonthly", "getActivePackageMonthly", "getListOtherPackage", "getTotalRows", "getTotalAddons"])
       
       const activePackage = ref()
       const page = ref(1)
       const pageAddons = ref(1)
       const optionsPayload = ref({
        page: page.value,
        limit: 10
       })
       const optionsPayloadAddons = ref({
        page: page.value,
        limit: 10
       })
       const lengthPage = ref(0)
       const lengthPageAddons = ref(0)

        const choosePackage = (val) => {
            let projek = JSON.parse(localStorage.getItem('currentProj'))
            let changePackage = []
            changePackage.push({
                current_id: activePackage.value[0].id,
                current_name_package: activePackage.value[0].package_name,
                next_id: val.id,
                next_package_name: val.name,
                description: val.description,
                quota: val.quota,
                price: val.price,
                project_name: projek.name
            })
            // console.log(changePackage)
            localStorage.setItem('pilihPaket', JSON.stringify(changePackage))
        }
        const purchasePackage = (val) => {
            // console.log(val)
            let installation = val.monthly == "true" ? false : true
            let projek = JSON.parse(localStorage.getItem('currentProj'))
            let purchase = []
            purchase.push({
                project_name: projek.name,
                id_package: val.id,
                name_package: val.name,
                description: val.description,
                quota: val.quota,
                price: val.price,
                installation: installation
            })
            // console.log(purchase)
            localStorage.setItem('pilihPaket', JSON.stringify(purchase))
        }
        
        watch(page, (newVal) =>{
            // console.log(newVal)
            optionsPayload.value.page = newVal
            fetchListPackageMonthly(optionsPayload.value)
        })
        watch(pageAddons, (newVal) =>{
            // console.log(newVal)
            optionsPayloadAddons.value.page = newVal
            fetchListPackageOnetime(optionsPayloadAddons.value)
        })

        onMounted( async () => {
            let role = localStorage.getItem('role')
            await fetchListPackageMonthly(optionsPayload.value)
            await fetchListPackageOnetime(optionsPayloadAddons.value)
            if(role == 'Superadmin'){
                await fetchListSubsPackage()
            }else{
                await fetchActivePackage()
            }
            activePackage.value = getActivePackageMonthly.value
            lengthPage.value = Math.ceil(getTotalRows.value / 10)
            lengthPageAddons.value = Math.ceil(getTotalAddons.value / 10)
            // console.log(activePackage)
        })

        return{
            tab: ref(''),
            Indoformat,
            activePackage,
            fetchListPackageMonthly,
            fetchListPackageOnetime,
            fetchActivePackage,
            fetchListSubsPackage,
            choosePackage,
            purchasePackage,
            getListPackageMonthly,
            getListOtherPackage,
            getActivePackageMonthly,
            page,
            lengthPage,
            pageAddons,
            lengthPageAddons
        }
    },
    filters: {
        toRupiah(value){
            let reverse = value.toString().split('').reverse().join('')
            let ribuan 	= reverse.match(/\d{1,3}/g);
            ribuan	= ribuan.join('.').split('').reverse().join('');
            return ribuan
        },
        qoutaUn(val){
            // return val <= 20 ? val+' Tickets' : 'Unlimited'
            return val+' Tickets'
        }
    }
}
</script>