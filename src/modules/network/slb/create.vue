<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="balance-title d-flex align-items-center" v-if="!read_only">
                  Create Load Balancer
                </div>
                <div class="balance-content pt-4">
                  Load balancers distribute traffic between Instances within the
                  same datacenter. Create a load balancer, then add Instances by
                  name or by tag.
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Tier</p>
                  <v-radio-group
                  v-model="tier"
                  class="pt-0"
                  hide-details
                  row>
                  <!-- <v-col md="4"> -->
                    <v-row>
                      <v-col md="4" class="my-0">
                        <v-radio label="Server Load Balancer" value="slb"></v-radio>
                      </v-col>
                      <!-- <v-col md="3"><v-icon>mdi-earth</v-icon></v-col> -->
                    </v-row>
                  <!-- </v-col> -->
                  <!-- <v-col md="4"> -->
                    <v-row>
                      <v-col md="4" class="my-0 ">
                        <v-radio
                        label="Global Load Balancer"
                        value="glb">
                        </v-radio>
                      </v-col>
                      <!-- <v-col md="3">
                        <v-icon>mdi-lock-outline</v-icon>
                      </v-col> -->
                    </v-row>
                  <!-- </v-col> -->
                </v-radio-group>
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
              <v-col cols="12" class="mb-2">
                <div>
                  <p class="mb-0">
                    <span class="font-weight-bold">Flavor</span>
                  </p>
                </div>
              </v-col>

              <v-col class="d-flex flex-wrap pt-0" id="SelectInstanceSize">
                <v-card
                  v-if="listFlavorSlb.length === 0"
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

                <v-sheet v-if="listFlavorSlb.length" max-width="100%" class="mt-0" id="col_instanceselected">
                  <v-slide-group class="py-4 pt-0" active-class="success" show-arrows>
                    <v-card
                      v-for="(item, index) in listFlavorSlb"
                      :key="'flavor-'+index"
                      @click="
                        () => {
                          flavor = item;
                        }
                      "
                      border-color="primary"
                      outlined
                      class="rounded-lg select-flavor"
                      :class="{
                        selected: isObjectEqual(flavor, item),
                      }"
                      style="margin-right: 20px; min-width: 170px"
                      :style="{
                        border: $v.flavor.$errors.length ? '1px solid #eb5757 !important' : '',
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
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">VPC Network</p>
                <v-select
                  placeholder="Choose a VPC"
                  append-icon="mdi-chevron-down"
                  :items="vpcSlb"
                  item-text="name"
                  item-value="name"
                  v-model="vpcselected"
                  outlined
                  single-line
                  :error-messages="$v.vpcselected.$errors.length ? $v.vpcselected.$errors[0].$message : ''"
                ></v-select>
              </v-col>
            </v-row>

             <!-- <v-row>
              <v-col cols="12" md="3" class="d-flex pb-0">
                <p class="font-weight-bold">High Availability</p>
                <v-spacer></v-spacer>
                <v-checkbox
                  class="py-0 my-0"
                  v-model="ha"
                ></v-checkbox> -->
                <!-- <v-radio-group
                class="my-0"
                v-model="ha"
                row
                >
                  <v-radio
                    label="HA"
                    value="2"
                  ></v-radio>
                  <v-radio
                    label="Single"
                    value="1"
                  ></v-radio>
                </v-radio-group> -->
              <!-- </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" v-if="user.role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                <div class="d-flex align-center">
                  <v-checkbox v-model="agree" label="By Creating Server Load Balancer You Agree To The"> </v-checkbox>
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
              <v-col cols="3" v-if="!read_only">
                <v-btn
                  v-if="user.role.toLowerCase() == 'superadmin'"
                  block
                  class="secondary fz-14"
                  depressed
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  @click="createLB"
                >
                  Create Load Balancer
                </v-btn>
                <v-btn
                  v-else-if="statusCheckEula"
                  block
                  class="secondary fz-14"
                  depressed
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  @click="displaySlbDialog"
                >
                  Create Load Balancer
                </v-btn>
                <v-btn
                  v-else
                  block
                  class="secondary fz-14"
                  depressed
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn || !agree"
                  @click="displaySlbDialog"
                >
                  Create Load Balancer
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog purchase slb -->
    <dialogNewServiceAvailability
      v-if="slbDialog" 
      :onClose="() => {slbDialog = false}"
      serviceName="Load Balancer"
      actionName="Create Load Balancer"
      :onAvailable="createLB"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "@vue/composition-api";
import network from "../NetworkComposition";
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from 'vuex-composition-helpers';
import { NETWORKVPC } from '@/modules/network/vpc/namespace'
import api from "@/lib/api";
import { isObjectEqual } from '@/lib/object'
import localstorage from '@/lib/localstorage';
import { SLB, SLBBILLING } from './namespace'
import { AccessControl } from "@/lib/middleware";
import { toIDRWithDotFormat } from "@/lib/formatter";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { mapGetters } from "vuex";
import INSTANCE from "@/modules/instance/namespace";

