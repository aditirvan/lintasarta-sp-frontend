<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text">Create Voucher Credit</div>
     
      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Type</p>
          <v-radio-group v-model="creditType" row >
            <v-radio label="One Time" :value="VoucherCreditType.ONE_TIME" class="pe-4"/>
            <v-radio label="Recurring" :value="VoucherCreditType.RECURRING"/>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Voucher Name</p>
          <v-text-field
            id="Name"
            outlined
            placeholder="Enter Voucher Name"
            single-line
            v-model="name"
            :error-messages="
              $v.name.$errors.length ? $v.name.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="creditType === VoucherCreditType.RECURRING">
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Period</p>
          <v-select
            label="Select Period"
            :items="periodOptions"
            v-model="recurringPeriod"
            item-text="text"
            :error-messages="
              $v.recurringPeriod.$errors.length ? $v.recurringPeriod.$errors[0].$message : ''
            "
            outlined>
          </v-select>
        </v-col>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Duration/Expired Date</p>
          <v-menu
            offset-y
            max-width="290px"
            min-width="auto"
            :close-on-content-click="false"
            v-model="toggleRecurringExpiredDatePicker"
          >
          <template v-slot:activator="{ on, attrs }">
              <v-text-field
                placeholder="YYYY-MM-DD"
                persistent-hint
                v-bind="attrs"
                v-on="on"
                outlined
                :value="formattedRecurringExpiredDate"
                :error-messages="
                  $v.recurringExpiredDate.$errors.length ? $v.recurringExpiredDate.$errors[0].$message : ''
                "
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="recurringExpiredDate"
              color="primary"
              no-title 
              @input="toggleRecurringExpiredDatePicker = false"
              :min="currentDate"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" class="pb-0">
          <p class="font-weight-bold">Recurring Date</p>
          <v-text-field
            type="number"
            v-model.number="recurringDate"
            outlined
            single-line
            placeholder="0"
            :error-messages="
              $v.recurringDate.$errors.length ? $v.recurringDate.$errors[0].$message : ''
            "
          ></v-text-field>
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
                depressed
                :ripple="false"
                outlined
                v-bind="attrs"
                v-on="on"
                block
                height="50"
                style="border: 1px solid #cad6e1; justify-content: left"
              >
                <v-icon class="mr-2" style="width: 16px; height: 16px">
                  $vuetify.icons.calendarIcon
                </v-icon>
                <p class="black--text mb-0 fz-14" style="font-weight: 400">
                  {{ $moment(claimPeriod.start).format("YYYY-MM-DD") }} -
                  {{ $moment(claimPeriod.end).format("YYYY-MM-DD") }}
                </p>
              </v-btn>
            </template>
            <vc-date-picker
              v-model="claimPeriod" 
              is-range 
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
          <p class="font-weight-bold">Description</p>
          <v-textarea
            id="Description"
            placeholder="Enter Description"
            outlined
            single-line
            v-model="description"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">
            Voucher Quota
            <br>
            <small style="font-weight: normal">Amount of voucher code will be generated.</small>
          </p>
          <v-text-field
            id="quota"
            type="number"
            v-model.number="quota"
            outlined
            single-line
            placeholder="0"
            :error-messages="
              $v.quota.$errors.length ? $v.quota.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <p class="font-weight-bold">
            Voucher Prefix Code
            <br>
            <small style="font-weight: normal">Generated voucher code will starts with this prefix code.</small>
          </p>
          <v-text-field
            id="Kode"
            outlined
            single-line
            placeholder="Enter Code Voucher"
            v-model="code"
            :error-messages="
              $v.code.$errors.length ? $v.code.$errors[0].$message : ''
            "
          ></v-text-field>
        </v-col>
      </v-row>
    
      <v-row>
        <v-col cols="6">
          <p class="font-weight-bold">Credit Amount</p>
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
            @click="createVoucherCredit"
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Create Voucher Credit</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { ref } from "@vue/composition-api"
import { VoucherCreditType } from "./type"
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import moment from 'moment'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";

