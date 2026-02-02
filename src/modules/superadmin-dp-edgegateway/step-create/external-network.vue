<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">External Networks</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row class="">
            <v-col>
              <v-data-table
              :headers="headers"
              :items="listEksternalNetwork"
              :items-per-page="10"
              :server-items-length="TotalRowsEksternalNetwork"
              :loading="isLoading"
              item-key="id"
              class="elevation-0 scroll"
              hide-default-footer
              v-model="value.networkRow"
              show-select
              >
              <!-- v-model="parentCheck"
              show-select
              show-expand -->
              <!-- v-model="selectedSubnet.networkRow" -->
                <template v-slot:header.data-table-select="{ header }">
                </template>

                <!-- <template v-slot:item.data-table-select="{ isSelected, select, item }"> -->
                  <!-- @click="selectedRow(item, isSelected)" -->
                  <!-- <input type="checkbox"
                  :aria-checked="false"
                  @change="($event) => { 
                    selectedRow(item, isSelected)
                  }"
                  v-model="parentCheck"
                  :id="item"
                  :value="item" 
                  style="margin-top: -5px;"
                  /> -->

                  <!-- <v-checkbox
                  v-if="isSelected && parentCheck.find((x) => x.id == item.id)"
                  :value="item.id"
                  :id="item.id"
                  @change="($event) => { 
                    selectedRow(item, isSelected)
                  }"
                  color="primary"
                  hide-details
                  style="margin-top: -5px;"
                  :label="`${isSelected}`"
                  />

                  <v-checkbox
                  v-else
                  :value="item.id"
                  :id="item.id"
                  @change="($event) => { 
                    selectedRow(item, isSelected)
                  }"
                  hide-details
                  style="margin-top: -5px;"
                  aria-checked="false"
                  :label="`${isSelected} else`"
                  /> -->
                  
                  <!-- @click="() => {
                    selectedRow(item, 'true')
                  }" -->
                  <!-- <v-checkbox
                  v-if="isSelected"
                  :value="isSelected"
                  @change="select($event)"
                  @click="() => {
                    selectedRow(item, 'true')
                  }"
                  color="primary"
                  hide-details
                  style="margin-top: -5px;"
                  :label="`${isSelected}`"
                  />

                  <v-checkbox
                  v-else-if="!isSelected"
                  :value="!isSelected"
                  @change="select($event)"
                  @click="() => { 
                    selectedRow(item, 'false')
                  }"
                  color="primary"
                  hide-details
                  style="margin-top: -5px;"
                  :label="`${isSelected}`"
                  /> -->
                <!-- </template> -->

                <!-- <template v-slot:expanded-item="{ headers, item }">
                  <td></td>
                  <td :colspan="headers.length - 1" class="py-0">
                    <!-- v-model="selectedSubnet.subnets" 
                    <v-checkbox
                    v-model="childCheck"
                    @change="($event) => {
                      subnetClick(subnet)
                    }"
                    v-for="(subnet, key) in item.subnets"
                    :key="key"
                    class="pl-8 my-2"
                    :value="subnet"
                    :label="`${subnet.gateway}/${subnet.prefixLength}`"
                    hide-details
                    ></v-checkbox>
                  </td>
                </template> -->

                <template v-slot:item.subnets="{ item }">
                  <div  v-for="sub in item.subnets" :key="sub.gateway">

                    <!-- @change="($event) => {
                      subnetClick(sub)
                    }" -->
                    <v-checkbox
                    multiple
                    v-if="selectedSubnet.networkRow.find((x) => x.id == item.id)"
                    class=" my-2 fz-12"
                    v-model="value.subnets"
                    :value="sub"
                    :label="`${sub.gateway}/${sub.prefixLength}`"
                    hide-details
                    ></v-checkbox>

                     <p v-else class="my-0"> {{ sub.gateway }} </p> 
                  </div>
                </template>

                <template v-slot:item.ip_usage="{ item }">
                  {{ Math.floor(((item.usedIpCount/item.totalIpCount)*100)) }}% {{ `(Total: ${item.totalIpCount})` }}
                </template>

                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      changePage(val)
                    }
                  "
                  :props="props" />
                </template>
              </v-data-table>
              <!-- <p class="font-italic red--text" v-if="subnetsError">Please choose the subnets</p> -->
              <p class="font-italic red--text" v-if="$v.rule.subnets.$errors.length">Please choose the subnets</p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from '@/modules/superadmin-dp-orgVdc/namespace';
