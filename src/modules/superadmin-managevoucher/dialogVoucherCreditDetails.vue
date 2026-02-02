<template>
  <div max-width="1000">
  <v-dialog v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">List of Voucher Code</div>
      </v-card-text>
      <v-card-text>
        <v-data-table
          class="elevation-0"
          hide-default-footer
          :headers="voucherType === VoucherCreditType.ONE_TIME ? headersOneTime : headersRecurring"
          :items="voucherCreditDetails"
          :items-per-page="voucherCreditDetailOptions.itemPerPage"
          :server-items-length="voucherCreditDetailPagination.count"
          :options.sync="voucherCreditDetailOptions"
        >
          <template v-slot:item.code="{ item }">
            {{ item.code }}
          </template>
          <template v-slot:item.project_name="{ item }">
            {{ item.project_name ? item.project_name : '-' }}
          </template>
          <template v-slot:item.status="{ item }">
            {{ item.status ? item.status : '-' }}
          </template>
          <template v-slot:item.claimed_at="{ item }">
            {{ item.claimed_at ? moment(item.claimed_at).format('D MMMM Y') : '-' }}
          </template>
          <template v-slot:item.next_disbursement_date="{ item }">
            {{ item.next_disbursement_date ? moment(item.next_disbursement_date).format('D MMMM Y') : '-' }}
          </template>
          <template v-if="voucherType === VoucherCreditType.RECURRING" v-slot:item.recurring_expired_date="{ item }">
            {{ item.recurring_expired_date ? moment(item.recurring_expired_date).format('D MMMM Y') : '-' }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn v-if="!item.claimed_at" 
            color="primary" 
            width="110" 
            :disabled="read_only"
            v-on:click="() => {
              selectedVoucher = item;
              openDialogSelectProject = true;
            }">
              Claim To Project
            </v-btn>
            <v-btn v-else-if="voucherType === VoucherCreditType.RECURRING && item.status === VoucherCreditDetailStatus.AVAILABLE"
              color="error"
              width="110" 
              :disabled="read_only"
              v-on:click="() => {
                selectedVoucher = item;
                openDialogDisableVoucherCreditDetail = true;
              }"
              >
              Disable Voucher
            </v-btn>
            <v-btn v-else-if="voucherType === VoucherCreditType.RECURRING && item.status === VoucherCreditDetailStatus.UNAVAILABLE"
              color="success" 
              width="110" 
              :disabled="read_only"
              v-on:click="() => {
                selectedVoucher = item;
                openDialogEnableVoucherCreditDetail = true;
              }"
              >
              Enable Voucher
            </v-btn>

            <v-btn v-if="item.status !== VoucherCreditDetailStatus.CREATED" 
            :disabled="(item.status !== VoucherCreditDetailStatus.AVAILABLE && item.status !== VoucherCreditDetailStatus.UNAVAILABLE) || read_only"
            color="error" 
            width="110"
            class="ml-2"
            v-on:click="() => {
              selectedVoucher = item;
              openDialogRevokeVoucherCreditDetail = true;
            }">
              Revoke
            </v-btn>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  voucherCreditDetailOptions = { ...voucherCreditDetailOptions, ...val };
                }
              "
              :hidden="true"
              :props="props"
            />
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-text>
        <v-col>
          <v-btn @click="dialog = false" block height="50" depressed class="accent">
            <span style="font-size:14px">Close</span></v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
  
  <dialogEnableVoucherCreditDetail
    v-if="openDialogEnableVoucherCreditDetail"
    v-model="openDialogEnableVoucherCreditDetail"
    @confirm="doEnableVoucherCreditDetail"
    :selectedVoucher="selectedVoucher"
  />

  <dialogDisableVoucherCreditDetail
    v-if="openDialogDisableVoucherCreditDetail"
    v-model="openDialogDisableVoucherCreditDetail"
    @confirm="doDisableVoucherCreditDetail"
    :selectedVoucher="selectedVoucher"
  />

  <dialogRevokeVoucherCreditDetail
    v-if="openDialogRevokeVoucherCreditDetail"
    v-model="openDialogRevokeVoucherCreditDetail"
    @confirm="doRevokeVoucherCreditDetail"
    :selectedVoucher="selectedVoucher"
  />

  <dialogSelectProject
    v-if="openDialogSelectProject"
    v-model="openDialogSelectProject"
    @setProject="doClaimVoucherCredit"
  />

  </div>
