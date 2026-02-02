<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-3">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7" id="container">
            <v-row>
              <v-col cols="12">
                <div class="headline font-weight-bold font--text">
                  Create NFS
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pb-0" cols="12">
                <p>
                  <span class="font-weight-bold mb-0">Select Volume Size</span>
                  <span
                  :class="{
                    'error--text': $v.selectedFlavor.$errors.length,
                  }" class="ml-2" style="font-size: 10px; position: absolute" v-if="$v.selectedFlavor.$errors.length">
                  *{{ $v.selectedFlavor.$errors[0].$message }}</span>
                  <span
                :class="{
                  'error--text': $v.customQuota.$errors.length,
                }" class="ml-2" style="font-size: 10px; position: absolute" v-if="$v.customQuota.$errors.length">
                *{{ $v.customQuota.$errors[0].$message }}</span>
                </p>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-slide-group class="py-0" active-class="success" show-arrows>
                  <v-col class="d-flex flex-row flex-wrap pb-0">
                    <v-card
                      tabindex="0"
                      min-width="140"
                      :class="{
                        bordererror: $v.selectedFlavor.$errors.length,
                        highlight: isCustomQuotaHighlighted,
                        selected: isCustomQuotaHighlighted,
                      }"
                      @click="
                        () => {
                          isCustomQuotaHighlighted = true;
                          selectedFlavor = null;
                        }
                      "
                      border-color="primary"
                      outlined
                      class="rounded-lg d-flex flex-column select-storage mb-4"
                      style="text-align: center; margin-right: 20px"
                    >
                      <v-card-text class="pb-0 pt-4 d-flex flex-column align-start m-0">
                        <!-- <div v-if="objectStorageDiscount && objectStorageDiscount > 0 && customQuota">
                          <p class="body-2 mb-0" style="text-decoration: line-through">{{ toIDRWithDotFormat(calculateCustomVolumeSize()) }}/mo</p>
                          <p class="font-weight-bold blue--text mb-1">{{ toIDRWithDotFormat(calculateCustomVolumeSize(objectStorageDiscount)) }}/mo</p>

                          <p class="body-2 mb-0" style="text-decoration: line-through">
                            {{ toIDRWithDotFormat(calculateCustomVolumeSize(undefined, "hour")) }}/hour
                          </p>
                          <p class="font-weight-bold blue--text">{{ toIDRWithDotFormat(calculateCustomVolumeSize(objectStorageDiscount, "hour")) }}/hour</p>
                        </div> -->
                        <!-- <div>
                          <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateCustomVolumeSize()) }}/mo</p>
                          <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateCustomVolumeSize(undefined, "hour")) }}/hour</p>
                        </div> -->
                      </v-card-text>
                      <!-- <v-divider /> -->
                      <v-card-text class="pa-0 mt-auto">
                          <!-- @keydown="(ev) => (customQuota = addGBText(ev, customQuota))" -->
                        <v-text-field
                          v-model="customQuota"
                          maxlength="50"
                          class="px-4 pt-2 mt-2 label-bold"
                          style="width: 140px"
                          flat
                          suffix="GB"
                          label="Enter Size"
                        ></v-text-field>
                      </v-card-text>
                    </v-card>
                        <!-- highlight: isCustomQuotaHighlighted,
                        selected: isCustomQuotaHighlighted, -->
                    <v-card 
                      v-for="flavor in flavor_list"
                      class="rounded-lg select-storage mb-4"
                      width="140" 
                      :key="flavor.id" 
                      @click="() => {
                        selectedFlavor = flavor
                        isCustomQuotaHighlighted = false
                        customQuota = null
                      }" 
                      :class="{
                        bordererror: $v.selectedFlavor.$errors.length,
                        highlight: selectedFlavor && selectedFlavor.id == flavor.id,
                        selected: selectedFlavor && selectedFlavor.id == flavor.id,
                      }"
                      border-color="primary" 
                      outlined 
                      style="text-align: center; margin-right: 20px" 
                      :style="{border: $v.selectedFlavor.$errors.length ? '1px solid #eb5757 !important' : ''}">
                        <!-- <v-card-text class="pb-0 pt-5"> -->
                          <!-- <div>
                            <p class="font-weight-bold">
                              {{ flavor.name }}
                            </p>
                          </div> -->
                          <!-- <div>
                            <p class="font-weight-bold mb-0">{{ toIDRWithDotFormat(calculateVolumeSize(flavor.month_price)) }}/mo</p>
                            <p class="font-weight-bold">{{ toIDRWithDotFormat(calculateVolumeSize(flavor.hour_price)) }}/hour</p>
                          </div>
                        </v-card-text>
                        <v-divider /> -->
                        <!-- <v-card-text class="d-flex flavor-card">
                          <p class="mb-0">{{ flavor.storage_type }}</p>
                        </v-card-text>
                        <v-divider /> -->
                        <v-card-text class="d-flex flavor-card mt-2">
                        <!-- <v-text-field
                          v-model="size"
                          class="px-4 pt-2 input-center"
                          value="0"
                          label="Enter Size in GB"
                          @keydown="(ev) => (size = addGBText(ev, size))"
                          suffix="GB"
                          flat
                        >
                        </v-text-field> -->
                        <p class="mb-0">{{ flavor.size }} GB</p>
                      </v-card-text>
                      <!-- <v-card-text class="pa-0" v-else>
                        <v-text-field disabled value="0 GB" class="px-4 pt-2 input-center" max="0" flat> </v-text-field>
                      </v-card-text> -->
                    </v-card>
                  </v-col>
                </v-slide-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="6" md="6">
                <p class="font-weight-bold">Zone</p>
                <v-select :items="zoneByProject" id="SelectRegion" outlined placeholder="Choose Zone"
                item-text="name"
                item-value="name"
                  v-model="selectedRegion"
                  :error-messages="$v.selectedRegion.$errors.length ? $v.selectedRegion.$errors[0].$message : ''"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" sm="12" md="6" class="mt-2">
                <p class="font-weight-bold">Choose a unique name</p>
                <v-text-field maxlength="50" :error-messages="createErrorMessage('name')" id="ChooseUniqueName"
                  v-model="name" outlined placeholder="Type a unique for your NFS name"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6" class="mt-2">
                <p class="font-weight-bold">Set Mounting Path</p>
                <v-text-field maxlength="50" :error-messages="createErrorMessage('path')" id="ChooseUniquePath"
                  v-model="path" outlined></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="6" sm="12" md="6" class="mt-2">
                <p class="font-weight-bold">Network Subnet</p>
                <v-text-field maxlength="50" :error-messages="createErrorMessage('networkSubnet')" id="ChooseUniqueNetworkSubnet"
                  v-model="networkSubnet" outlined placeholder="Using Valid IPv4"></v-text-field>
              </v-col>
            </v-row> -->
            <!-- <v-divider class="my-4" /> -->
            <v-row>
              <v-col sm="6" md="6" class="pb-0">
                <p class="font-weight-bold">Choose VPC</p>
                <v-select :items="vpcList" id="SelectVPC" outlined placeholder="Choose VPC"
                item-text="name"
                item-value="id"
                  v-model="selectedVPC"
                  :error-messages="$v.selectedVPC.$errors.length ? $v.selectedVPC.$errors[0].$message : ''"></v-select>
              </v-col>
              <!-- <v-col sm="6" md="6">
                <p class="font-weight-bold">Zone</p>
                <v-select :items="zoneByProject" id="SelectRegion" outlined placeholder="Choose Region"
                item-text="name"
                item-value="name"
                  v-model="selectedRegion"
                  :error-messages="$v.selectedRegion.$errors.length ? $v.selectedRegion.$errors[0].$message : ''"></v-select>
              </v-col> -->
            </v-row>

            <v-row>
              <v-col cols="12" class="py-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree">
                    <template v-slot:label>
                      <div>By Creating Instance You Agree To The</div>
                    </template>
                  </v-checkbox>

                  <button type="button" class="text-decoration-underline primary--text ml-2 fz-16" @click="getEula()">Terms of Service</button>
                </div>
              </v-col>
            </v-row>

            <!-- <div style="width: auto; height: 10px" />
            <v-divider /> -->
            <div style="width: auto; height: 10px" />
            <v-row>
              <v-col cols="6">
                <v-btn depressed block height="50" class="accent" to="/network-file-system" :disabled="isLoading">Cancel</v-btn></v-col>
              <v-col cols="6">
                <v-btn depressed id="CreateNFS" @click="create" :disabled="isLoading || !agree" block height="50" class="secondary">
                  <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                  <span v-else> Create </span>
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
  const { required, helpers, minLength, ipAddress, requiredIf, minValue } = require("@vuelidate/validators");
  import { ref, onMounted } from "@vue/composition-api";
  import { NFS } from "@/modules/network-file-system/namespace";
  import { MANAGEZONE } from "@/modules/superadmin-manageflavors/namespace";
  import { NETWORKVPC } from "@/modules/network/vpc/namespace";
  import { addGBText, removeGBText } from '@/lib/formatter';
  import { isValidIPv4 } from "@/lib/inputValidator";
  const useVuelidate = require("@vuelidate/core").default;
  import { toIDRWithDotFormat } from "@/lib/formatter";
  
  import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
  export default {
    setup(props, context) {
      const selectedFlavor = ref(null);
      const selectedRegion = ref(null);
      const selectedVPC = ref(null);
      // const networkSubnet = ref(null);
      const name = ref("");
      const path = ref("/mnt/nfs");
      const isLoading = ref(false);
      const isCustomQuotaHighlighted = ref(false);
      const size = ref(null);
      const selectedS3Flavor = ref(null);
      const customQuota = ref(null);
      const agree = ref(false)
  
      const { createNFS, fetchFlavor } = useNamespacedActions(NFS, ['createNFS', 'fetchFlavor'])
      const { flavor_list } = useNamespacedState(NFS, ['flavor_list'])

      const { fetchZoneByProject } = useNamespacedActions(MANAGEZONE, ["fetchZoneByProject"]);
      const { zoneByProject } = useNamespacedState(MANAGEZONE, ["zoneByProject"]);

      const {FETCH_VPC} = useNamespacedActions(NETWORKVPC, ["FETCH_VPC"]);
      const {vpcList} = useNamespacedState(NETWORKVPC, ["vpcList"]);
      const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));
  
      const $v = useVuelidate({
        name: {
          required,
          minLength: minLength(5),
          $autoDirty: true,
          clean: helpers.withMessage('Can only contains lowercase letters, numbers, and dash.', (val) => {
            return !val.match(/([^a-z0-9-])+/g)
          })
        },
        path:{ required},
        // networkSubnet:{ required, ipAddress },
        selectedRegion: { required },
        selectedVPC:  {required},
        customQuota: {
          minimumVal: helpers.withMessage('The minimum size allowed is 30 GB', (val) => {
            if(selectedFlavor.value === null && isCustomQuotaHighlighted.value){
              if(val < 30){
                return false
              }
              return true
            }
            return true
          })
        },
        selectedFlavor: { 
          required: requiredIf((val) => {
            return customQuota.value === null && !isCustomQuotaHighlighted.value;
          }),
         },
      }, { 
        name,
        // networkSubnet, 
        selectedFlavor, 
        selectedRegion, 
        selectedVPC, 
        path,
        customQuota
      });
  
      function createErrorMessage(element) {
        return $v.value[element].$errors.length
          ? $v.value[element].$errors[0].$message
          : "";
      }

      const calculateCustomVolumeSize = (discount = 0, unit = "month") => {
      const size = customQuota.value ? customQuota.value : 0;

      let price = 0;
      if (unit == "hour") {
        price = flavor_list.value[0].hour_price;
      } else {
        price = flavor_list.value[0].month_price;
      }

      let total = 0;
      total = price * size;

      if (discount) {
        discount = (price * size * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };

    const calculateVolumeSize = (price, discount = 0) => {
      // let price = 0
      // if (unit == "hour") {
      //   price = s3DefaultPrice.value.price_per_hours
      // } else {
      //   price = s3DefaultPrice.value.price_per_month
      // }

      let total = 0;
      total = price;

      if (discount) {
        discount = (price * discount) / 100;
        total = total - discount;
      }

      // return toIDRWithDotFormat(Math.round(total));
      return Math.round(total);
    };
  
      async function create() {
        $v.value.$touch();
        if ($v.value.$errors.length) {
          let container = document.getElementById("container");
          container.scrollIntoView({behavior: "smooth"})
          return;
        }
  
        let payload = {
          // flavor: "9e87e6fd-4b58-4316-a78e-726e952fb569",
          // custom_flavor: {
          //   size: 200
          // },
          name: name.value,
          // network_subnet: networkSubnet.value,
          project_id: currentProj.value.id,
          vpc: selectedVPC.value,
          path: path.value,
          zone: selectedRegion.value
        }
        // selectedFlavor.value ? payload.flavor = selectedFlavor.value.id : payload.custom_flavor = { size: parseInt(customQuota.value) }

        // DIBAWAH ini HARDCODE dulu
        selectedFlavor.value ? payload.custom_flavor = { size: selectedFlavor.value.size } : payload.custom_flavor = { size: parseInt(customQuota.value) }

        // console.log(payload)
        isLoading.value = true
        const response = await createNFS(payload);
        isLoading.value = false
        if (response && response.status === 201) {
          this.$router.replace("/network-file-system");
        }
      }
  
      onMounted(async () => {
        const params = { project_id: currentProj.value.id };
        await fetchZoneByProject(params);
        await fetchFlavor()
        await FETCH_VPC({page: 1, itemsPerPage: 10, type: "'Simple','Expert'"})
      });
  
      return {
        size,
        agree,
        name,
        path,
        // networkSubnet,
        selectedFlavor,
        selectedRegion,
        selectedVPC,
        flavor_list,
        zoneByProject,
        vpcList,
        isLoading,
        isCustomQuotaHighlighted,
        $v,
        selectedS3Flavor,
        addGBText,
        create,
        createErrorMessage,
        calculateCustomVolumeSize,
        calculateVolumeSize,
        customQuota,
        toIDRWithDotFormat
      };
    },
    methods: {
    async getEula() {
      const routeData = this.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Deka NFS" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    },
  }
  };
  </script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
.select-storage {
  cursor: pointer;
  &.selected {
    border-color: #2c94d2;
    .v-divider {
      border-color: #2c94d2;
    }
  }
}
.bordererror {
  border: 1px solid red;
}
</style>

