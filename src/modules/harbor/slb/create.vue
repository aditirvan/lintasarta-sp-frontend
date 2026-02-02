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
                <p class="font-weight-bold">Flavor</p>
                <v-select
                  v-model="flavor"
                  append-icon="mdi-chevron-down"
                  :items="listFlavorSlb"
                  :item-text="(i) => {
                    return i.vcpu + ' VPCU/' + i.ram + 'GB RAM'
                  }"
                  item-value="name"
                  placeholder="Choose a Flavor"
                  outlined
                  single-line
                  :error-messages="$v.flavor.$errors.length ? $v.flavor.$errors[0].$message : ''"
                ></v-select>
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
                  block
                  class="secondary fz-14"
                  depressed
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  @click="createLB"
                >
                  Create Load Balancer
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
import { computed, onMounted, reactive, ref, watch } from "@vue/composition-api";
import network from "../../network/NetworkComposition";
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from 'vuex-composition-helpers';
import { NETWORKVPC } from '@/modules/network/vpc/namespace'
import api from "@/lib/api";
import localstorage from '@/lib/localstorage';
import { SLB, SLBBILLING } from "../../network/slb/namespace"
import { AccessControl } from "@/lib/middleware";

export default {
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { isLoadingBtn } = useNamespacedState(SLB, ["isLoadingBtn"])
    const userId = JSON.parse(localStorage.getItem("userId"))
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
  
    const name = ref('')
    const flavor = ref('')
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
    const $v = useVuelidate(
      {
        name: { required,
          $autoDirty: true,
          conditional: {
            $message: "Whitespace is not allowed",
            $validator: (val) => {
                return /^[^\s]+$/g.test(val);
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
        flavor: flavor.value,
      }
      // console.log(payload)
      let resp = await createSlb(payload)
      if(resp.status == 200){
        context.root.$router.replace("/network/slb");
      }else{
        console.log(resp)
      }
    }

    onMounted(()=>{
      fetchVpc()
      getFlavorSlb()
    })

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
    };
  },

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
</style>

<style>
.balance-table .v-data-table > .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>