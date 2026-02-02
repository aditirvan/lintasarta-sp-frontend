<template>
  <v-card flat class="rounded-lg mt-3 pa-4">
    <v-card-text
      class="headline font-weight-bold font--text d-flex align-center"
      >Manual Payment
      <v-spacer />
      <v-text-field
        maxlength="50"
        hide-details
        outlined
        class="mr-3"
        style="max-width: 300px"
        placeholder="Search"
        v-model="search"
      />
      <v-btn
        id="create-manual-payment"
        depressed
        height="50"
        class="secondary"
        @click="modal.add = true"
        v-if="!read_only"
      >
        Create Manual Payment
      </v-btn>
    </v-card-text>
    <v-card-text>
      <v-data-table
        id="my-table"
        :headers="headers"
        hide-default-header
        hide-default-footer
        :search="search"
        :items-per-page="10"
        :items="getManualPayment"
        :server-items-length="pagination.count"
        :options.sync="options"
      >
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          >
          </v-data-table-header>
        </template>
        <template #[`item.organization_name`]="{ item }">
          <div class="min-150">
            {{ item.organization_name }}
          </div>
        </template>
        <template #[`item.project_name`]="{ item }">
          <div class="min-150">
            {{ item.project_name }}
          </div>
        </template>
        <template #[`item.total`]="{ item }">
          <div class="min-100">{{ toIDRWithDotFormat(item.total) }}</div>
        </template>
        <template #[`item.created_at`]="{ item }">
          <div class="min-100">
            {{ item.created_at }}
          </div>
        </template>
        <template #[`item.description`]="{ item }">
          <div class="min-100">
            {{ item.description }}
          </div>
        </template>
        <template #[`item.payment_method`]="{ item }">
          <div class="min-100">
            {{ item.payment_method }}
          </div>
        </template>
        <template #[`item.action`]="{ item }">
          <div class="min-180">
            <div v-if="item.status === 'rejected'" class="error--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">
              Rejected
            </div>
            <div v-if="item.status === 'approved'" class="success--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">
              Approved
            </div>
            <div v-if="item.status === 'pending'">
              <v-btn
                depressed
                height="36"
                class="success mr-3"
                @click="
                  if(read_only){
                    return
                  }
                  payment = item;
                  modal.approve = true;
                "
                :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
              >
                Approve
              </v-btn>
              <v-btn
                depressed
                height="36"
                class="error"
                :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                @click="
                  if(read_only){
                    return
                  }
                  payment = item;
                  modal.reject = true;
                "
              >
                Reject
              </v-btn>
            </div>
          </div>
        </template>
        <template #footer="{ props }">
          <custom-footer-datatable
            @input="
              (val) => {
                options = { ...options, ...val };
              }
            "
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text>
    <dialog-create-manual-payment
      v-if="modal.add"
      v-model="modal.add"
      @close="modal.add = false"
    />
    <dialog-reject-manual-payment
      v-if="modal.reject && payment"
      :item="payment"
      v-model="modal.reject"
      @close="modal.reject = false"
    />
    <dialog-approve-manual-payment
      v-if="modal.approve && payment"
      :item="payment"
      v-model="modal.approve"
      @close="modal.approve = false"
    />
  </v-card>
</template>

<script lang="ts">
import { toIDRWithDotFormat } from "@/lib/formatter";
import {
  defineComponent,
  watch,
  ref,
  reactive,
  onMounted,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANUALPAYMENT } from "./namespace";
import dialogCreateManualPayment from "./dialogCreateManualPayment.vue";
import dialogRejectManualPayment from "./dialogRejectManualPayment.vue";
import dialogApproveManualPayment from "./dialogApproveManualPayment.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    "dialog-create-manual-payment": dialogCreateManualPayment,
    "dialog-reject-manual-payment": dialogRejectManualPayment,
    "dialog-approve-manual-payment": dialogApproveManualPayment,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manual Payment'));
    const { fetchManualPayment } = useNamespacedActions(MANUALPAYMENT, [
      "fetchManualPayment",
    ]);
    const { pagination } = useNamespacedState(MANUALPAYMENT, ["pagination"]);
    const { isLoading } = useNamespacedState(MANUALPAYMENT, ["isLoading"]);
    const { getManualPayment } = useNamespacedGetters(MANUALPAYMENT, [
      "getManualPayment",
    ]);
    const headers = ref([
      {
        text: "Organization",
        value: "organization_name",
        sortable: false,
      },
      {
        text: "Project",
        value: "project_name",
        sortable: false,
      },
      {
        text: "Total",
        value: "total",
        sortable: false,
      },
      {
        text: "Date",
        value: "date",
        sortable: false,
      },
      {
        text: "Description",
        value: "description",
        sortable: false,
      },
      {
        text: "Payment",
        value: "payment_method",
        sortable: false,
      },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center",
      },
    ]);
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      rowsPerPage: 5,
      search: "",
      sortBy: [],
      sortDesc: [],
    });
    const modal = reactive({
      add: false,
      reject: false,
      approve: false,
    });
    const search = ref("");
    let searchtimeout: any = setTimeout(() => {}, 500);
    watch(search, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1;
        options.value.search = val;
      }, 500);
    });
    watch(
      options,
      (val) => {
        fetchManualPayment(val);
      },
      { deep: true }
    );
    const payment = ref();
    return {
      read_only,

      fetchManualPayment,
      getManualPayment,
      pagination,
      headers,
      options,
      modal,
      payment,
      search,
      toIDRWithDotFormat,
    };
  },
});
</script>

<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
.min-100 {
  min-width: 100px;
}
.min-150 {
  min-width: 150px;
}
.min-180 {
  min-width: 180px;
}
.min-200 {
  min-width: 200px;
}
</style>
