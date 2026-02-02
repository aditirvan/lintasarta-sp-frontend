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
          :hide-default-footer="true"
          :headers="headers"
          :items="voucherDetails.voucher_detail"
          :items-per-page="5">
          <template v-slot:item.code="{ item }">
            {{ item.code }}
          </template>
          <template v-slot:item.name="{ item }">
            {{ item.voucher_name }}
          </template>
          <template v-slot:item.claim_period="{ item }">
            <span v-if="item.voucher_name">{{ moment(item.claim_period_start).format('D MMMM Y') }} - {{ moment(item.claim_period_end).format('D MMMM Y') }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:item.used_by="{ item }">
            {{ item.project_name ? item.project_name : '-' }}
          </template>
          <template v-slot:item.expired_at="{ item }">
            {{ item.expired_at ? moment(item.expired_at).format('D MMMM Y') : '-' }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn v-if="!item.project_name" color="primary" v-on:click="openDialogselectProject(item.code)" :disabled="read_only">Claim To Project</v-btn>
            <v-btn v-else :disabled="item.project_is_active || read_only" color="primary lighten-1" @click="openDialogIncreaseExpire(item.id, item.expired_at)">Increase expiry time</v-btn>
          </template>
        </v-data-table>
        <v-card-actions class="d-flex flex-row mt-3 pt-3 customfooter">
          <div class="px-3 rounded-lg d-flex flex-row align-center ml-3">
            <p id="Prev" class="mb-0" :class="getVoucherCodeActiveClass('prev')" v-on:click="prevVoucherPage()"> Prev </p>
            <div v-for="no in getVoucherPageList()" :key="no">
              <button
                  type="button"
                  class="mx-1 v-btn v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                  :class="`${no == voucherPage ? 'primary' : 'fa-checkbox-blank-outline'}`"
                  style="height: 25px; width: 25px; background-color: transparent;"
                  v-on:click="voucherPage = no">
                <span class="v-btn__content">{{no}}</span>
              </button>
            </div>
            <p id="Next" class="mb-0" :class="getVoucherCodeActiveClass('next')" v-on:click="nextVoucherPage()"> Next </p>
          </div>
        </v-card-actions>
      </v-card-text>
      <v-card-text>
        <v-col>
          <v-btn @click="dialog = false" block height="50" depressed class="accent">
            <span style="font-size:14px">Close</span></v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="increaseExpire" :retain-focus="false" width="300">
    <v-time-picker v-if="showExpireTime" full-width v-model="increaseExpireValueTime"></v-time-picker>
    <v-date-picker v-else v-model="increaseExpireValue" style="border-radius: 0px;" :min='moment().add(7, "days").format("YYYY-MM-DD")'/>
  </v-dialog>
  <v-dialog v-model="increaseExpireConfirm" :retain-focus="false" width="300" persistent>
    <v-container class="fill-height white">
      <v-row justify="center" class="fill-height">
          {{increaseExpireValue}} {{increaseExpireValueTime}}
      </v-row>
    </v-container>
    <v-btn class="red white--text" v-on:click="increaseExpireConfirm = false" :disabled="increaseExpireCancelDisable">Cancel</v-btn>
    <v-btn class="primary" v-on:click="SetExpiredDate" :loading="increaseExpireConfirmLoading">Confirm</v-btn>
  </v-dialog>
  <v-dialog width="800" max-height="70%" v-model="selectProject" :retain-focus="false">
  <v-card flat class="rounded-lg">
      <v-card-title class="pt-0 pb-0">
        <v-row>
          <v-col cols="8">
            <div class="headline font-weight-bold font--text">
              Select Project
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div style="max-width: 775px; padding-left: 25px; padding-bottom: 15px">
        <v-text-field
          maxlength="50"
          placeholder="Find Project Name"
          prepend-inner-icon="mdi-magnify"
          single-line
          outlined
          v-model="searchProjectValue">
        </v-text-field>
      </div>

      <v-card-text>
        <v-simple-table
          :headers="headersProject"
          :items="getAllProject"
          :hide-default-footer="true"
          height="290"
        >

        <template>
            <thead>
              <tr>
                <th class="text-left">
                  Organization
                </th>
                <th class="text-left">
                  Project
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in getAllProject" :key="item.id">
                <td>
                <v-icon left>$vuetify.icons.gg_organizationIcon</v-icon>
                <span>{{item.organization_name}}</span>
              </td>
              <td>
                <div class="d-flex">
                  <v-icon left>$vuetify.icons.targetIcon</v-icon>
                  <div
                    class="linkpointer"
                    @click=" () => {ClaimVoucher (item.id, item.organization_id)}">
                    {{item.name}}
                  </div>
                </div>
              </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-card-actions class="d-flex flex-row justify-end mt-3 pt-3 customfooter">
          <v-spacer></v-spacer>
          <v-select 
            :items="limits"
            v-model="limit"
            persistent-hint
            outlined class="v-input rounded-lg flex-grow-0 selectFooter v-input--hide-details v-input--is-label-active v-input--is-dirty v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined v-select" style="width:130px">
            <template v-slot:selection="{ item }">
              1 - {{item}} of {{`${getAllProjectPaginate ? getAllProjectPaginate.total_data : 0}`}}
            </template>
            <template v-slot:item="{ item }">
              {{item}}
            </template>
            </v-select>
          <!-- TODO: next using data table -->
          <div class="px-3 rounded-lg d-flex flex-row align-center ml-3" style="border: 1px solid rgb(202, 214, 225);padding: 6px;">
            <p id="Prev" class="mb-0" :class="getActiveClass('prev')" v-on:click="prevPage()"> Prev </p>
            <div v-for="no in getPageList()" :key="no">
              <button
                type="button"
                class="mx-1 v-btn v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--small"
                :class="`${no == page ? 'primary' : 'fa-checkbox-blank-outline'}`"
                style="height: 25px; width: 25px; background-color: transparent;"
                v-on:click="page = no">
                <span class="v-btn__content">{{no}}</span>
              </button>
            </div>
            <p id="Next" class="mb-0" :class="getActiveClass('next')" v-on:click="nextPage()"> Next </p>
          </div>
        </v-card-actions>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
  </div>
</template>
<script>
import { ref, watch } from '@vue/composition-api'
import { useDialog } from '@/composable/usedialog'
import { PROJECT } from "../project/namespace";
import { VOUCHER } from "../voucher/namespace";
import { MANAGEVOUCHER } from "../superadmin-managevoucher/namespace";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default
import moment from 'moment'
import { AccessControl } from "@/lib/middleware";

export default {
  props: ['value', 'voucherDetails'],
  data() {
    return {
      headersProject: [
        { text: "Organization", value: "organizationName", sortable: false },
        { text: "Project", value: "projectName", sortable: false },
      ],
      limits: [
        // TODO: next using data table
        2, 10, 20, 50, 100
      ]
    };
  },
  methods :{
    rangeCostume : function(start, stop, step = 1) {
      // TODO: next using data table
      return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
    },
    getActiveClass : function(val){
      // TODO: next using data table
      if (!this.getAllProjectPaginate){
        return ''
      }
      if (val == 'next' && this.getAllProjectPaginate.next_page) return 'linkpointer'
      if (val == 'prev' && this.getAllProjectPaginate.prev_page) return 'linkpointer'
    },
    getVoucherCodeActiveClass : function(val){
      // TODO: next using data table
      if (!this.voucherDetails.pagination){
        return ''
      }
      if (val === 'next' && this.voucherDetails.pagination.page < this.voucherDetails.pagination.totalpage) return 'linkpointer'
      if (val === 'prev' && this.voucherDetails.pagination.page !== 1 && this.voucherDetails.pagination.page > 1) return 'linkpointer'
    },
    nextPage: function(){
      // TODO: next using data table
      this.page = this.getAllProjectPaginate.next_page === null ? this.getAllProjectPaginate.total_page : this.getAllProjectPaginate.next_page
    },
    prevPage: function(){
      // TODO: next using data table
      this.page = this.getAllProjectPaginate.prev_page === 0 ? 1 : this.getAllProjectPaginate.prev_page
    },
    nextVoucherPage: function(){
      // TODO: next using data table
      this.voucherPage =  this.voucherDetails.pagination.page+1 <= this.voucherDetails.pagination.totalpage ? this.voucherDetails.pagination.page+1 : this.voucherDetails.pagination.totalpage
    },
    prevVoucherPage: function(){
      // TODO: next using data table
      this.voucherPage =  this.voucherDetails.pagination.page-1 > 1 ? this.voucherDetails.pagination.page-1 : 1
    },
    getPageList: function(){
      // TODO: next using data table 🙏
      if (!this.getAllProjectPaginate){return[1]}
      let pages = [1]
      let max_paginate = 4
      let halfList = max_paginate/2;
      let start = parseInt(this.getAllProjectPaginate.page - (halfList/2)) <= 0 ? 1 : parseInt(this.getAllProjectPaginate.page - (halfList/2));
      let total_page = this.getAllProjectPaginate.total_page;
      for (let i = start, x = 1; i < total_page; i++, x++) {
        if (x >= max_paginate){
          break
        }
        if(!pages.includes(i)){
          pages.push(i)
        }
      }
      if (!pages.includes(total_page) && this.getAllProjectPaginate.page <= total_page){
        pages.push(total_page)
      }
      return pages;
    },
    getVoucherPageList: function(){
      // TODO: next using data table 🙏
      if (!this.voucherDetails.pagination || !this.voucherDetails.pagination.totalpage){return[1]}
      let pages = [1]
      let max_paginate = 4
      let halfList = max_paginate/2;
      let start = parseInt(this.voucherDetails.pagination.page - (halfList/2)) <= 0 ? 1 : parseInt(this.voucherDetails.pagination.page - (halfList/2));
      let total_page = this.voucherDetails.pagination.totalpage;
      for (let i = start, x = 1; i < total_page; i++, x++) {
        if (x >= max_paginate){
          break
        }
        if(!pages.includes(i)){
          pages.push(i)
        }
      }
      if (!pages.includes(total_page) && this.voucherDetails.pagination.page <= total_page){
        pages.push(total_page)
      }
      return pages;
    }
  },
  setup(props, { emit, root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Voucher'));
    const { dialog, showCommonDialogSuccess, showCommonDialogWarning } = useDialog(props, {emit, root})
    const { getAllProject, getAllProjectPaginate } = useNamespacedGetters(PROJECT, ["getAllProject", "getAllProjectPaginate"]);
    const { fetchAllProjects } = useNamespacedActions(PROJECT, ["fetchAllProjects"]);
    const { adminClaimVoucher } = useNamespacedActions(VOUCHER, ["adminClaimVoucher"]);
    const { fetchVoucherDetails, updateVoucherDetail } = useNamespacedActions(MANAGEVOUCHER, ['fetchVoucherDetails', 'updateVoucherDetail']);
    const { vouchers, pagination } = useNamespacedState(MANAGEVOUCHER, ["vouchers", "pagination"]);

    const headers = [
        { text: "Code", value: "code" },
        { text: "Voucher Name", value: "name" },
        { text: "Claim Period", value: "claim_period" },
        { text: "Used By", value: "used_by" },
        { text: "Expired At", value: "expired_at" },
        { text: "Action", value: "action" },
    ]

    const { id } = root.$route.params
    const selectProject = ref(false)
    const increaseExpire = ref(false)
    const showExpireTime = ref(false)
    const increaseExpireConfirm = ref(false)
    const increaseExpireCancelDisable = ref(false)
    const increaseExpireConfirmLoading = ref(false)
    const increaseExpireValue = ref(moment().format("YYYY-MM-DD"))
    const increaseExpireValueTime = ref("")
    const page = ref(1)
    const voucherPage = ref(1)
    const limit = ref(10)
    const selectedVoucher = ref("")
    const selectedVoucherId = ref("")
    const searchProjectValue = ref("")

    const CancelClaimToProject = () => {
      selectProject.value = false
    }

    const clearProjectSearch = () => {
      searchProjectValue.value = null
      page.value = 0
      fetchAllProjects()
    }

    const openDialogselectProject = (code) => {
      selectProject.value = true
      selectedVoucher.value = code
      fetchAllProjects()
    }

    const openDialogIncreaseExpire = (voucher_id, expired_at) => {
      increaseExpire.value = true
      increaseExpireCancelDisable.value = false
      selectedVoucherId.value = voucher_id
      showExpireTime.value = false
    }

    const ClaimVoucher = (project_id, organization_id) => {
      adminClaimVoucher({
        "organization_id": organization_id,
        "project_id": project_id,
        "code": selectedVoucher.value
      }).then((_) => {
        selectProject.value = false
        fetchVoucherDetails({id:id})
      })
    }

    const SetExpiredDate = () => {
      increaseExpireConfirmLoading.value = true
      increaseExpireCancelDisable.value = true

      let formatedTime = new Date(`${increaseExpireValue.value} ${increaseExpireValueTime.value}`);
      showExpireTime.value = false
      updateVoucherDetail({id:selectedVoucherId.value, expired_at:formatedTime.toISOString()}).then((_)=>{
        increaseExpireConfirmLoading.value = false
        increaseExpireConfirm.value = false
        fetchVoucherDetails({id:id})
      })
    }

    watch(searchProjectValue, (val) => {
      if (val === "") {
        clearProjectSearch()
        return
      }
      fetchAllProjects({name: val})
      page.value = 0
    })

    watch(page, (val)=>{
      if (val){
        let payload = {page: val, name: null, limit: limit.value}
        if (searchProjectValue.value != null || searchProjectValue.value === ""){
          payload.name = searchProjectValue.value
        }
        fetchAllProjects(payload)
      }
    })

    watch(voucherPage, (_)=>{
      if (voucherPage){
        fetchVoucherDetails({id:id, page:voucherPage.value})
      }
    })

    watch(limit, (val)=>{
      let payload = {name: null, limit: val}
      if (searchProjectValue.value != null || searchProjectValue.value == ""){
        payload.name = searchProjectValue.value
      }
      fetchAllProjects(payload)
    })

    watch(increaseExpireValue, (_) => {
      showExpireTime.value = true
    })

    watch(increaseExpireValueTime, (val) => {
      increaseExpireConfirm.value = true
      increaseExpire.value = false
    })

    return {
      read_only,
      CancelClaimToProject,
      openDialogselectProject,
      openDialogIncreaseExpire,
      ClaimVoucher,
      SetExpiredDate,
      showExpireTime,
      increaseExpireConfirmLoading,
      increaseExpireCancelDisable,
      page,
      voucherPage,
      limit,
      vouchers,
      pagination,
      getAllProject,
      getAllProjectPaginate,
      selectedVoucher,
      searchProjectValue,
      selectProject,
      increaseExpire,
      increaseExpireConfirm,
      increaseExpireValue,
      increaseExpireValueTime,
      headers,
      dialog,
      prevent: ref(false),
      moment,
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