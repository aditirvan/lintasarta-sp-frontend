<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7" id="container">
            <v-row>
              <v-col cols="7">
                <div class="cluster-title d-flex align-items-center">
                  Create Cluster
                </div>
                <div class="cluster-content pt-4">
                  <!-- Load balancers distribute traffic between Instances within the
                  same datacenter. Create a load balancer, then add Instances by
                  name or by tag. -->
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="name"
                  :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">VPC Network</p>
                <v-select
                  placeholder="Choose a VPC"
                  append-icon="mdi-chevron-down"
                  :items="vpcHarbor"
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
              <v-col cols="12" md="9" style="padding-bottom: 0px;">
                <p class="font-weight-bold">Flavor</p>
                <v-slide-group
                  class="py-4 pt-0"
                  show-arrows="always"
                  mandatory
                  style="margin-bottom:-25px; margin-left:-20px;"
                >
                  <template v-slot:prev>
                    <span
                      aria-hidden="true"
                      class="v-icon notranslate v-icon--disabled theme--light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-hidden="true"
                        class="v-icon__svg"
                      >
                        <path
                          d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                        ></path>
                      </svg>
                    </span>
                  </template>
                  <template v-slot:next>
                    <span
                      aria-hidden="true"
                      class="v-icon notranslate theme--light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-hidden="true"
                        class="v-icon__svg"
                      >
                        <path
                          d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                        ></path>
                      </svg>
                    </span>
                  </template>
                  <v-col class="d-flex flex-wrap pt-0" id="SelectInstanceSize">
                    <v-card
                      v-if="listFlavorDekaHarbor.length === 0"
                      width="170"
                      height="175"
                      border-color="primary"
                      outlined
                      class="rounded-lg select-flavor mb-5"
                      style="display: flex; align-items: center;"
                      disabled
                    >
                      <v-card-text class="pb-0 text-center">
                        <p class="mb-0">There is no available flavor</p>
                      </v-card-text>
                    </v-card>

                    <v-sheet
                      v-if="listFlavorDekaHarbor.length"
                      max-width="100%"
                      class="mt-0"
                      id="col_instanceselected"
                    >
                      <v-slide-group
                        class="py-4 pt-0"
                        active-class="success"
                        show-arrows
                      >
                        <v-card
                          v-for="(item, index) in listFlavorDekaHarbor"
                          :key="'flavor-'+index"
                          @click="
                        () => {
                          flavordkh = item;
                        }
                      "
                          border-color="primary"
                          outlined
                          class="rounded-lg select-flavor"
                          :class="{
                        selected: isObjectEqual(flavordkh, item),
                      }"
                          style="margin-right: 20px; min-width: 170px"
                          :style="{
                        // border: $v.flavordkh.$errors.length ? '1px solid #eb5757 !important' : '',
                      }"
                        >
                          <v-card-text class="pb-0 text-center">
                            <p class="ma-0 pb-2">{{item.name}}</p>
                          </v-card-text>
                          <v-divider />
                          <div>
                            <v-card-text class="pb-0 text-center">
                              <p class="font-weight-bold mb-0">
                                {{ `${toIDRWithDotFormat(item.price_per_month)}/mo` }}
                              </p>
                              <p>
                                {{ `${toIDRWithDotFormat(item.price_per_hour)}/hour` }}
                              </p>
                            </v-card-text>
                            <v-divider />
                            <v-card-text
                              class="m-0 p-0 text-center"
                              style="padding: 20px"
                            >
                              <p class="fz-12 p-0" style="margin-bottom: 0">
                                <b>{{ item.vcpu }} CPU</b> / {{ item.ram }} GB
                                Memory
                                <br />
                              </p>
                              <p
                                v-if="item.outOfStock"
                                class="mb-0"
                                style="font-size: 10px"
                              >
                                Out of Stock
                              </p>
                            </v-card-text>
                          </div>
                        </v-card>
                      </v-slide-group>
                    </v-sheet>
                  </v-col>
                </v-slide-group>
                <p class="mb-2 fz-12 font-italic">* Harbor Creates 3 Node</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="7">
                <p class="font-weight-bold">Load Balancer Flavor</p>
                <v-slide-group class="py-4 pt-0" show-arrows="always" mandatory style="margin-bottom:-25px; margin-left:-20px;">
                  <template v-slot:prev>
                    <span aria-hidden="true" class="v-icon notranslate v-icon--disabled theme--light">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                      </svg>
                    </span>
                  </template>
                  <template v-slot:next>
                    <span aria-hidden="true" class="v-icon notranslate theme--light">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg">
                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                      </svg>
                    </span>
                  </template>
                  <v-col class="d-flex flex-wrap pt-0" id="SelectInstanceSize">
                <v-card
                  v-if="listFlavorLoadBalancer.length === 0"
                  width="170"
                  height="175"
                  border-color="primary"
                  outlined
                  class="rounded-lg select-flavor mb-5"
                  style="display: flex; align-items: center;"
                  disabled
                >
                  <v-card-text class="pb-0 text-center">
                    <p class="mb-0">There is no available flavor</p>
                  </v-card-text>
                </v-card>

                <v-sheet v-if="listFlavorLoadBalancer.length" max-width="100%" class="mt-0" id="col_instanceselected">
                  <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
                    <v-card
                      v-for="(item, index) in listFlavorLoadBalancer"
                      :key="'flavor-'+index"
                      @click="
                        () => {
                          flavorLB = item;
                        }
                      "
                      border-color="primary"
                      outlined
                      class="rounded-lg select-flavor"
                      :class="{
                        selected: isObjectEqual(flavorLB, item),
                      }"
                      style="margin-right: 20px; min-width: 170px"
                      :style="{
                        // border: $v.flavor.$errors.length ? '1px solid #eb5757 !important' : '',
                      }"
                    >
                      <v-card-text class="pb-0 text-center">
                        <p class="ma-0 pb-2"> {{item.name}} </p>
                      </v-card-text>
                      <v-divider />
                      <div>
                        <v-card-text class="pb-0 text-center">
                          <p class="font-weight-bold mb-0">
                            {{ `${toIDRWithDotFormat(item.price_per_month)}/mo` }}
                          </p>
                          <p>
                            {{ `${toIDRWithDotFormat(item.price_per_hour)}/hour` }}
                          </p>
                        </v-card-text>
                        <v-divider />
                        <v-card-text class="m-0 p-0 text-center" style="padding: 20px">
                          <p class="fz-12 p-0" style="margin-bottom: 0">
                            <b>{{ item.vcpu }} CPU</b> / {{ item.ram }} GB Memory
                            <br />
                          </p>
                          <p v-if="item.outOfStock" class="mb-0" style="font-size: 10px">Out of Stock</p>
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-slide-group>
                </v-sheet>
              </v-col>
                </v-slide-group>
                <!-- <v-select
                  v-model="flavorLB"
                  append-icon="mdi-chevron-down"
                  :items="getFlavorSlb"
                  :item-text="(i) => {
                    return i.vcpu + ' VPCU/' + i.ram + 'GB RAM' + ` ${i.name}`
                  }"
                  item-value="name"
                  placeholder="Choose a Flavor"
                  outlined
                  single-line
                  :error-messages="$v.flavorLB.$errors.length ? $v.flavorLB.$errors[0].$message : ''"
                ></v-select> -->
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Version</p>
                <v-select
                  placeholder="Choose Version"
                  append-icon="mdi-chevron-down"
                  :items="getVersions"
                  item-text="version"
                  item-value="version"
                  v-model="version"
                  outlined
                  single-line
                  :error-messages="$v.version.$errors.length ? $v.version.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Zone</p>
                <v-select
                  placeholder="Choose Zone"
                  append-icon="mdi-chevron-down"
                  :items="getZones"
                  item-text="name"
                  item-value="id"
                  v-model="zone"
                  outlined
                  single-line
                  :error-messages="$v.zone.$errors.length ? $v.zone.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree" label="By Creating Cluster Deka Harbor You Agree To The"> </v-checkbox>
                  <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                    >Terms of Service</span
                  >
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-btn
                  :disabled="isLoadingBtn"
                  block
                  class="accent fz-14"
                  @click="$router.go(-1)"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                  v-if="role.toLowerCase() == 'superadmin'"
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  block
                  class="secondary fz-14"
                  depressed
                  @click="create"
                >
                  Create Cluster
                </v-btn>
                <v-btn
                  v-else-if="statusCheckEula"
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  block
                  class="secondary fz-14"
                  depressed
                  @click="create"
                >
                  Create Cluster
                </v-btn>
                <v-btn
                  v-else
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn || !agree"
                  block
                  class="secondary fz-14"
                  depressed
                  @click="create"
                >
                  Create Cluster
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
import { required, requiredIf,  } from '@vuelidate/validators'
import { HARBOR, HARBORBILLING } from './namespace'
import { SLBBILLING } from '../network/slb/namespace'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { INSTANCE } from "../instance/namespace.ts"
import { isObjectEqual } from '@/lib/object'
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup(props, context) {
    const { fetchVpcHarbor, createHarbor, fetchFlavors, fetchVersion, fetchZones } = useNamespacedActions(HARBOR, ["fetchVpcHarbor", "createHarbor", "fetchFlavors", "fetchVersion", "fetchZones"])
    const { getVpcHarbor: vpcHarbor, isLoadingBtn, getFlavors, getVersions ,getZones} = useNamespacedGetters(HARBOR, ["getVpcHarbor", "isLoadingBtn", "getFlavors", "getVersions", "getZones"])
    // const { fetchFlavorSlb } = useNamespacedActions("SLB", ["fetchFlavorSlb", ])
    // const { getFlavorSlb } = useNamespacedGetters("SLB", ["getFlavorSlb"])
    const { getFlavorDekaHarbor,getFlavorLoadBalancer } = useNamespacedActions(HARBORBILLING, [
      "getFlavorDekaHarbor","getFlavorLoadBalancer"
    ]);
    const { listFlavorDekaHarbor,listFlavorLoadBalancer } = useNamespacedGetters(HARBORBILLING, [
      "listFlavorDekaHarbor","listFlavorLoadBalancer"
    ]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    // const { getFlavorSlb } = useNamespacedActions(SLBBILLING, [
    //   "getFlavorSlb",
    // ]);
    // const { listFlavorSlb } = useNamespacedGetters(SLBBILLING, [
    //   "listFlavorSlb",
    // ]);
    const role = ref(localStorage.getItem("role"));
    const userId = JSON.parse(localStorage.getItem("userId"))
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
    const region = currentProj.region

    const name = ref()
    const vpcselected = ref()
    const flavorMaster = ref()
    const flavorWorker = ref()
    const flavorLB = ref()
    const flavor = ref()
    const flavordkh = ref()
    const agree = ref(false)
    const version = ref()
    const zone = ref()

    const flavors = ref([
      {
        text: "1 VCPU/2GB RAM",
        value: "m1.small"
      },
      {
        text: "2 VCPU/4GB RAM",
        value: "m1.medium"
      },
      {
        text: "2 VCPU/8GB RAM",
        value: "m1.large"
      },
      {
        text: "4 VCPU/16GB RAM",
        value: "m1.xlarge"
      },
      {
        text: "8 VCPU/32GB RAM",
        value: "m1.2xlarge"
      },
      ])
    const flavorSlb = ref([
    {
      text: "2 VCPU/2GB RAM",
      value: "c1.medium.rc"
    },
    {
      text: "4 VCPU/4GB RAM",
      value: "c1.large.rc"
    },
    {
      text: "8 VCPU/8GB RAM",
      value: "c1.xlarge.rc"
    }
    ])
    const vpcs = ref([])


    const $v = useVuelidate(
    {
      name: {
        required,
        $autoDirty: true,
        conditional: {
          $message: "Lowercase letters and numbers only",
          $validator: (val) => {
              return /^[a-z0-9]+$/g.test(val);
          },
        },
      },
      vpcselected: { required },
      flavordkh: { required },
      // flavorWorker: { required },
      flavorLB: { required },
      version: { required },
      zone: { required },
    },
    {
      name,
      vpcselected,
      flavordkh,
      // flavorWorker,
      flavorLB,
      version,
      zone
    })

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let payload = {
        user_id: userId,
        project_id: currentProj.id,
        openstack_project_id: currentProj.openstack_project_id,
        organization_id: currentProj.organization_id,
        name: name.value,
        item_id: flavordkh.value.id,
        flv_id: flavordkh.value.flavor_id,
        flv_master: flavordkh.value.name,
        flv_worker: '',
        slb_item_id: flavorLB.value.id,
        slb_flavor_id: flavorLB.value.flavor_id,
        slb_flavor: flavorLB.value.name,
        vpc_name: vpcselected.value,
        version: version.value,
        add_item_relation: true,
        zone_id: parseInt(zone.value)
      }
      let resp = await createHarbor(payload)
      // console.log(resp)
      if(resp.status == 200){
        if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Create Cluster Deka Harbor",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload);
        }
        context.root.$router.replace("/harbor");
      }else{
        console.log(resp)
      }
    }
    onMounted(async() => {
      const params1 = new URLSearchParams();
      const paramsFlavorHarbor = new URLSearchParams();
      const paramsFlavorSlb = new URLSearchParams();
      params1.append("project_id", localStorage.getItem("projectid"));
      params1.append("form_name", "Form Create Cluster Deka Harbor");
      await checkEula(params1);
      await fetchFlavors()
      fetchVpcHarbor()
      paramsFlavorHarbor.append("service_name", "Starter Node");
      paramsFlavorHarbor.append("project_id", currentProj.id);
      paramsFlavorSlb.append("service_name", "Load Balancer");
      paramsFlavorSlb.append("project_id", currentProj.id);
      getFlavorDekaHarbor(paramsFlavorHarbor)
      getFlavorLoadBalancer(paramsFlavorSlb)
      fetchVpcHarbor()
      fetchVersion()
      fetchZones({project_id: currentProj.id})
    })
    return{
      $v,
      name,
      flavors,
      flavorSlb,
      vpcselected,
      vpcs,
      flavorMaster,
      flavorWorker,
      flavorLB,
      create,
      vpcHarbor,
      isLoadingBtn,
      agree,
      region,
      version,
      getFlavors,
      listFlavorDekaHarbor,
      listFlavorLoadBalancer,
      getVersions,
      zone,
      getZones,
      role,
      statusCheckEula,
      flavor,
      flavordkh,
      isObjectEqual,
      toIDRWithDotFormat
    }
  },
  methods: {
    async getEula() {
      const routeData = this.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Cluster Deka Harbor" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    },
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  height: 50px !important;
}

.cluster-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.cluster-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}
.selected {
  border-color: #2c94d2;
}
</style>
