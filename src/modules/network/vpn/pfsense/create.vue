<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="psk-title d-flex align-items-center">
                    Create VPN
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="name"
                  :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Volume</p>
                <v-text-field
                  placeholder=""
                  single-line
                  outlined
                  v-model.number="volume"
									type="number"
                ></v-text-field>
              </v-col>
            </v-row> -->

            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Flavor</p>
                <v-select
                  v-model="flavor"
                  append-icon="mdi-chevron-down"
                  :items="flavors"
                  placeholder="Choose a Flavor"
                  outlined
                  single-line
                  :error-messages="$v.flavor.$errors.length ? $v.flavor.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">VPC Network</p>
                <v-select
                  placeholder="Choose a VPC"
                  append-icon="mdi-chevron-down"
                  :items="vpcDisabled"
                  item-text="name"
                  item-value="name"
                  v-model="vpcselected"
                  outlined
                  single-line
                  :error-messages="$v.vpcselected.$errors.length ? $v.vpcselected.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree" label="By Creating VPN You Agree To The"> </v-checkbox>
                  <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                    >Terms of Service</span
                  >
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="3">
                <v-btn
                  block
                  class="accent fz-14"
                  :disabled="isLoadingBtn"
                  @click="$router.go(-1)"
                  height="45"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  v-if="role.toLowerCase() == 'superadmin'"
                  block
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  class="secondary fz-14"
                  @click="create"
                  height="45"
                >
                  <span>Create VPN</span>
                </v-btn>
                <v-btn
                  v-else-if="statusCheckEula"
                  block
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  class="secondary fz-14"
                  @click="create"
                  height="45"
                >
                  <span>Create VPN</span>
                </v-btn>
                <v-btn
                  v-else
                  block
                  class="secondary fz-14"
                  depressed
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn || !agree"
                  @click="create"
                  height="45"
                >
                  Create VPN
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required, numeric, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from '@/modules/network/vpc/namespace'
import { VPN } from "../namespace"
import INSTANCE from '@/modules/instance/namespace';

export default {
  setup(props, context) {
    const { fetchvpcs } = useNamespacedActions(NETWORKVPC, ['fetchvpcs'])
    const { vpcs } = useNamespacedState(NETWORKVPC, ['vpcs'])
    const { createPfsense, fetchPfsense  } = useNamespacedActions(VPN, ["createPfsense", "fetchPfsense"])
    const { isLoadingBtn, getListPfsense, getTotalRowsPfsense } = useNamespacedGetters(VPN, ["isLoadingBtn", "getListPfsense", "getTotalRowsPfsense"])
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);
    
    const name = ref('')
    const volume = ref('')
    const flavor = ref('')
    const vpcselected = ref(null)
    const flavors = ref([
      // {
      //   text: "2 VCPU/2GB RAM", 
      //   value: "c1.medium"
      // },
      {
        text: "4 VCPU/4GB RAM",
        value: "c1.large"
      },
      // {
      //   text: "8 VCPU/8GB RAM",
      //   value: "c1.xlarge"
      // }
      ])

      const $v = useVuelidate(
      {
        name: {
          required,
          $autoDirty: true,
          conditional: {
            $message: "Special character is not allowed",
            $validator: (val) => {
              return /^[A-Za-z0-9/\s/g\-]+$/g.test(val);
            },
          }, 
        },
        vpcselected: { required }
				// volume: { required, numeric },
        // flavor: { required },
      },
      {
        name,
        vpcselected
				// volume,
        // flavor,
      })

      const create = async() => {
        $v.value.$touch();
        if ($v.value.$errors.length) return;

        let project = currentProj.openstack_project_id
        let userId = JSON.parse(localStorage.getItem("userId"))
        let payload = {
          // flavor_name: flavor.value,
          instance_name: name.value,
          openstack_project: project,
          existing_vpc: vpcselected.value,
          user_id: userId,
          org_id: currentProj.organization_id,
          project_id: currentProj.id
        }
        // console.log(payload)
        let resp = await createPfsense(payload)
        if(resp.status == 200){
          if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
            const payload = {
              form_name: "Form Create VPN",
              project_id: localStorage.getItem("projectid"),
            };
            validateEula(payload)
          }
          context.root.$router.replace("/network/vpn");
        }else{
          console.log(resp)
        }
      }
      const vpcDisabled = ref()
      onMounted(async()=>{
        const params1 = new URLSearchParams();
        params1.append("project_id", localStorage.getItem("projectid"));
        params1.append("form_name", "Form Create VPN");
        checkEula(params1);
        await fetchvpcs()
        await fetchPfsense({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          projek: currentProj.openstack_project_id
        })
        // vpcDisabled.value = vpcs.value.map(
        //   item =>{
        //     return {
        //       ...item,
        //       disabled: getListPfsense.value.some(pf => pf.existing_vpc_name == item.name)
        //     }
        //   })
        // console.log(vpcs.value)
        if(getListPfsense.value.length){
          vpcDisabled.value = vpcs.value.filter( pf => {
          return !getListPfsense.value.some(a => a.existing_vpc_name == pf.name && a.status != 'FAILED')
        })
          // getListPfsense.value.forEach( pf => {
          //   vpcDisabled.value = vpcs.value.filter(a => a.name != pf.existing_vpc_name)
          // })
        }else{
          vpcDisabled.value = vpcs.value
        }
      })

      const getEula = () => {
        const routeData = context.root.$router.resolve({
          name: "eulaContent",
          query: { form_name: "Form Create VPN" },
          path: "/eula-content",
        });
        window.open(routeData.href, "_blank");
      };

    return{
			volume,
      name,
			flavor,
			flavors,
      vpcselected,
      vpcs,
			$v,
      create,
      isLoadingBtn,
      vpcDisabled,
      getEula,
      role,
      agree,
      statusCheckEula,
    }
  },
}
</script>

<style scoped>
.psk-title{
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 140%;
    color: #556272;
}
</style>
