<template>
  <div>
    <v-card flat class="pa-7 rounded-0 rounded-b-lg">
      <v-card outlined flat class="px-7 rounded-lg">
        <v-row v-if="!floatingips.length">
          <v-card-text class="text-center px-13" style="padding-top: 35px">
            <p
              style="font-size: 16px; text-transform: capitalize"
              class="font-weight-bold mb-0"
            >
              Looks like you have no floating IPs.
            </p>
            <v-row>
              <v-col>
                <p class="mb-0 px-13" style="font-size: 15px; color: #a5b3bf">
                  A floating IP is a static IP address that points to one of your Instance. It allows you to redirect network traffic to any of your Instance in
                  the same datacenter.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-row>
        <v-row v-if="!read_only">
          <v-col v-if="isDevModeFloatingIP && !isPrepaid" cols="4">
            <p><b>Floating IP Type</b></p>
            <v-select
              id="floatingIpType"
              placeholder="Choose Floating IP Type"
              v-model="selectedFloatingIpType"
              :items="listFloatingIp"
              item-text="type"
              item-value="id"
              @change="changeType($event)"
              outlined
              :error-messages="$v.selectedFloatingIpType.$errors.length ? $v.selectedFloatingIpType.$errors[0].$message : ''"
            />
            <div v-if="Object.keys(dataFloatingType).length != 0" class="primary--text">
              <p
                v-if="floatingIpDiscount && floatingIpDiscount > 0"
                class="body-2 primary--text"
              >
                *{{ dataFloatingType.type }}
                Price
                <span style="text-decoration: line-through">RP {{ floatingIpPrice.toLocaleString("id-ID") }}/month</span>
                <span class="body-2 font-weight-bold ml-1">RP {{ (floatingIpPrice - (floatingIpPrice * floatingIpDiscount / 100)).toLocaleString("id-ID") }}/month</span>
              </p>
              <p v-else>
                *{{ dataFloatingType.type }} Price {{ toIDRWithDotFormat(dataFloatingType.price_per_month) }}/month
                <!-- {{ floatingIpPrice.toLocaleString("id-ID") }}/month  -->
              </p>
            </div>
          </v-col>

          <v-col cols="4">
            <p><b>Billing Type</b></p>
            <v-select
              id="billingType"
              placeholder="Choose Instance Billing Type"
              v-model="selectedBillingType"
              :items="billingTypes"
              outlined
              :error-messages="$v.selectedBillingType.$errors.length ? $v.selectedBillingType.$errors[0].$message : ''"
            ></v-select>
          </v-col>

          <v-col cols="4" v-if="selectedBillingType == 'Trial'">
            <p><b>Trial Voucher</b></p>
            <v-select
              id="trialVoucher"
              placeholder="Choose trial voucher to use"
              v-model="selectedTrialVoucher"
              :error-messages="
                $v.selectedTrialVoucher.$errors.length
                  ? $v.selectedTrialVoucher.$errors[0].$message
                  : ''
              "
              :items="vouchers"
              item-value="id"
              outlined
            >
              <template v-slot:selection="{ item }">
                {{ item.name }} - {{ item.code }}
              </template>
              <template v-slot:item="{ item }">
                {{ item.name }} - {{ item.code }}
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row v-if="!read_only">
          <v-col cols="4" class="pt-0">
            <p><b>Resource Type</b></p>
            <v-select
              class="mt-2"
              placeholder="Resource Type"
              single-line
              outlined
              v-model="resourceType"
              :items="resourceTypes"
              :error-messages="
                $v.resourceType.$errors.length
                  ? $v.resourceType.$errors[0].$message
                  : ''
              "
            >
            </v-select>
          </v-col>

          <v-col cols="4" class="pt-0">
            <p><b>Resource</b></p>
            <v-autocomplete
              class="mt-2"
              :placeholder="`Search for ${
                resourceType == 'Instance' ? 'an Instance' : 'a Load Balancer'
              }`"
              single-line
              outlined
              :filled="!resourceType"
              :disabled="!resourceType"
              v-model="resourceSelected"
              :items="resources"
              :error-messages="
                $v.resourceSelected.$errors.length
                  ? $v.resourceSelected.$errors[0].$message
                  : ''
              "
            >
              <template v-slot:selection="{ item }">
                <v-icon left color="primary">mdi-circle</v-icon>
                {{ item.name }}
              </template>
              <template v-slot:item="{ item }">
                <v-icon left color="primary">mdi-circle</v-icon>
                {{ item.name }}
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="4" class="pt-0">
            <p><b>VPC Port</b></p>
            <v-select
              id="selectedVPC"
              placeholder="VPC Port"
              :items="vpcPortItems"
              v-model="selectedVPC"
              item-disabled="disable"
              outlined
              :filled="!resourceSelected"
              :disabled="!resourceSelected"
              :error-messages="
                $v.selectedVPC.$errors.length
                  ? $v.selectedVPC.$errors[0].$message
                  : ''
              "
            />
          </v-col>

          <v-col cols="12" class="pt-0">
            <v-btn
              v-if="user.role.toLowerCase() !== 'superadmin'"
              block
              depressed
              class="secondary"
              @click="
                () => {
                  validateprivilages(['Network', 'editor']).then(() => {
                    processFloatingIP();
                  });
                }
              "
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                :color="'white'"
                :size="'10px'"
                class="mr-2"
              ></beat-loader>
              <span v-else style="font-size: 14px">Assign Floating IP</span>
            </v-btn>
            <v-btn
              v-else
              block
              depressed
              class="secondary"
              @click="
                () => {
                  validateprivilages(['Network', 'editor']).then(() => {
                    addFloatingIp();
                  });
                }
              "
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                :color="'white'"
                :size="'10px'"
                class="mr-2"
              ></beat-loader>
              <span v-else style="font-size: 14px">Assign Floating IP</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

    <v-card v-if="floatingips.length" class="rounded-lg mt-7" flat>
      <v-container class="pa-8">
        <h3>Floating IP</h3>
        <br />
        <v-data-table
          hide-default-footer
          :items="floatingips"
          :headers="headers"
          :items-per-page="10"
        >
          <template v-slot:no-data>
            {{ isLoading ? "Loading.." : "No data available" }}
          </template>
          <template v-slot:item.ip="{ item }">
            <div>
              <p class="mb-0">{{ item.ip_address }}</p>
            </div>
          </template>
          <template v-slot:item.appliedto="{ item }">
            <div
              v-if="floatingipselected != item"
              style="height: 50px"
              class="d-flex flex-column justify-center"
            >
              <div v-if="item.instance">
                <router-link
                    :id="`instance-${i + 1}`"
                    :to="{
                    path: `/project/${activeProject}/${item.project_id}/${item.instance_id}/`,
                  }"
                  ><span class="primary--text">
                    {{ item.instance.name }}
                  </span></router-link
                >
              </div>
              <div v-else-if="item.load_balancer">
                <router-link
                  :id="`loadBalancer-${i + 1}`"
                  :to="{
                    path: `/network/loadbalancer/${item.load_balancer_id}/instances`,
                  }"
                  ><span class="primary--text">
                    {{ item.load_balancer.name }}
                  </span></router-link
                >
              </div>
              <!-- <div
                  :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                  @click="
                  () => {
                    if (read_only) {
                      return;
                    }
                    if (isFloatingIPLoading) return false;
                    validateprivilages(['Network', 'editor']).then(() => {
                      floatingipselected = item;
                    });
                  }
                "
                v-else
                :class="{ linkpointer: !isFloatingIPLoading }"
                style="text-decoration: underline"
              >
                Assign to Instance
              </div> -->
              <div v-else>-</div>
            </div>
            <div v-if="floatingipselected == item">
              <v-autocomplete
                style="width: 250px"
                @change="
                  (val) => {
                    assignnewvalue(item, val);
                  }
                "
                @blur="
                  () => {
                    floatingipselected = null;
                  }
                "
                :items="availableInstances"
                v-model="assignselected"
                :ref="`searchinstance${item.id}`"
                outlined
                placeholder="Search for a Instance"
                hide-details
              >
                <template v-slot:selection="{ item }">{{ item.name }}</template>
                <template v-slot:item="{ item }">
                  <div>
                    <div v-if="item.unassigned">
                      {{ item.name }}
                    </div>
                    <div v-else class="d-flex flex-row">
                      <v-icon left color="primary">mdi-circle</v-icon>
                      <div>
                        <p class="mb-0">{{ item.name }}</p>
                        <p class="mb-0">
                          {{ item.instancetype }}
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
              </v-autocomplete>
            </div>
          </template>
          <template v-slot:item.vpc_port="{ item }">
            <div v-if="item.instance">
              {{ item.vpc_name + " ("+ item.vpc_name_port +"/" + item.vpc_port + ")" }}
            </div>
            <div v-else>-</div>
          </template>
          <template v-slot:item.action="{ item }">
            <popupquote
              :ref="`menu${item.id}`"
              :close-on-content-click="false"
              :nudge-left="30"
              :nudge-width="80"
              :offsetTop="21"
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
                  :disabled="disabledField || isFloatingIPLoading"
                  v-if="!item.load_balancer && item.instance_id == ''"
                  @click="
                    () => {
                      // floatingipselected = item;
                      // $refs['menu' + item.id]['dialog'] = false;
                      openReassignFloatingIPDialog = true;
                      activemenufloatingip = item;
                    }
                  "
                >
                  <v-list-item-title>Reassign</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="disabledField || isFloatingIPLoading"
                  v-if="item.instance || item.load_balancer"
                  @click="
                    () => {
                      unassignFloatingIP(item.id);
                      $refs['menu' + item.id]['dialog'] = false;
                    }
                  "
                >
                  <v-list-item-title>Unassign</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="disabledField"
                  v-if="item.appliedto"
                  @click="
                    () => {
                      assignselected = {
                        unassigned: true,
                        instanceName: 'Unassign floating IP',
                      };

                      assignnewvalue(item, {
                        id: item.id,
                        unassigned: true,
                        instanceName: 'Unassign floating IP',
                      });

                      $refs['menu' + item.id]['dialog'] = false;
                    }
                  "
                >
                  <v-list-item-title>Unassign</v-list-item-title>
                </v-list-item>

                <v-list-item
                  :disabled="!!item.appliedto || disabledField"
                  @click="
                    () => {
                      opendialogdelete = true;
                      deleteselected = item;
                      $refs['menu' + item.id]['dialog'] = false;
                    }
                  "
                >
                  <v-list-item-title
                    ><span
                      :class="{
                        'accent--text': item.appliedto,
                        'error--text': !item.appliedto,
                      }"
                      >Delete</span
                    ></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </popupquote>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable :props="props" />
          </template>
           <template v-slot:item.dns="{ item }">
            <div v-if="item.dns_record">
              {{ item.dns_record }}
            </div>
            <div v-else>-</div>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
    <!-- <v-card flat class="mt-7 rounded-lg pa-7">
      <v-row>
        <v-col cols="8">
          <div class="headline mb-2 font-weight-bold font--text">
            Floating IP
          </div>
        </v-col>
        <v-col md="12">
          <v-card
            flat
            outlined
            class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
          >
            <v-card-text style="padding-top: 72px; padding-bottom: 78px">
              <p
                style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
                "
                class="font-weight-bold"
              >
                Looks like you have no floating IPs.
              </p>
              <v-row>
                <v-col>
                  <p
                    style="
                      font-size: 12px;
                      color: #a5b3bf;
                    "
                  >
                    A floating IP is a static IP address that points to one of your Instance. It allows you to redirect network traffic to any of your Instance in the same datacenter.
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card> -->

    <!-- <dialogFloatingIpConfirmation
        v-if="isShowConfirmDialog"
        :data="confirmDialogData"
        v-model="isShowConfirmDialog"
        @confirm="
        () => {
          addFloatingIp();
          isShowConfirmDialog = false;
        }
      "
      :loading="isLoading"
    /> -->

    <!-- dialog purchase floating ip -->
    <dialogNewServiceAvailability
      v-if="isShowConfirmDialog"
      :onClose="() => {isShowConfirmDialog = false}"
      serviceName="Floating IP"
      actionName="Assign Floating IP"
      :onAvailable="addFloatingIp"
    />

    <dialogDeleteFloat
      v-model="opendialogdelete"
      @delete="
        () => {
          deletef().then(() => {
            opendialogdelete = false;
          });
        }
      "
    />

    <dialogReassignFloatingIP
      v-if="openReassignFloatingIPDialog"
      v-model="openReassignFloatingIPDialog"
      :item="activemenufloatingip"
    />
  </div>
</template>

<script>
import network from "../NetworkComposition";
import { computed, ref, onMounted, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState, useNamespacedMutations } from "vuex-composition-helpers";
import { INSTANCE } from "@/modules/instance/namespace";
import { datatype, internet } from "faker";
import { NETWORKFLOATINGIP } from "./namespace";
import dialogDeleteFloat from "./dialogDeleteFloat";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import { useVoucher } from "@/modules/voucher/useVoucher";
import localstorage from "@/lib/localstorage";
const { required, requiredIf } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;
import api from "@/lib/api";
import { mapGetters } from "vuex";
import { toIDRWithDotFormat } from "@/lib/formatter";
import libProject from "@/lib/project";
import { MANAGEVOUCHER } from "../../superadmin-managevoucher/namespace";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
const isDevModeFloatingIP = true;
import { AccessControl } from "@/lib/middleware";
import { useVpc } from "../../instance/compositionapi/usevpc";
import dialogReassignFloatingIP from "@/modules/instance/dialogReassignFloatingIP";

export default {
  components: {
    dialogDeleteFloat,
    dialogNewServiceAvailability,
    dialogReassignFloatingIP,
  },
  data() {
    return {
      tnc: false,
      dataTnc: {},
      isDevModeFloatingIP,
      openReassignFloatingIPDialog: false,
    };
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Project Network"));
    const resources = ref([]);
    const resourceTypesInit = ref(["Instance", "Load Balancer"]);
    const resourceTypes = ref(resourceTypesInit.value);
    const resourceType = ref(null);
    const resourceSelected = ref("");
    const isShowConfirmDialog = ref(false);
    const confirmDialogData = ref(null);
    const floatingipselected = ref();
    const { floatingip, createFloatingIp } = network();
    const activemenufloatingip = ref({});
    const useComposable = {
      ...useVpc(),
    };
    const vpcItems = ref([]);
    const { selectvpcportbyins: selectVpcPortByIns } = useVpc();
    // async function getVpcs() {
    //   const vpcs = await useComposable.fetchvpcports(resourceSelected.value.id);
    //   vpcItems.value = vpcs.map((vpc) => {
    //     return {
    //       text: vpc.name+" ("+vpc.ip_address+")",
    //       value: vpc.id,
    //     };
    //   });
    // }
    const headers = ref([
      { text: "Floating IP", value: "ip" },
      { text: "Assigned to", value: "appliedto" },
      { text: "VPC Port", value: "vpc_port" },
      { text: "IP Type", value: "type" },
      { text: "DNS", value: "dns" },
      { text: "Action", value: "action" },
    ]);
    const {
      activeProject,
      getIsFloatingIPLoading: isFloatingIPLoading,
      listFloatingIp,
    } = useNamespacedGetters(NETWORKFLOATINGIP, ["activeProject", "getIsFloatingIPLoading", "listFloatingIp"]);
    const {
      addfloatingip,
      DELETE_FLOATING_IP,
      fetchfloatingips,
      REASSIGN_FLOATING_IP,
      UNASSIGN_FLOATING_IP,
      fetchAvailableInstances,
      confirmFloatingIp,
      validateVPCPortFloatingIp,
      getFlavorFloatingIp,
    } = useNamespacedActions(NETWORKFLOATINGIP, [
      "addfloatingip",
      "fetchfloatingips",
      "DELETE_FLOATING_IP",
      "REASSIGN_FLOATING_IP",
      "UNASSIGN_FLOATING_IP",
      "fetchAvailableInstances",
      "confirmFloatingIp",
      "validateVPCPortFloatingIp",
      "getFlavorFloatingIp",
    ]);

    const { availableInstances } = useNamespacedState("NETWORKFLOATINGIP", ["availableInstances"]);

    const { setopendialogbalance, setopendialogbalancemsg } = useNamespacedMutations("DASHBOARD", ["setopendialogbalance", "setopendialogbalancemsg"]);

    const { fetchLoadBalancers, assignFloatingIP: assignFloatingIPLB } = useNamespacedActions("NETWORKLOADBALANCER", [
      "fetchLoadBalancers",
      "assignFloatingIP",
    ]);

    const { loadBalancers } = useNamespacedState("NETWORKLOADBALANCER", ["loadBalancers"]);

    const { fetchVoucherDiscountByProjectID } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchVoucherDiscountByProjectID",
    ]);

    const { voucherDiscountProject } = useNamespacedState(MANAGEVOUCHER, ["voucherDiscountProject"]);

    const { vouchers, fetchVouchers } = useVoucher();

    const defaultBillingTypeTrial = {
      text: "Trial",
      value: "Trial",
    }

    const defaultBillingTypePpu = {
      text: "Pay Per Use (PPU)",
      value: "PPU",
    }

    const defaultBillingTypeMonthly = {
      text: "Monthly",
      value: "Monthly",
    }

    const defaultBillingTypeFixed = {
      text: "Fixed",
      value: "Fixed",
    }

    const projJson = localstorage.getItem("currentProj");
    const projObj = projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    // const billingTypes = ref(postpaid_type && postpaid_type === 'fixed' ? fixedPostpaid : defaultBillingTypes)
    const billingTypes = ref([]);
    const billingTypesNonReserved = ref([]);

    const disabledField = ref(false);
    const { validateprivilages, validateprivilagesync, validateprivilagesyncnew } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Network", "editor"]).then((res) => {
      disabledField.value = res;
    });

    // const selectedBillingType = ref('Default')
    const selectedBillingType = ref("");
    const selectedVPC = ref("");
    const selectedTrialVoucher = ref(null);
    const floatingIpTypes = ref([]);
    const selectedFloatingIpType = ref("");
    const floatingIpPrice = ref(0);
    const isPrepaid = ref(false);
    const floatingIpDiscount = ref(0);

    const {checkAvailability} = useNewServiceAvailability()

    const checkIsPrepaid = async () => {
      const currProj = await libProject.getActiveProject();
      isPrepaid.value = currProj.payment_method.toLowerCase() === "prepaid" ? true : false;
    };

    // watch(selectedFloatingIpType, (val) => {
    //   const type = floatingIpTypes.value.find((type) => type.value === val);
    //   floatingIpPrice.value = type.price;
    // });

    const additionalRules = isDevModeFloatingIP
      ? {
          selectedFloatingIpType: { required },
        }
      : {};

    const $v = useVuelidate(
      {
        selectedBillingType: { required },
        selectedVPC: { required },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
        // resourceType: isDevModeFloatingIP ? {
        //   required: requiredIf((val) => {
        //     return selectedFloatingIpType.value === "reserved";
        //   }),
        // } : { required },
        resourceType: { required },
        resourceSelected: isDevModeFloatingIP
          ? {
              required: requiredIf((val) => {
                return resourceType.value;
              }),
            }
          : { required },
        // resourceSelected: { required },
        ...additionalRules,
      },
      isDevModeFloatingIP
        ? {
            selectedTrialVoucher,
            resourceType,
            resourceSelected,
            selectedFloatingIpType,
            selectedBillingType,
            selectedVPC,
          }
        : {
            selectedTrialVoucher,
            resourceType,
            resourceSelected,
            selectedBillingType,
            selectedVPC,
            // selectedFloatingIpType,
          }
    );

    const resetForm = () => {
      selectedBillingType.value = "";
      selectedVPC.value = "";
      selectedTrialVoucher.value = null;
      selectedFloatingIpType.value = "";
      resourceType.value = null;
      resourceSelected.value = "";
      $v.value.$reset();
      
      if (isPrepaid.value) billingTypes.value = [defaultBillingTypePpu, defaultBillingTypeTrial]
    };

    const processFloatingIP = async () => {
      // cek terlebih dahulu apakah portnya sudah di attach
      const payloadValidate = {
        port_id: selectedVPC.value,
      };
      const response = await validateVPCPortFloatingIp(payloadValidate);
      console.log("res validate ", response);
      if (response.data.code !== 200) {
        console.log("status code bukan 200 ", response.code);
        return;
      }


      if (isPrepaid.value) {
        selectedFloatingIpType.value = getFloatingTypeId("Non-Reserved");
      }
      $v.value.$touch();
      if ($v.value.$invalid) return false;
      const payload = {
        id: resourceSelected.value.id,
        voucher_id: null,
      };
      if (selectedBillingType.value == "Trial") {
        payload.voucher_id = selectedTrialVoucher.value;
      }

      if (selectedBillingType.value.toLowerCase() === "trial") {
        await addFloatingIp();
        return;
      }

      await checkAvailability(
        {
          by: "custom", 
          item: {
            service_name: 'FLOATING_IP', 
            id: selectedFloatingIpType.value,
          }
        }
      )

      // await confirmFloatingIp({type: getTypeName(selectedFloatingIpType.value), voucher_id: selectedTrialVoucher.value}).then(
      //   ({ data, code }) => {
      //     const role = localStorage.getItem("role");
      //     const responseData = data.data;
      //     if (
      //       !responseData.is_enough &&
      //       responseData.payment_method === "prepaid" &&
      //       role !== "Superadmin"
      //     ) {
      //       setopendialogbalance(true);
      //       setopendialogbalancemsg(
      //         `Your balance is not enough. Minimal balance is ${toIDRWithDotFormat(
      //           responseData.minimum_balance
      //         )} to create this service`
      //       );
      //     } else {
      //       if (role !== "Superadmin") {
      //         confirmDialogData.value = responseData;
      //         isShowConfirmDialog.value = true;
      //       } else {
      //         addFloatingIp();
      //       }
      //     }
      //   }
      // );

      isShowConfirmDialog.value = true
    };

    async function addFloatingIp() {
      if (selectedFloatingIpType && selectedFloatingIpType.value && getTypeName(selectedFloatingIpType.value) === "reserved" && !resourceType.value) {
        const payload = {
          id: "",
          voucher_id: selectedTrialVoucher.value,
          billing_type: selectedBillingType.value,
          vpc_id: selectedVPC.value,
          port_id: selectedVPC.value,
          ip_type: selectedFloatingIpType.value,
        };
        await addfloatingip(payload);
        resetForm();
      }

      if (resourceSelected.value) {
        if (resourceType.value === "Instance" && !!resourceSelected.value.openstack_vm_uuid) {
          const payload = {
            id: resourceSelected.value.id,
            voucher_id: selectedTrialVoucher.value,
            billing_type: selectedBillingType.value,
            vpc_id: selectedVPC.value,
            port_id: selectedVPC.value,
            ip_type: selectedFloatingIpType.value,
          };
          await addfloatingip(payload);
          resetForm();
        } else if (resourceType.value === "Load Balancer" && !!resourceSelected.value.openstack_uuid) {
          const payload = {
            id: resourceSelected.value.id,
            voucher_id: selectedTrialVoucher.value,
            billing_type: selectedBillingType.value,
            vpc_id: selectedVPC.value,
            port_id: selectedVPC.value,
            ip_type: getTypeName(selectedFloatingIpType.value),
          };
          await assignFloatingIPLB(payload);
          resetForm();
        } else
          return context.root.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            `Unable to assign Floating IP. ${resourceType.value} ${resourceSelected.value.name} still in building process.`
          );
      }
    }

    async function getFloatingIpTypes(type, text) {
      try {
        const res = await api.GET("/network/floating-ip/price/" + type);
        floatingIpTypes.value.push({
          text,
          value: res.data.type,
          price: res.data.price_per_month,
        });
      } catch {
        context.root.$store.dispatch("HOMEPAGE/showErrorToast", `Sorry, an error occurred while displaying floating IP ${type} type`);
      }
    }

    onMounted(async () => {
      if (isPrepaid.value || postpaid_type !== "fixed") {
        billingTypes.value = [defaultBillingTypePpu, defaultBillingTypeTrial]
      } else {
        billingTypes.value = [defaultBillingTypeFixed, defaultBillingTypeTrial]
      }

      await getFlavorFloatingIp();
      if (postpaid_type && postpaid_type === "fixed") {
        selectedBillingType.value = "";
        selectedVPC.value = "";
      } else {
        selectedBillingType.value = "";
        selectedVPC.value = "";
      }

      if (read_only.value) {
        headers.value.pop();
      }

      fetchAvailableInstances();
      fetchLoadBalancers();
      fetchVouchers();
      // getFloatingIpTypes("reserved", "Reserved");
      // getFloatingIpTypes("non-reserved", "Non-Reserved");
      checkIsPrepaid();

      await fetchVoucherDiscountByProjectID(projObj.id);
      if (voucherDiscountProject.value) {
        floatingIpDiscount.value =
          voucherDiscountProject.value.voucher_discount_detail.floating_ip;
      }
    });

    watch(
      () => resourceType.value,
      (value) => {
        if (value == "Instance") resources.value = instances.value;
        //availableInstances.value;
        else if (value == "Load Balancer")
          resources.value = loadBalancers.value.filter(
            (x) => !x.floating_ip_id
          );
      }
    );

    const vpcPortItems = ref([]);
    async function getVpcs(id) {
        const vpcs = await useComposable.fetchvpcportsfiplist(id);
        vpcPortItems.value = vpcs.map((vpc) => {
            return {
                text: vpc.vpc_name + " (" + vpc.name + "/" + vpc.ip_address + ")",
                value: vpc.id,
                disable: vpc.disable
            };
        });
    }

    watch([resourceSelected], (val) => {
      useComposable.fetchvpcportsfip(resourceSelected.value.id);
      getVpcs(resourceSelected.value.id);
    });

    watch(
      () => selectedBillingType.value,
      (value) => {
        if (value == "Trial") {
          resourceTypes.value = resourceTypesInit.value.filter(function (v) {
            return v !== "Load Balancer";
          });
        } else {
          resourceTypes.value = resourceTypesInit.value;
        }
      }
    );

    watch(
      selectedFloatingIpType,
      () => {
        if (postpaid_type === 'fixed') {
          billingTypes.value = [defaultBillingTypeFixed, defaultBillingTypeTrial]
          return
        } else if (selectedFloatingIpType.value) {
          switch (getTypeName(selectedFloatingIpType.value)) {
            case "Reserved": {
              billingTypes.value = [defaultBillingTypeMonthly, defaultBillingTypeTrial]
              return
            }
            case "Non-Reserved": {
              billingTypes.value = [defaultBillingTypePpu, defaultBillingTypeTrial]
              return
            }
          }

        }
        billingTypes.value = []
      },
      { deep: true }
    );

    const { floatingips, isLoading } = useNamespacedState(NETWORKFLOATINGIP, ["floatingips", "isLoading"]);

    const { fetchinstances } = useNamespacedActions(INSTANCE, ["fetchinstances"]);

    const { instances } = useNamespacedState(INSTANCE, ["instances"]);
    const instanceunassigned = computed(() => {
      return [
        {
          unassigned: true,
          open: false,
          instanceName: "Unassign Floating IP",
          instance_id: null,
        },
      ].concat(
        instances.value.map((x) => {
          x.open = false;
          return x;
        })
      );
    });
    const assignselected = ref();
    const opendialogdelete = ref(false);
    const deleteselected = ref();
    const dataFloatingType = ref({});
    const getInstanceNameById = (id) => {
      const index = instances.value.findIndex((x) => x.id === id);
      if (index > -1) return instances.value[index].instanceName;
      return null;
    };
    const changeType = (event) => {
      const data = listFloatingIp.value.find((row) => row.id == event);
      dataFloatingType.value = data;
    };
    const getTypeName = (event) => {
      const data = listFloatingIp.value.find((row) => row.id == event);
      return data?.type;
    };
    const getFloatingTypeId = (name) => {
      const data = listFloatingIp.value.find((row) => row.type == name);
      return data?.id;
    };

    return {
      read_only,
      isPrepaid,
      checkIsPrepaid,
      processFloatingIP,
      confirmDialogData,
      confirmFloatingIp,
      isShowConfirmDialog,
      selectedFloatingIpType,
      floatingIpTypes,
      floatingIpPrice,
      isFloatingIPLoading,
      availableInstances,
      headers,
      assignselected,
      unassignFloatingIP: async (floatingIPID) => {
        await UNASSIGN_FLOATING_IP(floatingIPID);
      },
      assignnewvalue: async (ip, val) => {
        floatingipselected.value = null;
        if (val.unassigned) {
          await UNASSIGN_FLOATING_IP(ip.id);
        } else {
          const payload = {
            floating_ip_id: ip.id,
            instance_id: val.id,
          };
          await REASSIGN_FLOATING_IP(payload);
        }
      },
      log(ref) {
        ref.dialog = false;
      },
      deleteselected,
      deletef: async () => {
        await DELETE_FLOATING_IP({ id: deleteselected.value.id });
      },
      resourceTypes,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      disabledField,
      resourceType,
      isLoading,
      activeProject,
      floatingipselected,
      opendialogdelete,
      floatingip,
      addFloatingIp,
      fetchinstances,
      instances,
      instanceunassigned,
      resourceSelected,
      fetchfloatingips,
      getInstanceNameById,
      resources,
      floatingips,
      DELETE_FLOATING_IP,
      REASSIGN_FLOATING_IP,
      loadBalancers,
      vouchers,
      billingTypes,
      billingTypesNonReserved,
      selectedTrialVoucher,
      selectedBillingType,
      selectedVPC,
      $v,
      toIDRWithDotFormat,
      floatingIpDiscount,
      vpcItems,
      selectVpcPortByIns,
      activemenufloatingip,
      listFloatingIp,
      changeType,
      dataFloatingType,
      getTypeName,
      vpcPortItems
    };
  },
  created() {
    this.fetchinstances();
    this.fetchfloatingips();
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.v-btn {
  height: 50px !important;
}
.v-list-item__title {
  user-select: none;
}
</style>
