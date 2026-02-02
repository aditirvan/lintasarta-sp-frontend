<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container v-if="!isVoucherCreditLoading">
      <v-row>
        <v-col cols="6">
          <div class="headline font-weight-bold font--text">Detail Voucher Credit</div>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn 
            color="primary"
            style="padding:1.5rem;font-size:15px;"
            depressed
            @click="openDetail = true"
          >List of Voucher Code ({{ quota }})</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Type</p>
          <p style="text-transform: capitalize">{{ type }}</p>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">
             Name</p>
          <p>{{ name }}</p>
        </v-col>
      </v-row>

      <v-row v-if="type === VoucherCreditType.RECURRING">
        <v-col cols="6">
          <p class="font-weight-bold">Recurring Period</p>
          <p>{{ recurringPeriod }} Month</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Duration/Expired Date</p>
          <p>{{ moment(recurringExpiredDate).format('D MMMM Y') }}</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Recurring Date</p>
          <p>{{ recurringDate }}</p>
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
        <v-col cols="6">
          <p class="font-weight-bold">Code Voucher</p>
          <p>{{ code }}</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Amount</p>
          <p>Rp {{ Rpformat.format(amount) }}</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Voucher Quota</p>
          <p>{{ quota }}</p>
        </v-col>
      </v-row>
    </v-container>
    <dialogVoucherCreditDetails
      v-model="openDetail"
      :voucherType="type"
    />
  </v-card>
</template>

<script>
import { ref,onMounted } from "@vue/composition-api";
import { VoucherCreditType } from "./type"
import moment from 'moment'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
import dialogVoucherCreditDetails from './dialogVoucherCreditDetails'
import { Rpformat } from "@/lib/formatter";

export default {
  components: {
    dialogVoucherCreditDetails,
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
      fetchvoucherCredit,
    } = useNamespacedActions(MANAGEVOUCHER, [
      'fetchvoucherCredit',
    ]);

    const openDetail = ref(false)

    const { id } = context.root.$route.params

    const name = ref("")
    const description = ref("")
    const period = ref({
      start: null,
      end: null,
    })
    const quota = ref("")
    const type = ref(VoucherCreditType.ONE_TIME)
    const recurringDate = ref(0)
    const recurringPeriod = ref(0)
    const recurringExpiredDate = ref(null)
    const amount = ref(0)
    const code = ref("")

    const {
      voucherCredit,
      isVoucherCreditLoading,
    } = useNamespacedState(MANAGEVOUCHER, [
      'voucherCredit',
      'isVoucherCreditLoading'
    ]);

    const setVoucherCredit = (val) => {
      name.value = val.name
      description.value = val.description
      period.value = {
        start: val.claim_period_start,
        end: val.claim_period_end,
      }
      quota.value = val.quota
      type.value = val.type
      recurringDate.value = val.recurring_date
      if (val.type === VoucherCreditType.RECURRING) {
        recurringPeriod.value = val.recurring_period
        recurringExpiredDate.value = val.recurring_expired_date ? 
          val.recurring_expired_date : "-"
      }
      amount.value = val.amount
      code.value = val.code
    }

    onMounted(async () => {
      if (id) {
        await fetchvoucherCredit({ id })
        setVoucherCredit(voucherCredit.value)
      }
    })
    return {
      Rpformat,
      VoucherCreditType,
      openDetail,
      moment,
      name,
      description,
      period,
      quota,
      type,
      recurringDate,
      recurringPeriod,
      recurringExpiredDate,
      amount,
      code,
      isVoucherCreditLoading,
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
