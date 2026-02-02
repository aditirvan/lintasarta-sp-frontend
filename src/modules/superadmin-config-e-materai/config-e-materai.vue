<template>
  <v-card flat class="rounded-lg mt-3 pa-4">
    <div class="d-flex justify-between pr-4">
      <v-card-text class="headline font-weight-bold font--text"
        >Config E-Materai
      </v-card-text>
      <v-btn
        v-if="!read_only"
        id="create-e-materai"
        depressed
        height="50"
        class="secondary"
        @click="modal.add = true"
      >
        Create New E-Materai
      </v-btn>
    </div>
    <v-card-text>
      <v-data-table
        id="my-table"
        hide-default-footer
        hide-default-header
        :headers="headers"
        :items-per-page="10"
        :items="getStamps"
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
        <template #[`item.no_materai`]="{ item }">
          {{ item.stamp_code }}
        </template>
        <template #[`item.expired_at`]="{ item }">
          {{ item.expired_at }}
        </template>
        <template #[`item.status`]="{ item }">
          <v-switch
            :disabled="read_only"
            v-model="item.status"
            :true-value="1"
            :false-value="0"
            class="mt-0 mb-2"
            readonly
            inset
            flat
            hide-details
            @click="
              if(read_only){
                return
              }
              materai = item;
              modal.changeStatus = true;
            "
          ></v-switch>
        </template>
        <template #[`item.action`]="{ item }">
          <span
            @click="
              if(read_only){
                return
              }
              materai = item;
              modal.delete = true;
            "
            class="error--text pr-3 delete ml-4"
            :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
            >Delete</span
          >
          <span
            @click="
              if(read_only){
                return
              }
              materai = item;
              modal.edit = true;
            "
            class="primary--text pr-3 delete ml-4"
            :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
            >Edit</span
          >
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
    <dialog-create-materai
      v-if="modal.add"
      v-model="modal.add"
      @close="modal.add = false"
      @success="
        () => {
          fetchStamps(options).then(() => {
            modal.add = false;
          });
        }
      "
    />
    <dialog-edit-materai
      v-if="modal.edit && materai"
      :item="materai"
      v-model="modal.edit"
      @close="modal.edit = false"
      @success="
        () => {
          fetchStamps(options).then(() => {
            modal.edit = false;
          });
        }
      "
    />
    <dialog-delete-materai
      v-if="modal.delete && materai"
      :item="materai"
      v-model="modal.delete"
      @close="modal.delete = false"
      @success="
        () => {
          fetchStamps(options).then(() => {
            modal.delete = false;
          });
        }
      "
    />
    <dialog-change-status-materai
      v-if="modal.changeStatus && materai"
      :item="materai"
      v-model="modal.changeStatus"
      @close="modal.changeStatus = false"
      @confirm="changeStatusMaterai"
    />
    <dialog-warning-change-status-materai
      v-if="modal.warningChangeStatus"
      v-model="modal.warningChangeStatus"
      @close="modal.warningChangeStatus = false"
    />
  </v-card>
</template>

<script lang="ts">
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
import { EMATERAI } from "./namespace";
import dialogCreateMaterai from "./dialogCreateMaterai.vue";
import dialogEditMaterai from "./dialogEditMaterai.vue";
import dialogDeleteMaterai from "./dialogDeleteMaterai.vue";
import dialogChangeStatusMaterai from "./dialogChangeStatusMaterai.vue";
import dialogWarningChangeStatusMaterai from "./dialogWarningChangeStatusMaterai.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    "dialog-create-materai": dialogCreateMaterai,
    "dialog-edit-materai": dialogEditMaterai,
    "dialog-delete-materai": dialogDeleteMaterai,
    "dialog-change-status-materai": dialogChangeStatusMaterai,
    "dialog-warning-change-status-materai": dialogWarningChangeStatusMaterai,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Config E-Materai'));
    const { fetchStamps, editStatusStamp } = useNamespacedActions(EMATERAI, [
      "fetchStamps",
      "editStatusStamp",
    ]);
    const { pagination } = useNamespacedState(EMATERAI, ["pagination"]);
    const { getStamps } = useNamespacedGetters(EMATERAI, ["getStamps"]);
    const headers = ref([
      {
        text: "No Materai",
        value: "stamp_code",
      },
      {
        text: "Expire Date",
        value: "expired_at",
      },
      {
        text: "Status",
        value: "status",
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
      edit: false,
      delete: false,
      changeStatus: false,
      warningChangeStatus: false,
    });
    watch(
      options,
      (val) => {
        fetchStamps(val);
      },
      { deep: true }
    );
    onMounted(() => {
      fetchStamps();
    });
    const changeStatusMaterai = (params: any) => {
      const data = {
        id: params.id,
        status: params.status == 0 ? 1 : 0,
      };
      editStatusStamp(data)
        .then(() => {
          fetchStamps(options).then(() => {
            modal.changeStatus = false;
          });
        })
        .catch((err: any) => {
          console.log(`error-code: ${err.response.data.code}`);
          if (err.response.data.code == 400) {
            modal.changeStatus = false;
            modal.warningChangeStatus = true;
          }
        });
    };
    const materai = ref();
    return {
      read_only,

      fetchStamps,
      getStamps,
      pagination,
      headers,
      options,
      modal,
      changeStatusMaterai,
      materai,
    };
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
</style>