export default {
  data: () => ({
    periodOptions: [
          { value: 1, text: 'Every 1 Month' },
          { value: 2, text: 'Every 2 Month' },
          { value: 3, text: 'Every 3 Month' },
          { value: 6, text: 'Every 6 Month' },
    ],
    VoucherCreditType
  }),
  methods:{
    ToSelectInput(){
      this.duration_input = 'select'
      this.day_duration = this.duration_options[6]
    }
  },
  setup(props,context) {

    const { addvoucherCredit } = useNamespacedActions(MANAGEVOUCHER, [
      "addvoucherCredit",
    ]);

    const currentDate = ref(moment(new Date()).format("YYYY-MM-DD"));
    const creditType = ref(VoucherCreditType.ONE_TIME)
    const name = ref("")
    const claimPeriod = ref({
      start: moment(),
      end: moment().add(30, 'd'),
    })
    const description = ref("")
    const quota = ref(0)
    const code = ref("")
    const recurringDate = ref(0)
    const recurringPeriod = ref(null)
    const recurringExpiredDate = ref("")
    const toggleRecurringExpiredDatePicker = ref(false)
    const amount = ref(0)
    
    const $v = useVuelidate(
      {
        creditType: { required },
        name: {
          required,
          minLength: minLength(5),
        },
        claimPeriod : { required },
        quota: { 
          $autoDirty: true,
          notZero: helpers.withMessage('Quota must be more than 0', (val) => {
            return val > 0
          })
        },
        code: { required },
        recurringDate: {
          required,
          $autoDirty: true,
          inRange: helpers.withMessage('Recurring date must be between 1 to 31', (val) => {
            return val >= 1 && val <= 31
          })
        }, 
        recurringPeriod: {
          $autoDirty: true,
          notNullIfSelected: helpers.withMessage('Recurring period cannot be empty', (val) => {
            return creditType.value !== VoucherCreditType.RECURRING || val !== null
          })
        },
        recurringExpiredDate: {
          $autoDirty: true,
          notNullIfSelected: helpers.withMessage('Recurring expired date cannot be empty', (val) => {
            return creditType.value !== VoucherCreditType.RECURRING || val !== ""
          })
        },  
        amount: { 
          $autoDirty: true,
          notZero: helpers.withMessage('Credit amount must be more than 0', (val) => {
            return val > 0
          })
        },
      },
      { creditType, name, claimPeriod, quota, code, recurringDate, recurringPeriod, recurringExpiredDate, amount }
    )

    const createVoucherCredit = async () => {
        $v.value.$touch()
        if($v.value.$errors.length) return
        let data = {
          name: name.value,
          recurring_date: recurringDate.value,
          description: description.value,
          claim_period_start: claimPeriod.value.start,
          claim_period_end: claimPeriod.value.end,
          code: code.value,
          quota: quota.value,
          type: creditType.value,
          amount: amount.value
        }

        if (creditType.value === VoucherCreditType.RECURRING) {
          data = {
            ...data,
            recurring_period: recurringPeriod.value,
            recurring_expired_date: moment(recurringExpiredDate.value, 'YYYY-MM-DD'),
          }
        }

        const res = await addvoucherCredit(data)
        if(res.code == 200){
            context.root.$router.replace('/manage-voucher/credit')
        }
    }
    
    return {
      $v,
      currentDate,
      creditType,
      name,
      claimPeriod,
      description,
      quota,
      code,
      recurringDate,
      recurringPeriod,
      recurringExpiredDate,
      toggleRecurringExpiredDatePicker,
      amount,

      createVoucherCredit
    };
  },
  computed: {
    formattedRecurringExpiredDate() {
      return this.recurringExpiredDate ? moment(this.recurringExpiredDate).format("YYYY-MM-DD") : null
    }
  }
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
