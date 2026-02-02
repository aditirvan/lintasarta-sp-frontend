<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">Resize <span style="color:red; font-size: medium;" v-if="read_only">( You have no access to resize )</span></div>
            <p>
              <b>Currently using:</b>
              {{ currentProcessor && currentProcessor.name }} / 
              {{
                instance.package_instance
                  ? instance.package_instance.flavor_name
                  : "-"
              }}
              /
              {{
                instance.package_instance ? instance.package_instance.vcpu : "-"
              }}
              vCPU /
              {{
                instance.package_instance ? instance.package_instance.ram : "-"
              }}
              GB RAM /
              {{
                instance.root_disk_package
                  ? `${instance.root_disk_package.volume_size}GB`
                  : instance.package_instance
                  ? `${instance.package_instance.root_disk}GB`
                  : "-"
              }}
              Root Disk
            </p>
            <!-- <div v-if="instance.revert_expired">
              <v-badge color="orange" content="Warning!"></v-badge>
              <v-row>
                <v-col lg="10" sm="12">
                  Please check and make sure there is no problem with your Instance after changing the flavor. 
                  <br>If there is any problem with your new flavor, you have 15 seconds to revert to your previous flavor 
                  <span v-if="instance.revert_expired">
                    until <b>{{ moment(instance.revert_expired).format('LL h:m:s') }}</b>
                  </span>
                </v-col>
                <v-col lg="2" sm="12">
                  <v-btn @click="doRevert()" depressed :disabled="isLoading" height="50" block color="error" >
                    <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
                    <span v-else>Revert</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div> -->
          </v-card-text>
          <v-card-text class="pt-0">
            <v-row>
              <v-col cols="12" md="7" class="py-0" id="col_processorSelected">
                <p class="mb-0"><b>Processor</b></p>
                <v-item-group>
                  <v-row>
                    <v-col v-for="(row, index) in listProcessor" :key="index" cols="12" md="5">
                      <v-item v-slot="{ active, toggle }">
                        <v-card
                          class="d-flex align-center rounded-lg no-shadow"
                          height="200"
                          @click="toggle"
                          :style="{ border: active ? '2px solid #1F60A8' : '2px solid #A5B3BF' }"
                          :class="{ 'error-red': $v.processor.$errors.length }"
                        >
                          <v-card-text class="ma-0 pa-0">
                            <v-img class="ma-7" :src="require(`@/assets/${row.img}`)" max-width="110" max-height="75"></v-img>
                            <p class="font-weight-bold mb-0 text-center">
                              {{ row.name }}
                            </p>
                            <v-divider :color="active ? '#1F60A8' : '#A5B3BF'" class="mt-2" :class="{ 'error-red': $v.processor.$errors.length }"></v-divider>
                            <v-card-text class="ma-0 pa-0">
                              <v-select
                                id="selectprocessor"
                                :placeholder="$v.processor.$errors.length ? '' : 'Select Processor'"
                                v-model="processor"
                                :error-messages="$v.processor.$errors.length ? $v.processor.$errors[0].$message : ''"
                                :items="row.text"
                                item-value="id"
                                item-text="name"
                                outlined
                                readonly
                                class="ma-0 pb-2 select-version"
                                @change="changeProcessor($event)"
                              >
                              </v-select>
                            </v-card-text>
                          </v-card-text>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-item-group>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-if="!read_only && processor">
            <v-tabs
              v-model="tab"
              :show-arrows="false"
              prev-icon=""
              grow
              slider-size="4"
            >
              <v-tab @change="changeType(null)">All Types</v-tab>
              <v-tab @change="changeType(x)" v-for="x in listInstanceType" :key="x.id">
                <v-container>
                  {{ x.name }}
                </v-container>
              </v-tab>
            </v-tabs>
          </v-card-text>
          <v-card-text v-if="!read_only">
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-data-table
                  hide-default-footer
                  :headers="headers"
                  :items="listInstanceSize"
                  :items-per-page="10"
                >
                  <template v-slot:no-data>
                    {{ isLoading ? "Loading.." : "No data available" }}
                  </template>
                  <template v-slot:item.type="{ item }">
                    <div class="d-flex">
                      <v-radio-group hide-details v-model="selectedtype">
                        <v-radio
                          :value="item"
                          :disabled="item.outOfStock"
                          :class="{ 'disabled-flavor': item.outOfStock }"
                        ></v-radio>
                      </v-radio-group>
                      <div style="padding-top: 1px">
                        <span>{{ item.flavor_type_name }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.price="{ item }">
                    <div v-if="item.discount">
                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{
                          `${toIDRWithDotFormat(item.price_per_month)}`
                        }}/month
                      </p>
                      <p class="font-weight-bold blue--text mb-0">
                        {{
                          `${toIDRWithDotFormat(item.price_per_month)}`
                        }}/month
                      </p>
                    </div>
                    <div v-else>
                      <p class="mb-0">
                        {{
                          `${toIDRWithDotFormat(item.price_per_month)}`
                        }}/month
                      </p>
                    </div>

                    <div v-if="item.discount">
                      <p class="body-2 mb-0" style="text-decoration: line-through">
                        {{
                          `${toIDRWithDotFormat(item.price_per_hour)}`
                        }}/hour
                      </p>
                      <p class="font-weight-bold blue--text mb-0">
                        {{
                          `${toIDRWithDotFormat(item.price_per_hour)}`
                        }}/hour
                      </p>
                    </div>
                    <div v-else>
                      <p class="mb-0">
                        {{
                          `${toIDRWithDotFormat(item.price_per_hour)}`
                        }}/hour
                      </p>
                    </div>
                  </template>
                  <template v-slot:item.name="{ item }">
                    <span>{{ item.name }}</span>
                  </template>
                  <template v-slot:item.vcpu="{ item }">
                    <span>{{ item.vcpu }} vCPU</span>
                  </template>
                  <template v-slot:item.gpu="{ item }">
                    <span>{{ item.gpu ? item.gpu : "-" }}</span>
                  </template>
                  <template v-slot:item.ram="{ item }">
                    <span>{{ item.ram }} GB</span>
                  </template>
                  <template v-slot:item.root_disk="{ item }">
                    <span>{{ item.root_disk }} GB</span>
                  </template>
                  <template
                    v-if="listInstanceSize.length > 5"
                    v-slot:footer="{ props }"
                  >
                    <custom-footer-datatable :props="props" />
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item v-for="x in listInstanceType" :key="x.id">
                <v-data-table
                  hide-default-footer
                  :headers="headers"
                  :items="
                    listInstanceSize.filter(
                      (flavor) =>
                        flavor.flavor_type_id === x.id
                    )
                  "
                  :items-per-page="10"
                >
                  <template v-slot:no-data>
                    {{ isLoading ? "Loading.." : "No data available" }}
                  </template>
                  <template v-slot:item.type="{ item }">
                    <div class="d-flex">
                      <v-radio-group hide-details v-model="selectedtype">
                        <v-radio
                          :value="item"
                          :disabled="item.outOfStock"
                          :class="{ 'disabled-flavor': item.outOfStock }"
                        ></v-radio>
                      </v-radio-group>
                      <div style="padding-top: 1px">
                        <span>{{ item.flavor_type_name }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.name="{ item }">
                    <span>{{ item.name }}</span>
                  </template>
                  <template v-slot:item.vcpu="{ item }">
                    <span>{{ item.vcpu }} vCPU</span>
                  </template>
                  <template v-slot:item.gpu="{ item }">
                    <span>{{ item.gpu ? item.gpu : "-" }}</span>
                  </template>
                  <template v-slot:item.ram="{ item }">
                    <span>{{ item.ram }} GB</span>
                  </template>
                  <template v-slot:item.root_disk="{ item }">
                    <span>{{ item.root_disk }} GB</span>
                  </template>
                  <template v-slot:item.price="{ item }">
                    <div>
                      <p class="mb-0">
                        {{ toIDRWithDotFormat(item.price_per_month) }}/month
                      </p>
                      <p>{{ toIDRWithDotFormat(item.price_per_hour) }}/hour</p>
                    </div>
                  </template>
                  <template
                    v-if="listInstanceSize.length > 5"
                    v-slot:footer="{ props }"
                  >
                    <custom-footer-datatable :props="props" />
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
          <v-card-text>
            <v-btn
              v-if="!read_only"
              @click="
                () => {
                  validateprivilages(['Instance', 'editor']).then(() => {
                    user.role.toLowerCase() !== 'superadmin' ? displayInstanceDialog() : doResize();
                  });
                }
              "
              depressed
              :disabled="
                isLoading ||
                !selectedtype ||
                !validateprivilages(['Instance', 'editor']) ||
                !listInstanceSize.length
              "
              height="50"
              block
              color="secondary"
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                :color="'white'"
                :size="'10px'"
                class="mr-2"
              ></beat-loader>
              <span v-else style="font-size: 14px">Resize</span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog resize instance -->
    <dialogNewServiceAvailability
      v-if="instanceDialog" 
      :onClose="() => {instanceDialog = false}"
      serviceName="Instance"
      actionName="Resize Instance"
      :onAvailable="doResize"
    />
  </v-container>
</template>
<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import useResize from "./useResize";
import { toIDRWithDotFormat } from "@/lib/formatter";
import moment from "moment";
import { useFlavor } from "../../superadmin-manageflavors/useflavor";
import { MANAGEVOUCHER } from "../../superadmin-managevoucher/namespace";
import { INSTANCE } from "../namespace";
import localstorage from "@/lib/localstorage";
import { AccessControl } from "@/lib/middleware";
import { VoucherDiscountDetailType } from "../../superadmin-managevoucher/type";
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators'
import libProject from "@/lib/project";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";

export default {
  components: {
    dialogNewServiceAvailability,
  },
  props: ["instance"],
  setup(props, context) {
    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchVoucherDiscountByProjectID",
    ]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, [
      "voucherDiscountProject",
    ]);

    const projJson = localstorage.getItem("currentProj");
    const projObj =  projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Instance'));
    const { instanceid } = context.root._route.params;
    const tab = ref("");
    const selectedtype = ref("");
    const instanceDialog = ref(false)
    let regionName = props.instance.region;
    const processor = ref();
    const currentProcessor = ref()

    const $v = useVuelidate(
      {
        processor: { required }
      },
      {
        processor
      })

    watch(props.instance, (val) => {
      regionName = props.instance.region;
    });

    // const {
    //   defaultcpu,
    //   defaultram,
    //   defaultdisk,
    //   defaultgpu,
    //   fetchS3DefaultPrice,
    // } = useFlavor();

    const {
      // fetchMasterInstances,
      // masterInstances,
      // fetchType,
      // type,
      resize,
      revert,
      isLoading,
      region,
      regions,
      fetchRegions,
    } = useResize();

    const filteredFlavors = ref([]);
    // filteredFlavors.value = masterInstances.value.filter(flavor =>
    //   flavor.id !== props.instance.package_instance_id
    // )

    const {
      getListInstanceSize,
      getListInstanceType,
      getProcessorType,
    } = useNamespacedActions(INSTANCE, [
      "getListInstanceSize",
      "getListInstanceType",
      "getProcessorType"
    ]);
    const {
      listInstanceSize,
      listInstanceType,
      listProcessorType,
    } = useNamespacedGetters(INSTANCE, [
      "listInstanceSize",
      "listInstanceType",
      "listProcessorType"
    ]);

    const {checkAvailability} = useNewServiceAvailability()

    const typePlan = ref(null)
    const changeType = (event) => {
      const params = new URLSearchParams();
      params.append("project_id", projObj.id);
      params.append("processor_id", processor.value);
      if(event != null){
        typePlan.value = event.id
        params.append("type_id", event.id)
      }else{
        typePlan.value = null
      }
      getListInstanceSize(params);
    };

    const changeProcessor = (event) => {
      const params = new URLSearchParams();
      params.append("project_id", projObj.id);
      params.append("processor_id", event);
      typePlan.value != null ? params.append("type_id", typePlan.value) : ''
      getListInstanceSize(params);
    };

    const listProcessor = ref([])
    onMounted(async () => {
      // console.log(props.instance)
      const activeProjectID = await libProject.getActiveProjectID();
      const params = new URLSearchParams();
      params.append("project_id", activeProjectID); 

      await getProcessorType(params);

      let b
      let a = listProcessorType.value.filter((x) => x.text.some((y) => y.value == props.instance.package_instance.processor))
      a[0].text.map((x) => {
        if(x.value == props.instance.package_instance.processor){
          b = x
        }
        return b
      })
      listProcessor.value = a
      processor.value = b.id
      currentProcessor.value = b

      // await fetchS3DefaultPrice();
      await fetchRegions();
      // await fetchType();
      // await fetchMasterInstances({
      //   region: regionName,
      //   limit: -1,
      // });
      // const paramsSizeInstance = new URLSearchParams();
      // paramsSizeInstance.append("processor_id", processor.value);
      // paramsSizeInstance.append("type_id", event);

      await getListInstanceType();

      const paramsSize = new URLSearchParams();
      paramsSize.append("project_id", projObj.id);
      paramsSize.append("processor_id", processor.value);
      await getListInstanceSize(paramsSize);

      const thisRegion = regions.value.filter((x) => x.name == regionName)[0];
      listInstanceSize.value = listInstanceSize.value
        // .filter((x) => {
        //   if (x.status == "active") {
        //     if (x.usage_limit == -1 || x.usage < x.usage_limit) return true; //check flavor limit (unused)
        //     return false;
        //   }
        //   return false;
        // })
        // .filter((flavor) => flavor.id != props.instance.package_instance_id)
        .sort((a, b) => (a.ram > b.ram ? -1 : 1))
        .sort((a, b) => (a.vcpu > b.vcpu ? 1 : -1))
        .map((x) => {
          if (region.value) {
            if (
              x.vcpu <= thisRegion.cpu_limit - thisRegion.cpu_usage &&
              x.ram <= thisRegion.ram_limit - thisRegion.ram_usage
            )
              return { ...x, outOfStock: false };
            else return { ...x, outOfStock: true };
          }
          return x;
        });

      await fetchVoucherDiscountByProjectID(projObj.id)
      const voucherDiscount = voucherDiscountProject.value
      if (voucherDiscount) {
        listInstanceSize.value = listInstanceSize.value.map(flavor => {
          if(voucherDiscount.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED) {
            const instanceBaseDisc = voucherDiscount.voucher_discount_detail.instance_based
            let discount = instanceBaseDisc ? instanceBaseDisc : 0
            return {
              ...flavor,
              discount: discount,
            }
          } else {
            const discountFlavors = voucherDiscount.voucher_discount_detail.instance_flavors
            let discount = 0
            if (discountFlavors && discountFlavors.length) {
              const flavors = discountFlavors.filter(flavorDisc => flavor.flavor_ids.include(flavorDisc.package_instance_id))
              if (flavors && flavors.length) {
                discount = flavors[0].discount
              }
            }
            return {
              ...flavor,
              discount: discount,
            }
          }
        })
      }
    });


    const doResize = async () => {
      const payload = {
        instance_id: instanceid,
        item_id: selectedtype.value.id,
        region: regionName,
      };
      await resize(payload);
      selectedtype.value = null;
    };

    const displayInstanceDialog = async () => {
      await checkAvailability(
        {
          by: "item", 
          item: {
            service_name: 'INSTANCE', 
            id: selectedtype.value.id,
          }
        }
      )

      instanceDialog.value = true;
    }

    const doRevert = async () => {
      const payload = {
        instance_id: instanceid,
      };
      await revert(payload);
    };

    const { validateprivilages, validateprivilagesync } = useNamespacedActions(
      "HOMEPAGE",
      ["validateprivilages", "validateprivilagesync"]
    );

    return {
      headers: [
        {
          text: "Type",
          value: "type",
          sortable: false,
        },
        {
          text: "Flavor Name",
          value: "name",
          sortable: false,
        },
        {
          text: "Price",
          value: "price",
          sortable: false,
        },
        {
          text: "vCPU",
          value: "vcpu",
          sortable: false,
        },
        {
          text: "RAM",
          value: "ram",
          sortable: false,
        },
        {
          text: "GPU",
          value: "gpu",
          sortable: false,
        },
        // {
        //   text: "Root Disk",
        //   value: "root_disk",
        //   sortable: false,
        // },
      ],
      read_only,

      // filteredFlavors,
      toIDRWithDotFormat,
      // masterInstances,
      tab,
      // type,
      listInstanceSize,
      listInstanceType,
      selectedtype,
      validateprivilages,
      validateprivilagesync,
      doResize,
      isLoading,
      moment,
      doRevert,
      // defaultcpu,
      // defaultram,
      // defaultdisk,
      // defaultgpu,
      processor,
      $v,
      listProcessorType,
      listProcessor,
      currentProcessor,
      changeType,
      changeProcessor,
      instanceDialog,
      displayInstanceDialog,
    };
  },
  computed: {
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  },
};
</script>
<style>
.disabled-flavor circle {
  stroke: #cdcdcd;
}
</style>
<style scoped lang="scss">
.v-tabs {
  ::v-deep .v-slide-group__prev {
    display: none !important;
  }
}

.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
.accent--text {
  font-size: 12px;
}
.v-tab {
  padding-left: 5px;
  padding-right: 5px;
}
.v-input--radio-group {
  margin: 0;
  padding: 0;
}
.select-version.v-text-field--outlined {
  ::v-deep fieldset {
    border-color: transparent;
    color: #2c94d2;
  }
}
.v-application .select-version .v-menu__content {
  border-radius: 15px 15px 50px 50px;
}
.no-shadow {
  box-shadow: none !important;
}
</style>
