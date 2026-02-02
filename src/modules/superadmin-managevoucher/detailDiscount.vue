<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container v-if="!isVoucherDiscountLoading">
      <v-row>
        <v-col cols="6">
          <div class="headline font-weight-bold font--text">Detail Voucher Discount</div>
        </v-col>
      </v-row>

      <div v-if="voucherDiscountType === VoucherDiscountType.INTERNAL">
        <v-row>
          <v-col cols="6" class="pb-0">
            <p class="font-weight-bold">Type</p>
            <p style="text-transform: capitalize">{{ voucherDiscountType }}</p>
          </v-col>
          <v-col cols="6" class="pb-0">
            <p class="font-weight-bold">Code</p>
            <p >{{ code }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold">Name</p>
            <p>{{ name }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">Quota</p>
            <p>{{ quota ? quota : '-' }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold">Sales Name</p>
            <p>{{ salesName }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">Expired Period</p>
            <p>{{ expiredPeriod }} months</p>
          </v-col>
        </v-row>
      </div>
      

      <div v-if="voucherDiscountType === VoucherDiscountType.RESELLER">
        <v-row>
          <v-col cols="6" class="pb-0">
            <p class="font-weight-bold">Type</p>
            <p style="text-transform: capitalize">{{ voucherDiscountType }}</p>
          </v-col>
          <v-col cols="6" class="pb-0">
            <p class="font-weight-bold">Code</p>
            <p >{{ code }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold">Name</p>
            <p>{{ name }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">Quota</p>
            <p>{{ quota ? quota : '-' }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold">Sales Name</p>
            <p>{{ salesName }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">Expired Period</p>
            <p>{{ expiredPeriod }} months</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold">Limit Discount</p>
            <p>{{ limitDiscount }}</p>
          </v-col>
        </v-row>
      </div>

      <v-divider />

      <p class="headline font-weight-bold font--text pt-8">Services Discount</p>
      
      <v-card-text>
        <v-data-table
          hide-default-header
          hide-default-footer
          :headers="discountHeader"
          :items="discountItems"
        >
          <template v-slot:header="{ props, on }">
            <v-data-table-header
              v-on="on"
              v-bind="props"
              sort-icon="mdi-menu-down"
            >
            </v-data-table-header>
          </template>
          <template v-slot:item.name="{ item }">
            <div>
              {{item.name}}
            </div>
          </template>
          <template v-slot:item.percentage="{ item }">
            <div v-if="item.name !== 'Instance Flavor'">
              {{item.percentage}}%
            </div>
            <div v-else>
              <v-btn
                style="min-width:0; padding:0; font-size:14px"
                color="primary"
                plain
                @click="() => { openDialogFlavorsDetail = true }"
              >
                Detail
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>

      <v-divider />

      <v-row class="align-center justify-space-between px-4 pt-4">
        <div class="headline font-weight-bold font--text">List of Project</div>
        <v-btn
            @click="() => {
              openDialogSelectProject = true
            }"
            depressed
            outlined
            height="55"
            width="150"
            class="secondary white--text"
          >
            Add
        </v-btn>
      </v-row>
      
      <v-card-text>
        <v-data-table
          hide-default-header
          hide-default-footer
          :items-per-page="10"
          :server-items-length="voucherDiscountProjectPagination.count"
          :options.sync="options"
          :headers="voucherDiscountProjectHeader"
          :items="voucherDiscountProjects"
        >
          <template v-slot:header="{ props, on }">
            <v-data-table-header
              v-on="on"
              v-bind="props"
              sort-icon="mdi-menu-down"
            >
            </v-data-table-header>
          </template>
          <template v-slot:item.claimed_at="{ item }">
            <div>
              {{ moment(item.claimed_at).format('DD/MM/YYYY')}}
            </div>
          </template>
          <template v-slot:item.project_name="{ item }">
            <div>
              {{item.project_name}}
              <span v-if="item.deleted_at" class="error--text"> (Deleted) </span>
            </div>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex justify-center">
              <!-- edit -->
              <v-btn
              text
              :class="item.deleted_at ? 'grey--text' : 'primary--text'"
              :style="item.deleted_at ? 'pointer-events: none' : ''"
              @click="() => {
                editDiscountProject(item.organization_id, item.project_id)
              }"
              >
                Edit
              </v-btn>
              <!-- delete -->
              <v-btn
                text
                :class="item.deleted_at ? 'ml-1 grey--text' : 'ml-1 error--text'"
                :style="item.deleted_at ? 'pointer-events: none' : ''"
                @click="
                  () => {
                    selectedProject = item;
                    openDialogDeleteVoucherDiscountProject = true;
                  }
                "
                style="cursor: pointer"
              >
                Delete
              </v-btn>
            </div>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  options = { ...options, ...val };
                }
              "
              :hidden="true"
              :props="props"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-row class="justify-end">
        <v-col cols="6">
          <v-btn
            height="58"
            depressed
            block
            to="/manage-voucher/discount"
            color="secondary"
          >
            <span style="font-size: 16px"> Back </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <dialogDiscountFlavorsDetail
      v-if="openDialogFlavorsDetail"
      v-model="openDialogFlavorsDetail"
      :flavors="discountInstanceFlavors"
    />

    <dialogDeleteVoucherDiscountProject
      v-if="openDialogDeleteVoucherDiscountProject"
      v-model="openDialogDeleteVoucherDiscountProject"
      @confirm="doDeleteVoucherDiscountProject"
      :selectedProject="selectedProject"
    />

    <dialogSelectMultiProject
      v-if="openDialogSelectProject"
      v-model="openDialogSelectProject"
      excludePostpaidType="fixed"
      @onSelectProjects="doClaimVoucherDiscountProject"
    />
  </v-card>
</template>

<script>
import moment from 'moment'
import { ref, onMounted, watch } from "@vue/composition-api";
import { VoucherDiscountType, VoucherDiscountDetailType } from "./type"
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
import { Rpformat,toThousands } from "@/lib/formatter";
import { SUPERADMIN } from "../superadmin/namespace";
import dialogDiscountFlavorsDetail from "./dialogDiscountFlavorsDetail";
import dialogDeleteVoucherDiscountProject from "./dialogDeleteVoucherDiscountProject";
import dialogSelectMultiProject from "../superadmin/dialogSelectMultiProject";

export default {
  components: { 
    dialogDiscountFlavorsDetail,
    dialogDeleteVoucherDiscountProject, 
    dialogSelectMultiProject 
  },
  setup(props, context) {
    const { id } = context.root.$route.params

    const { fetchVoucherDiscount, fetchVoucherDiscountProjects, claimVoucherDiscountProject, deleteVoucherDiscountProject } = useNamespacedActions(MANAGEVOUCHER, [
      'fetchVoucherDiscount', 'fetchVoucherDiscountProjects', 'claimVoucherDiscountProject', 'deleteVoucherDiscountProject',
    ]);

    const { voucherDiscount, voucherDiscountProjects, voucherDiscountProjectPagination, isVoucherDiscountLoading } = useNamespacedState(MANAGEVOUCHER, [
      'voucherDiscount', 'voucherDiscountProjects', 'voucherDiscountProjectPagination', 'isVoucherDiscountLoading'
    ]);

    const { fetchprojectwithorganization } = useNamespacedActions(SUPERADMIN, [
      "fetchprojectwithorganization"
    ]);

    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      SUPERADMIN,
      ["setCurrentOrg", "setCurrentProj"]
    );

    const code = ref("")
    const voucherDiscountType = ref(VoucherDiscountType.INTERNAL)
    const salesName = ref("")
    const name = ref("")
    const limitDiscount = ref(0)
    const quota = ref(null)
    const expiredPeriod = ref(0)

    const voucherDiscountDetailType = ref(VoucherDiscountDetailType.INSTANCE_BASED)
    const discountInstanceBased = ref(0)
    const discountRootDisk = ref(0)
    const discountOSCharging = ref(0)
    const discountStorage = ref(0)
    const discountObjectStorage = ref(0)
    const discountFloatingIP = ref(0)
    const discountSnapshot = ref(0)
    const discountInstanceFlavors = ref(0)

    const discountItems = ref([]);

    const selectedProject = ref(null)

    const openDialogSelectProject = ref(false)

    const discountHeader = ref([
      { text: "Service Name", value: "name" },
      { text: "Percentage", value: "percentage" },
    ]);

    const voucherDiscountProjectHeader = ref([
      { text: "Claimed At", value: "claimed_at"},
      { text: "Project Name", value: "project_name" },
      { text: "Action", value: "action",  align: 'center' },
    ]);

    const setVoucherDiscount = (val) => {
      code.value = val.code
      voucherDiscountType.value = val.type
      salesName.value = val.sales.fullname
      name.value = val.name
      limitDiscount.value = val.limit_discount
      quota.value = val.quota
      expiredPeriod.value = val.expired_period
      voucherDiscountDetailType.value = val.voucher_discount_detail.type
      discountInstanceBased.value = val.voucher_discount_detail.instance_based
      discountRootDisk.value = val.voucher_discount_detail.root_disk
      discountOSCharging.value = val.voucher_discount_detail.os_charging
      discountStorage.value = val.voucher_discount_detail.storage
      discountObjectStorage.value = val.voucher_discount_detail.object_storage
      discountFloatingIP.value = val.voucher_discount_detail.floating_ip
      discountSnapshot.value = val.voucher_discount_detail.snapshot
      discountInstanceFlavors.value = val.voucher_discount_detail.instance_flavors

      discountItems.value = val.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED ? [
        { name: "Instance Based", percentage: val.voucher_discount_detail.instance_based },
        { name: "Root Disk", percentage: val.voucher_discount_detail.root_disk },
        { name: "OS Charging", percentage: val.voucher_discount_detail.os_charging },
        { name: "Storage", percentage: val.voucher_discount_detail.storage },
        { name: "Object Storage", percentage: val.voucher_discount_detail.object_storage },
        { name: "Floating IP", percentage: val.voucher_discount_detail.floating_ip },
        { name: "Snapshot", percentage: val.voucher_discount_detail.snapshot }
      ] : [
        { name: "Instance Flavor", percentage: val.voucher_discount_detail.instance_flavor },
        { name: "Root Disk", percentage: val.voucher_discount_detail.root_disk },
        { name: "OS Charging", percentage: val.voucher_discount_detail.os_charging },
        { name: "Storage", percentage: val.voucher_discount_detail.storage },
        { name: "Object Storage", percentage: val.voucher_discount_detail.object_storage },
        { name: "Floating IP", percentage: val.voucher_discount_detail.floating_ip },
        { name: "Snapshot", percentage: val.voucher_discount_detail.snapshot }
      ]
    }

    const doClaimVoucherDiscountProject = async (userSelection) => {
      const data = {
        voucher_discount_id: id,
      }

      if (userSelection.paymentMethod) data["by_payment_method"] = userSelection.paymentMethod
      else if (userSelection.projectIds) data["by_project_ids"] = userSelection.projectIds
      else return

      const res = await claimVoucherDiscountProject(data)
      if(res && res.code == 200){
        await fetchVoucherDiscountProjects({voucherDiscountID: id})
      }
      
      openDialogSelectProject.value = false
    }

    const doDeleteVoucherDiscountProject = async () => {
      await deleteVoucherDiscountProject(selectedProject.value.id)
      fetchVoucherDiscountProjects({voucherDiscountID: id})
    }

    const editDiscountProject = async (orgId, projId) => {
      const res = await fetchprojectwithorganization(projId)
      if (res.status !== 200) return
      const { organization, project } = res.data.data
      setCurrentOrg(organization);
      setCurrentProj(project);
      context.root.$router
        .replace(`/organization-detail/${orgId}/project/${projId}/edit`)
        .catch(() => {});
    }

    const options = ref({ voucherDiscountID: id, page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    const loading = ref(false);

    // watch voucher discount
    watch(
      options,
      async (val) => {
        loading.value = true;
        try {
          await fetchVoucherDiscountProjects(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );

    onMounted(async () => {
      if (id) {
        fetchVoucherDiscountProjects( options.value )
        await fetchVoucherDiscount( id )
        setVoucherDiscount(voucherDiscount.value)
      }
    })

    return {
      moment,
      Rpformat,
      toThousands,
      VoucherDiscountType,
      VoucherDiscountDetailType,
      doClaimVoucherDiscountProject,
      doDeleteVoucherDiscountProject,
      openDialogFlavorsDetail: ref(false),
      openDialogDeleteVoucherDiscountProject: ref(false),
      openDialogSelectProject,

      isVoucherDiscountLoading,

      id,
      code,
      voucherDiscountType,
      salesName,
      name,
      limitDiscount,
      quota,
      expiredPeriod,

      voucherDiscountDetailType,
      discountInstanceBased,
      discountRootDisk,
      discountOSCharging,
      discountStorage,
      discountObjectStorage,
      discountFloatingIP,
      discountSnapshot,
      discountInstanceFlavors,

      discountItems,
      options,
      voucherDiscountProjects,
      voucherDiscountProjectPagination,

      discountHeader,
      voucherDiscountProjectHeader,

      selectedProject,
      editDiscountProject,
    };
  },
};
</script>