import useVuelidate from '@vuelidate/core';
import { required, minValue, helpers  } from '@vuelidate/validators'

export default {
  props: ["value", "step", "provider"],
  setup(props, context) {
    const { fetchEksternalNetwork } = useNamespacedActions(ORGVDC, ["fetchEksternalNetwork"])
    const { isLoading, listEksternalNetwork, TotalRowsEksternalNetwork } = useNamespacedGetters(ORGVDC, ["isLoading", "listEksternalNetwork", "TotalRowsEksternalNetwork"])

    onMounted(async() => {
      // console.log(props)
      let href = props.provider?.href
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // console.log(splitHref)
      providerId.value = splitHref[4]
      options.value = { ...options.value, providerId: providerId.value }

      await fetchEksternalNetwork(options.value)
      // console.log(listEksternalNetwork.value)
      // networkMap.value = listEksternalNetwork.value.map((el1) => {
      //   return {
      //     ...el1,
      //     subnets: el1.subnets.values.map((el2) =>  { 
      //       return { 
      //         ...el2,
      //         idNetwork: el1.id,
      //         rowNetwork: el1
      //         }
      //       }
      //     )
      //   }
      // })
      // console.log(networkMap.value)
    })
    
    const parentCheck = ref([])
    const childCheck = ref([])
    const networkMap = ref()
    const selectedSubnet = computed({
      get: () => {
        return props.value
      },
      set: (val) => {
        context.emit("input", val);
      },
    })

    const headers = ref([
      // { text: '', value: 'data-table-expand' },
      { text: "", value: "data-table-select", sortable: false },
      { text: "External Network/Subnet", value: "name", sortable: false },
      { text: "IP Pool Usage", value: "ip_usage", sortable: false },
      { text: "Subnets", value: "subnets", sortable: false },

    ])
    const dummyOrg = ref([
      {id: 1, externalNetwork: 'Jihan', ip_usage: 'Jihan Lugas', },
    ])

    const providerId = ref()
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      type: 'createEdgeExNetwork',
      // providerId: props.provider
    })

    const $v = useVuelidate(
      {
        rule: {
          subnets: {
            $autoDirty: true,
            confirm: helpers.withMessage(
              "Please choose the subnets",
              val => { 
                let valid = true
                if(!props.value.subnets.length){
                  valid = false
                }
                return valid
              }
            ) 
          },
        }
      },
      {
        rule: props.value,
      })

    const changePage = async(val) => {
      // console.log(val)
      let newVal = { ...val, providerId: providerId.value, type: 'createEdgeExNetwork' }
      await fetchEksternalNetwork(newVal)
      // console.log(listEksternalNetwork.value)

      // networkMap.value = listEksternalNetwork.value.map((el1) => {
      //   return {
      //     ...el1,
      //     subnets: el1.subnets.values.map((el2) =>  { 
      //       return { 
      //         ...el2,
      //         idNetwork: el1.id,
      //         rowNetwork: el1,
      //         totalSubnets: el1.subnets.values.length
      //         }
      //       }
      //     )
      //   }
      // })
      // console.log(networkMap.value)
    }

    const networkIds = ref([])
    const parentLength = ref(0)
    const selectedRow = (event, isTrue) => {
      
      // console.log(event)
      // console.log(isTrue)
      if(!isTrue){
        parentCheck.value.push(event)
        event.subnets.forEach( el => {
          childCheck.value.push(el)
        });
        parentLength.value = parentCheck.value.length
      }else{
        parentCheck.value = parentCheck.value.filter((x) => {
          return x.id != event.id
        })
        let a = []
        parentCheck.value.forEach((x) => {
          childCheck.value.filter((y) => {
            if(x.id == y.idNetwork) {
              a.push(y)
            }
          })
        })
        childCheck.value = a
        // console.log(a)
        // console.log(parentCheck.value.filter((x) => {
        //   return x.id != event.id
        // }))
        // console.log(parentLength.value)
        // console.log(parentCheck.value.length)
        // console.log(parentCheck.value)
        // console.log(childCheck.value.filter((x) => {
        //   console.log(x)
        //   parentCheck.value.forEach((y) => {
        //     return !y.subnets.some((z) => {
        //       console.log(z)
        //       return z.idNetwork == x.idNetwork
        //     })
            
        //   })
        // })
        // )
      }
      // childCheck.value.push(event.subnets)
      // selectedSubnet.value.networkRow.push(event)
      // console.log(selectedSubnet.value.subnets)
      // if(!isTrue){
        // selectedSubnet.value.subnets.push(event.subnets.values)
      // }
      // if(!selectedSubnet.value.subnets.length){
      //   selectedSubnet.value.subnets = event.subnets.values
      // }else{
      //   console.log(networkIds.value.includes(event.id))
      //   if(!networkIds.value.includes(event.id)){
      //     selectedSubnet.value.subnets
      //   }
      //   // if(networkIds.value.includes(event.id)){
      //   //   console.log(networkIds.value.findIndex(event.id))
      //   // }else{
      //   //   console.log('else')
      //   // }
      //   // selectedSubnet.value.subnets = []
      // }
      // console.log(selectedSubnet.value)
      // console.log(networkIds.value)
    }
    const subnetClick = (subnet) => {
      // console.log(subnet)
      // console.log(childCheck.value)
      let a = []
      childCheck.value.forEach((x) => {
        a.push(x.rowNetwork)
      })
      selectedSubnet.value.networkRow = a
      // console.log(selectedSubnet.value)
      // let subnetRowLength = data.subnets.values.length
      // // if(selectedSubnet.value.subnets.length){
      //   if(subnetRowLength == 1){
      //     networkIds.value.push(data.id)
      //   }else{
      //     if(selectedSubnet.value.subnets.length){
      //       selectedSubnet.value.subnets.forEach((x, i) => {
      //         // console.log(x)
      //         data.subnets.values.forEach((e) => {
      //           if(e.gateway == x.gateway){
      //             console.log(i)
      //           }
      //         })
      //       })    
      //     }
      //     // console.log(data.subnets.values.forEach(element => {
      //     //   selectedSubnet.value.subnets.filter((x) => x.gateway == element.gateway)
      //     // })) 
      //   }
        // if(subnetRowLength == selectedSubnet.value.subnets.length){
        //   networkIds.value.push(data.id)
        // }
        // if(!networkIds.value.includes(data.id)){
        //   networkIds.value.push(data.id)
        // }
        
      // }
      // console.log(networkIds.value)
    }

    const checkInterminate = (item) => {

    }

    const subnetsError = ref(false)
    const next = () => {
      // console.log(props.value)
      $v.value.$touch();
      // console.log($v.value)
      if ($v.value.$errors.length) return

      let mapSubnet = props.value.networkRow.map((el1) => {
        return {
          ...el1,
          subnets: el1.subnets.filter((x) => {
            return props.value.subnets.some((y) => {
              return x.gateway == y.gateway
            })
          })
        }
      })
      // console.log(mapSubnet)
      let mapNetwork = mapSubnet.filter((x) => x.subnets.length)
      // if(!mapNetwork.length){
      //   subnetsError.value = true
      //   return
      // }
      // console.log(mapNetwork)
      context.emit('filterNetwork', mapNetwork)
      
      // $v.value.$touch();
      // if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    
    return{
      prev,
      next,
      headers,
      dummyOrg,
      isLoading,
      listEksternalNetwork,
      TotalRowsEksternalNetwork,
      changePage,
      selectedRow,
      checkInterminate,
      selectedSubnet,
      networkIds,
      subnetClick,
      networkMap,
      parentCheck,
      childCheck,
      subnetsError,
      $v,
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
}
</style>