export default {
  components: {
    dialogNewServiceAvailability
  },
  setup(props, context) {
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { isLoadingBtn } = useNamespacedState(SLB, ["isLoadingBtn"])
    const userId = JSON.parse(localStorage.getItem("userId"))
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
  
    const name = ref('')
    const flavor = ref('')
    const tier = ref('slb')
    const flavors = ref([
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
    const ha = ref('')
    const slbDialog = ref(false)
    const agree = ref(false)

    const vpcselected = ref(null)
    // const { fetchvpcs } = useNamespacedActions(NETWORKVPC, ['fetchvpcs'])
    // const { vpcs } = useNamespacedState(NETWORKVPC, ['vpcs'])
    const { createSlb, fetchVpc } = useNamespacedActions(SLB, ["createSlb", "fetchVpc"])
    const { vpcSlb } = useNamespacedState(SLB, ['vpcSlb'])
    const { getFlavorSlb } = useNamespacedActions(SLBBILLING, [
      "getFlavorSlb",
    ]);
    const { listFlavorSlb } = useNamespacedGetters(SLBBILLING, [
      "listFlavorSlb",
    ]);
    const {checkAvailability} = useNewServiceAvailability()
    const $v = useVuelidate(
      {
        name: { required,
          $autoDirty: true,
          conditional: {
            $message: "Can only contains alphabet, numeric, dash, and underscore",
            $validator: (val) => {
              return /^[a-zA-Z_0-9-]+$/g.test(val);
            },
          }, 
        },
        flavor: { required },
        vpcselected: { required },
      },
      {
        name,
        flavor,
        vpcselected
      })

    const createLB = async () => {
      let project = currentProj.openstack_project_id
      let org_id = currentProj.organization_id

      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let payload = {
        user_id: userId,
        project_id: project,
        add_item_relation: true,
        item_id: flavor.value.id,
        flavor_id: flavor.value.flavor_id,
        organization_id: org_id,
        slb_instance_name: name.value,
        vm_vpc_network_name: vpcselected.value,
        ha_count: ha.value ? "2" : "1",
        flavor: flavor.value.name,
        tier: tier.value
      }
     
      // console.log(payload)
      let resp = await createSlb(payload)
      if(resp.status == 200){
        if (!statusCheckEula.value && localStorage.getItem("role").toLowerCase() !== 'superadmin') {
            const payload = {
              form_name: "Form Create Server Load Balancer",
              project_id: localStorage.getItem("projectid"),
            };
            console.log("siniiii")
            validateEula(payload)
          }
        context.root.$router.replace("/network/slb");
      }else{
        console.log(resp)
      }
    }

    const displaySlbDialog = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;

      await checkAvailability(
        {
          by: "item", 
          item: {
            service_name: 'SLB', 
            id: flavor.value.id,
          }
        }
      )

      slbDialog.value = true;
    };

    onMounted(()=>{
      fetchVpc()
      const params = new URLSearchParams();
      params.append("project_id", currentProj.id);
      getFlavorSlb(params)

      const params1 = new URLSearchParams();
      params1.append("project_id", localStorage.getItem("projectid"));
      params1.append("form_name", "Form Create Server Load Balancer");
      checkEula(params1);
    })

    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Server Load Balancer" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };

    return {
      read_only,
      $v,
      name,
      flavor,
      flavors,
      vpcselected,
      ha,
      createLB,
      isLoadingBtn,
      vpcSlb,
      listFlavorSlb,
      toIDRWithDotFormat,
      isObjectEqual,
      tier,
      slbDialog,
      displaySlbDialog,
      agree,
      getEula,
      statusCheckEula,
    };
  },
  computed: {
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  }
};
</script>

<style lang="scss" scoped>
h4 {
  padding-bottom: 10px;
  padding-top: 20px;
}
.v-btn {
  height: 50px !important;
}

.balance-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.balance-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}

.row {
  align-items: center;
}
.labelinside {
  ::v-deep legend {
    width: 0px !important;
  }
  ::v-deep label {
    top: 30px;
    font-weight: 700;
    color: #a5b3bf;
  }
  ::v-deep input {
    position: relative;
    top: 5px;
  }
  ::v-deep .v-select__selection {
    position: relative;
    top: 5px;
  }
  ::v-deep .v-text-field__details{
    position: inherit;
  }
}
td {
  border: none !important;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
.v-radio {
  ::v-deep label {
    white-space: nowrap;
  }
}
.selected {
  border-color: #2c94d2;
}
</style>

<style>
.balance-table .v-data-table > .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>

<style scoped lang="scss">
.select-flavor {
  cursor: pointer;

  &.selected {
    border-color: #2c94d2;

    .v-divider {
      border-color: #2c94d2;
    }
  }
}

.v-card.select-storage {
  p {
    margin-bottom: 0px;
    text-align: left;
  }
}

.v-card__title {
  line-height: 1.5rem;
}

.slide-fade-enter-active {
  transition: all 0.3s;

  &.ssh {
    position: relative;
  }

  &.password {
    position: absolute;
  }
}

.slide-fade-leave-active {
  &.ssh {
    position: relative;
  }

  &.password {
    position: absolute;
  }

  transition: all 0.3s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  /* .slide-fade-leave-active below version 2.1.8 */
  &.ssh {
    transform: translateX(-1200px);
  }

  &.password {
    transform: translateX(1200px);
  }

  opacity: 0;
}

.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}

.authentication {
  ::v-deep .v-icon {
    height: 30px;
    width: 30px;
  }

  ::v-deep .v-icon__svg {
    height: 30px;
    width: 30px;
  }
}

.bordererror {
  border: 1px solid red;
}

.v-input--radio-group {
  ::v-deep .v-messages__message {
    position: absolute;
    width: 100px;
  }
}

.select-version.v-text-field--outlined {
  ::v-deep fieldset {
    border-color: transparent;
    color: #2c94d2;
  }
}
#SelectVersion .v-select .dropdown-toggle {
  margin: 0;
}

.v-application p,
.v-application label,
.v-application td,
.v-application .select-version .v-menu__content {
  border-radius: 15px 15px 50px 50px;
}
</style>
