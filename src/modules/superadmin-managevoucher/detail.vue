<template>
  <v-card flat class="rounded-lg pa-5 mt-3" v-if="voucherDetails">
    <v-container v-if="!isVoucherLoading">
      <v-row>
        <v-col cols="6">
          <div class="headline font-weight-bold font--text">Detail Voucher Trial</div>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn 
            color="primary"
            style="padding:1.5rem;font-size:15px;"
            depressed
            @click="openDetail = true"
          >List of Voucher Code ( {{ voucherDetails.pagination ? voucherDetails.pagination.count : '0' }} )</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Name</p>
          <p>{{ name }}</p>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Claim Period</p>
          <p>{{ moment(period.start).format('D MMMM Y') }} - {{ moment(period.end).format('D MMMM Y') }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Description</p>
          <p>{{ description }}</p>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Expired Date</p>
          <p>{{ moment(expired_date).format('D MMMM Y') }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Voucher Quota</p>
          <p>{{ quota }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Voucher Code</p>
          <p>{{ code }}</p>
        </v-col>
      </v-row>

      <v-divider />

      <div class="headline font-weight-bold font--text pt-8">Services Limit</div>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Instance</p>
          <p>{{ instance }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">vCPU</p>
          <p>{{ cpu }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Memory</p>
          <p>{{ ram }} GB</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Root Disk</p>
          <p>{{ root_disk_size }} GB</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Data Disk</p>
          <p>{{ total_volume }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Data Disk Size</p>
          <p>{{ volume_size }} GB</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Object Storage</p>
          <p>{{ total_object_volume }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Object Storage Size</p>
          <p>{{ object_volume_size }} GB</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Snapshot</p>
          <p>{{ total_snapshot }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Snapshot Size</p>
          <p>{{ snapshot_size }} GB</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">VPC</p>
          <p>{{ s_router }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Floating IP</p>
          <p>{{ floating_ip }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">NAt Gateway</p>
          <p>{{ nat_gateway }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Floating IP NAT Gateway</p>
          <p>{{ nat_gateway_fip }}</p>
        </v-col>
      </v-row>
      <v-row v-if="!voucheredit">
        <v-col>
          <v-btn
            height="58"
            depressed
            block
            color="accent"
            to="/manage-flavors"
            exact
          >
            <span style="font-size: 16px"> Cancel</span>
          </v-btn>
        </v-col>
        <v-col v-if="!voucheredit">
          <v-btn
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Voucher</span>
          </v-btn>
        </v-col>
        <v-col v-else-if="voucheredit">
          <v-btn
            @click="
              () => {
                editVoucher(voucher);
              }
            "
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Save</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <dialogVoucherDetails
      v-model="openDetail"
      :voucherDetails="voucherDetails"
    />
  </v-card>
</template>

<script>
import { ref,onMounted } from "@vue/composition-api";
import { useCreateVoucher } from "./useCreateVoucher";
import moment from 'moment'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
import dialogVoucherDetails from './dialogVoucherDetails'

export default {
  components: {
    dialogVoucherDetails,
  },
  data: () => ({
    dates: ["2020-01-20", "2020-02-20"],
  }),
  computed: {
    dateRangeText() {
      return this.dates.join("   -   ");
    },
  },
  setup(props,context) {
    const { 
      fetchvoucher,
      fetchVoucherDetails,
    } = useNamespacedActions(MANAGEVOUCHER, [
      'fetchvoucher',
      'fetchVoucherDetails',
    ]);

    const openDetail = ref(false)
    const expired_date = ref(moment())
    const period = ref({
      start: moment(),
      end: moment(),
    })
    const { id } = context.root.$route.params
    const { 
      voucheredit,
      name,
      description,
      quota,
      day_duration,
      code,
      instance,
      cpu,
      ram,
      root_disk_size,
      volume_size,
      object_volume_size,
      snapshot_size,
      total_volume,
      total_object_volume,
      total_snapshot,
      s_router,
      floating_ip,
      total_lb, 
      nat_gateway,
      nat_gateway_fip,
    } = useCreateVoucher()
    const {
      voucher,
      voucherDetails,
      isLoading: isVoucherLoading,
    } = useNamespacedState(MANAGEVOUCHER, [
      "voucher",
      'voucherDetails',
      'isLoading'
    ]);

    const setVoucherEdit = (val)=>{
        voucheredit.value = val ? true : false
        name.value = val.name
        description.value = val.description
        quota.value = val.quota
        code.value = val.code
        day_duration.value = val.day_duration
        expired_date.value = new Date(val.expired_date)
        period.value.start = new Date(val.claim_period_start)
        period.value.end = new Date(val.claim_period_end)
        instance.value = val.setting.instance
        cpu.value = val.setting.cpu
        ram.value = val.setting.ram
        root_disk_size.value = val.setting.root_disk_size
        volume_size.value = val.setting.volume_size
        object_volume_size.value = val.setting.object_volume_size
        snapshot_size.value = val.setting.snapshot_size
        total_volume.value = val.setting.total_volume
        total_object_volume.value = val.setting.total_object_volume
        total_snapshot.value = val.setting.total_snapshot
        s_router.value = val.setting.router
        floating_ip.value = val.setting.floating_ip
        total_lb.value = val.setting.total_lb
        nat_gateway.value = val.setting.nat_gateway
        nat_gateway_fip.value = val.setting.nat_gateway_fip
    }

    onMounted(async () => {
      if (id) {
        await fetchvoucher({ id })
        await fetchVoucherDetails({id:id})
        setVoucherEdit(voucher.value)
      }
    })
    return {
      ...useCreateVoucher(props,context),
      moment,
      voucher,
      openDetail,
      root_disk_size,
      isVoucherLoading,
      voucheredit,
      name,
      description,
      quota,
      day_duration,
      expired_date,
      code,
      period,
      instance,
      cpu,
      ram,
      volume_size,
      object_volume_size,
      snapshot_size,
      total_volume,
      total_object_volume,
      total_snapshot,
      s_router,
      floating_ip,
      total_lb,
      nat_gateway,
      nat_gateway_fip,
      voucherDetails,
    };
  },
};
</script>
<style lang="scss" scoped>
.hideinput{
  ::v-deep input{
    position: relative;
    bottom:50px;
    z-index: -4;
  }
}
</style>
