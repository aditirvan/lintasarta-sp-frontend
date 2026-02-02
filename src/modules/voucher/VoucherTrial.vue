<template>
  <v-container fluid class="px-0">
    <v-card flat class="pa-7 rounded-lg">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Voucher Trial</p>
          <v-spacer />
          <div class="d-flex">
            <v-text-field 
              placeholder="Enter voucher code here"
              outlined
              class="mr-4"
              style="width:300px;"
              v-model="voucherCode"
            />
            <v-btn
              id="Claim"
              :disabled="!voucherCode"
              depressed
              height="50"
              class="secondary"
              @click="doClaim"
            >
              <span class="fz-14">Claim</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col 
          cols="12" 
          md="6"
          v-for="item in vouchers"
          :key="item.id"
        >
          <div
            class="card-voucher"
          >
            <div class="card-voucher__content">
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <span class="card-voucher__name">{{ item.name }}</span>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="card-voucher__name--black">{{ item.code }}</span>
                </v-col>
              </v-row>
              <v-row class="card-voucher__list-services">
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Instance</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.instance >= item.setting.instance && item.setting.instance > 0 ">{{ item.usage.instance }}/{{ item.setting.instance }}</span>
                      <span v-else>{{ item.usage.instance }}/{{ item.setting.instance }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">vCPU</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.cpu >= item.setting.cpu && item.setting.cpu > 0">{{ item.usage.cpu }}/{{ item.setting.cpu }}</span>
                      <span v-else>{{ item.usage.cpu }}/{{ item.setting.cpu }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Memory</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.ram >= item.setting.ram && item.setting.ram > 0">{{ item.usage.ram }}/{{ item.setting.ram }}</span>
                      <span v-else>{{ item.usage.ram }}/{{ item.setting.ram }} GB</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Root Disk</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.root_disk_size >= item.setting.root_disk_size && item.setting.root_disk_size > 0">{{ item.usage.root_disk_size }}/{{ item.setting.root_disk_size }}</span>
                      <span v-else>{{ item.usage.root_disk_size }}/{{ item.setting.root_disk_size }} GB</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Data Disk</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.total_volume >= item.setting.total_volume && item.setting.total_volume > 0">{{ item.usage.total_volume }}/{{ item.setting.total_volume }}</span>
                      <span v-else>{{ item.usage.total_volume }}/{{ item.setting.total_volume }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Data Disk Size</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.volume_size >= item.setting.volume_size && item.setting.volume_size > 0">{{ item.usage.volume_size }}/{{ item.setting.volume_size }}</span>
                      <span v-else>{{ item.usage.volume_size }}/{{ item.setting.volume_size }} GB</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Object Storage</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.total_object_volume >= item.setting.total_object_volume && item.setting.total_object_volume > 0">{{ item.usage.total_object_volume }}/{{ item.setting.total_object_volume }}</span>
                      <span v-else>{{ item.usage.total_object_volume }}/{{ item.setting.total_object_volume }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Object Storage Size</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.object_volume_size >= item.setting.object_volume_size && item.setting.object_volume_size > 0">{{ item.usage.object_volume_size }}/{{ item.setting.object_volume_size }}</span>
                      <span v-else>{{ item.usage.object_volume_size }}/{{ item.setting.object_volume_size }} GB</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Snapshot</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.total_snapshot >= item.setting.total_snapshot && item.setting.total_snapshot > 0">{{ item.usage.total_snapshot }}/{{ item.setting.total_snapshot }}</span>
                      <span v-else>{{ item.usage.total_snapshot }}/{{ item.setting.total_snapshot }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Snapshot Size</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.snapshot_size >= item.setting.snapshot_size && item.setting.snapshot_size > 0">{{ item.usage.snapshot_size }}/{{ item.setting.snapshot_size }}</span>
                      <span v-else>{{ item.usage.snapshot_size }}/{{ item.setting.snapshot_size }} GB</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">VPC</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.router >= item.setting.router && item.setting.router > 0">{{ item.usage.router }}/{{ item.setting.router }}</span>
                      <span v-else>{{ item.usage.router }}/{{ item.setting.router }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Floating IP</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.floating_ip >= item.setting.floating_ip && item.setting.floating_ip > 0">{{ item.usage.floating_ip }}/{{ item.setting.floating_ip }}</span>
                      <span v-else>{{ item.usage.floating_ip }}/{{ item.setting.floating_ip }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">NAT Gateway</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.nat_gateway >= item.setting.nat_gateway && item.setting.nat_gateway > 0">{{ item.usage.nat_gateway }}/{{ item.setting.nat_gateway }}</span>
                      <span v-else>{{ item.usage.nat_gateway }}/{{ item.setting.nat_gateway }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Floating IP NAT Gateway</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.nat_gateway_fip >= item.setting.nat_gateway_fip && item.setting.nat_gateway_fip > 0">{{ item.usage.nat_gateway_fip }}/{{ item.setting.nat_gateway_fip }}</span>
                      <span v-else>{{ item.usage.nat_gateway_fip }}/{{ item.setting.nat_gateway_fip }}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="py-1" cols="12" md="8">
                      <span class="card-voucher__services">Load Balancer</span>
                    </v-col>
                    <v-col class="py-1" cols="12" md="4">
                      <span class="error--text font-weight-bold" v-if="item.usage.total_lb >= item.setting.total_lb && item.setting.total_lb > 0">{{ item.usage.total_lb }}/{{ item.setting.total_lb }}</span>
                      <span v-else>{{ item.usage.total_lb }}/{{ item.setting.total_lb }}</span>
                    </v-col>
                  </v-row>
                </v-col> -->
              </v-row>
            </div>
            <div class="card-voucher__valid-until">
              <span class="card-voucher__services">Validity Period</span><br>
              {{ moment(item.claim_period_start).format('DD/MM/YYYY') }} to {{ moment(item.claim_period_end).format('DD/MM/YYYY') }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
import moment from 'moment'
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { useVoucher } from './useVoucher'
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { VOUCHER } from "./namespace";

export default defineComponent({
  components: {
  },
  setup(props, { root }) {
    const { fetchVouchers, vouchers, claimVoucher } = useVoucher()
    const voucherCode = ref('')

    onMounted(async () => {
      await fetchVouchers()
    })

    const doClaim = async () => {
      const projectID = localStorage.getItem('projectid')
      await claimVoucher({
        "code": voucherCode.value,
        "project_id": projectID,
      })
    }

    return {
      ...useVoucher(),
      doClaim,
      vouchers,
      voucherCode,
      moment,
    }
  },
});
</script>
<style lang="scss" scoped>
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }
  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}

.text-success,
.text-danger,
.text-muted { 
  text-transform: capitalize; 
}

.text-success { color: #27AE60 }
.text-danger { color: #EB5757 }
.text-muted { color: #A5B3BF }

.card-voucher {
  border: 1px solid #2C94D2;
  background: rgba(44, 148, 210, 0.02);
  border-radius: 10px;
}

.card-voucher__content,
.card-voucher__valid-until {
  padding: 1rem 1.8rem;
}

.card-voucher__name {
  font-size: 16px;
  font-weight: 800;
  color: #1F60A8;
}

.card-voucher__name--black {
  font-size: 16px;
  font-weight: 800;
  color: #556272;
}

.card-voucher__services {
  color: #556272;
  font-weight: 600;
}

.card-voucher [class*="col-"] {
  padding-top: .5rem;
  padding-bottom: .25rem;
}

.card-voucher__list-services {
  font-size: 14px;
}

.card-voucher__valid-until {
  font-size: 14px;
  border-top: 1px dashed #2C94D2;
}

</style>