</template>
<script>
import moment from 'moment'
import { ref, watch } from '@vue/composition-api'
import { useDialog } from '@/composable/usedialog'
import { VoucherCreditType, VoucherCreditDetailStatus } from './type'
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import dialogEnableVoucherCreditDetail from './dialogEnableVoucherCreditDetail'
import dialogDisableVoucherCreditDetail from './dialogDisableVoucherCreditDetail'
import dialogRevokeVoucherCreditDetail from './dialogRevokeVoucherCreditDetail'
import { AccessControl } from "@/lib/middleware";
import dialogSelectProject from "../superadmin/dialogSelectProject";

export default {
  components: {
    dialogEnableVoucherCreditDetail,
    dialogDisableVoucherCreditDetail,
    dialogRevokeVoucherCreditDetail,
    dialogSelectProject
  },
  props: ['value', 'voucherType'],
  setup(props, { emit, root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Voucher'));
    const { id } = root.$route.params
    const { dialog } = useDialog(props, {emit, root})
    
    const { fetchVoucherCreditDetails, claimVoucherCredit, enableVoucherCredit, disableVoucherCredit, revokeVoucherCredit } = useNamespacedActions(MANAGEVOUCHER, 
    ['fetchVoucherCreditDetails', 'claimVoucherCredit', 'enableVoucherCredit', 'disableVoucherCredit', 'revokeVoucherCredit']);

    const { voucherCreditDetails, voucherCreditDetailPagination } = useNamespacedState(MANAGEVOUCHER, 
    ["voucherCreditDetails", "voucherCreditDetailPagination"]);

    const voucherCreditDetailOptions = ref({ id: id, page: 1, itemsPerPage: 5 });

    watch(
      voucherCreditDetailOptions,
      async (val) => {
        await fetchVoucherCreditDetails(val);
      },
      { deep: true }
    )

    const headersOneTime = [
        { text: "Code", value: "code" },
        { text: "Used By", value: "project_name" },
        { text: "Status", value: "status" },
        { text: "Claimed At", value: "claimed_at" },
        { text: "Disburse At", value: "next_disbursement_date" },
        { text: "Action", value: "action", align: "center" },
    ]

    const headersRecurring = [
        { text: "Code", value: "code" },
        { text: "Used By", value: "project_name" },
        { text: "Status", value: "status" },
        { text: "Claimed At", value: "claimed_at" },
        { text: "Disburse At", value: "next_disbursement_date" },
        { text: "Expired At", value: "recurring_expired_date" },
        { text: "Action", value: "action", align: "center" },
    ]
    
    const openDialogSelectProject = ref(false)
    const selectedVoucher = ref({})

    const doClaimVoucherCredit = async (orgproject) => {
      const res = await claimVoucherCredit({
        "organization_id": orgproject.org_id,
        "project_id": orgproject.project_id,
        "code": selectedVoucher.value.code
      })
      if(res && res.code == 200) {
        openDialogSelectProject.value = false
        fetchVoucherCreditDetails(voucherCreditDetailOptions.value)
      }
    }

    const doEnableVoucherCreditDetail = async () => {
      const { id } = selectedVoucher.value
      const res = await enableVoucherCredit(id)
      if(res.status == 200) {
        fetchVoucherCreditDetails(voucherCreditDetailOptions.value)
      }
    }

    const doDisableVoucherCreditDetail = async () => {
      const { id } = selectedVoucher.value
      const res = await disableVoucherCredit(id)
      if(res.status == 200) {
        fetchVoucherCreditDetails(voucherCreditDetailOptions.value)
      }
    }

    const doRevokeVoucherCreditDetail = async () => {
      const { code } = selectedVoucher.value
      const res = await revokeVoucherCredit(code)
      if(res.status == 200) {
        fetchVoucherCreditDetails(voucherCreditDetailOptions.value)
      }
    }

    return {
      read_only,
      VoucherCreditType,
      VoucherCreditDetailStatus,
      doEnableVoucherCreditDetail,
      doDisableVoucherCreditDetail,
      doRevokeVoucherCreditDetail,
      openDialogEnableVoucherCreditDetail: ref(false),
      openDialogDisableVoucherCreditDetail: ref(false),
      openDialogRevokeVoucherCreditDetail: ref(false),
      openDialogSelectProject,
      voucherCreditDetails,
      doClaimVoucherCredit,
      selectedVoucher,
      headersOneTime,
      headersRecurring,
      dialog,
      voucherCreditDetailOptions,
      voucherCreditDetailPagination,
      moment
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.hideinput{
  ::v-deep input{
    position: relative;
    bottom:50px;
    z-index: -2;
  }
}
</style>