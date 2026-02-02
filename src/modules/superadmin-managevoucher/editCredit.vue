<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container v-if="!isVoucherCreditLoading">
      <v-row>
        <v-col cols="6">
          <div class="headline font-weight-bold font--text">Edit Voucher Credit</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Type</p>
          <p style="text-transform: capitalize">{{ type }}</p>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Name</p>
          <p style="text-transform: capitalize">{{ name }}</p>
        </v-col>
      </v-row>

      <v-row v-if="type === VoucherCreditType.RECURRING">
        <v-col cols="6">
          <p class="font-weight-bold">Recurring Period</p>
          <p>{{ recurringPeriod }} Month</p>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Duration/Expired Date</p>
          <v-text-field
            outlined
            :value="recurringExpiredDate"
            :disabled="true"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Recurring Date</p>
          <p>{{ recurringDate }}</p>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Claim Period</p>
          <v-menu
            offset-y
            :max-width="258"
            :close-on-click="true"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
              :disabled="true"
                depressed
                :ripple="false"
                outlined
                v-bind="attrs"
                v-on="on"
                block
                height="50"
                style="border: 1px solid #cad6e1; justify-content: left"
              >
                <v-icon class="mr-2" style="width: 16px; height: 16px"
                  >$vuetify.icons.calendarIcon</v-icon
                >
                <p class="grey--text mb-0 fz-14" style="font-weight: 400">
                  {{ $moment(period.start).format("YYYY-MM-DD") }} -
                  {{ $moment(period.end).format("YYYY-MM-DD") }}
                </p>
              </v-btn>
            </template>
            <vc-date-picker
              v-model="period" 
              is-range 
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Description</p>
          <v-textarea
            id="Description"
            placeholder="Enter Description"
            outlined
            single-line
            v-model="description"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Code Voucher</p>
          <v-text-field
            :disabled="true"
            v-model="code"
            outlined
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Amount</p>
          <v-text-field
            type="number"
            v-model.number="amount"
            outlined
            single-line
            placeholder="0"
            :error-messages="
              $v.amount.$errors.length ? $v.amount.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">Voucher Quota</p>
          <v-text-field
            :disabled="true"
            v-model.number="quota"
            outlined
            single-line
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            height="58"
            depressed
            block
            color="accent"
            to="/manage-voucher/credit"
            exact
          >
            <span style="font-size: 16px"> Cancel</span>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            @click="editVoucherCredit"
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Save </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <dialogVoucherCreditDetails
      v-model="openDetail"
    />
  </v-card>
</template>

<script>
import { ref,onMounted } from "@vue/composition-api";
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
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
      fetchvoucherCredit, updateVoucherCredit
    } = useNamespacedActions(MANAGEVOUCHER, [
      'fetchvoucherCredit', 'updateVoucherCredit'
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
    const recurringExpiredDate = ref("")
    const amount = ref(0)
    const code = ref("")

    const {
      voucherCredit,
      isVoucherCreditLoading,
    } = useNamespacedState(MANAGEVOUCHER, [
      "voucherCredit",
      'isVoucherCreditLoading'
    ]);

    const $v = useVuelidate(
      {
        amount: { 
          $autoDirty: true,
          notZero: helpers.withMessage('Credit amount must be more than 0', (val) => {
            return val > 0
          })
        },
      },
      { amount }
    )

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
          moment(val.recurring_expired_date).format("YYYY-MM-DD") : "-"
      }
      amount.value = val.amount
      code.value = val.code
    }

    const editVoucherCredit = async () => {
      $v.value.$touch()
      if($v.value.$errors.length) return
      let data = {
        id: id,
        description: description.value,
        amount: amount.value
      }

      const res = await updateVoucherCredit(data)
      if(res.code == 200){
          context.root.$router.replace('/manage-voucher/credit')
      }
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
      editVoucherCredit,
      $v
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
