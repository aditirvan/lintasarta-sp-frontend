<template>
  <v-container fluid class="px-0">
    <v-card flat class="pa-7 rounded-lg">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">
            Manage Project Commitment Fee
          </p>
          <v-spacer />
          <div style="height: auto; width: 30px" />
          <v-btn
            id="CreateNewCommitment"
            @click="
              () => {
                opendialogadd = true;
              }
            "
            depressed
            height="50"
            class="secondary"
          >
            <span class="fz-14">Add New Commitment</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            id="FilterOrg"
            :search-input.sync="searchorganization"
            v-model="filterOrganization"
            :items="organizations"
            outlined
            item-text="name"
            item-value="id"
            placeholder="Organization"
            attach="#FilterOrgAttach"
            clearable
            hide-details
            @focus="
              () => {
                fetchorganizations({ search: searchorganization });
              }
            "
          >
            <template v-slot:append-outer>
              <div id="FilterOrgAttach"></div>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field
            maxlength="50"
            hide-details
            outlined
            placeholder="Search"
            v-model="search"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            id="Table"
            hide-default-footer
            :items="commitments"
            :items-per-page="10"
            :server-items-length="pagination.count"
            :headers="headers"
            :search="search"
            :options.sync="options"
          >
            <template v-slot:item.organization="{ item }">
              {{ item.organization.name }}
            </template>
            <template v-slot:item.project="{ item }">
              {{ item.project.name }}
            </template>
            <template v-slot:item.fee="{ item }">
              {{ toIDRWithDotFormat(item.fee) }}
            </template>
            <template v-slot:item.status="{ item }">
              <span v-if="item.status === 'APPROVED'" class="text-success">{{
                item.status.toLowerCase()
              }}</span>
              <span
                v-else-if="item.status === 'DECLINED'"
                class="text-danger"
                >{{ item.status.toLowerCase() }}</span
              >
              <span v-else class="text-muted">{{
                item.status.toLowerCase()
              }}</span>
            </template>
            <template v-slot:item.duration="{ item }">
              <span>{{ item.duration }} Year</span>
            </template>
            <template v-slot:item.discount="{ item }">
              <span>{{ item.discount }}%</span>
            </template>
            <template v-slot:item.date="{ item }">
              <span
                >{{ moment(item.start_date).format("DD/MM/YYYY") }} - <br />{{
                  moment(item.end_date).format("DD/MM/YYYY")
                }}</span
              >
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn
                v-if="item.status !== 'APPROVED' && item.status !== 'DECLINED'"
                class="secondary"
                :id="item.id"
                @click="
                  () => {
                    SELECT_COMMITMENT(item);
                    openDialogApprove = true;
                  }
                "
              >
                Approve
              </v-btn>
              <span v-else>-</span>
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
        </v-col>
      </v-row>
    </v-card>
    <dialog-add-commitment
      v-model="opendialogadd"
      @added="
        () => {
          fetchorganizations(options);
        }
      "
    />
    <dialog-approve-commitment v-model="openDialogApprove" />
  </v-container>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";

const { useCommitment } = require("./useCommitment.js");
import { toIDRWithDotFormat } from "../../lib/formatter";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import DialogAddCommitment from "./DialogAddCommitment.vue";
import DialogApproveCommitment from "./DialogApproveCommitment.vue";
import { SUPERADMINCOMMITMENT } from "./namespace";
import moment from "moment";

export default defineComponent({
  components: {
    DialogAddCommitment,
    DialogApproveCommitment,
  },
  setup() {
    const Composable = { ...useCommitment() };
    const {
      pagination,
      options,
      search,
      fetchorganizations,
      organizations,
      isLoading,
      filterOrganization,
      searchorganization,
      commitments,
      GET_ALL_COMMITMENTS,
      SELECT_COMMITMENT,
    } = Composable;
    const headers = [
      {
        text: "Organization",
        value: "organization",
      },
      {
        text: "Project Name",
        value: "project",
      },
      {
        text: "Fee",
        value: "fee",
      },
      {
        text: "Discount",
        value: "discount",
      },
      {
        text: "Duration",
        value: "duration",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Date",
        value: "date",
      },
      {
        text: "Action",
        value: "action",
        align: "center",
      },
    ];
    onMounted(async () => {
      fetchorganizations();
      GET_ALL_COMMITMENTS();
    });
    const orgselected = ref();
    let searchtimeout: any = setTimeout(() => {}, 500);
    watch(search, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1;
        options.value.search = val;
      }, 500);
    });

    return {
      moment,
      SELECT_COMMITMENT,
      toIDRWithDotFormat,
      search,
      orgselected,
      pagination,
      options,
      openDialogApprove: ref(false),
      opendialogadd: ref(false),
      opendialogedit: ref(false),
      headers,
      fetchorganizations,
      commitments,
      organizations,
      isLoading,
      filterOrganization,
      searchorganization,
      GET_ALL_COMMITMENTS,
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

.text-success {
  color: #27ae60;
}

.text-danger {
  color: #eb5757;
}

.text-muted {
  color: #a5b3bf;
}
</style>
