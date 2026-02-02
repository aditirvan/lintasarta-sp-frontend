<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="d-flex flex-row align-center">
      <v-col class="d-flex flex-row align-center">
        <p class="mb-0 font-weight-bold fz-21">Mailbox Log</p>
      </v-col>
    </v-card-text>

    <v-card-text>
      <v-row>
        <v-col md="4">
          <v-menu
            ref="menu1"
            v-model="vcalendar"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="rangeText"
                placeholder="DD/MM/YYYY"
                persistent-hint
                readonly
                v-bind="attrs"
                v-on="on"
                clearable
                @click:clear="clearDate"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              range
              @change="vcalendar = false"
              no-title
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col md="4">
          <v-autocomplete
            id="FilterOrg"
            :search-input.sync="searchorganization"
            v-model="filterorganization"
            :items="listOrgMailbox"
            outlined
            item-text="org_names"
            item-value="id"
            placeholder="Filter Organization"
            attach="#FilterOrgAttach"
            clearable
            hide-details
          >
            <template v-slot:append-outer>
              <div id="FilterOrgAttach"></div>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col md="4">
          <v-select
            hide-details
            clearable
            v-model="filterstatus"
            :items="[
              { name: 'Success', id: 1 },
              { name: 'Failed', id: 0 },
              { name: 'Resend', id: 2 },
              { name: 'Invalid Email', id: 3 },
              { name: 'Missing Body', id: 4 },
            ]"
            item-text="name"
            item-value="id"
            outlined
            placeholder="Filter Status"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-data-table
        id="my-table"
        hide-default-footer
        :headers="headers"
        hide-default-header
        :items-per-page="10"
        :search="search"
        :items="listmailbox"
        :server-items-length="pagination.count"
        :options.sync="options"
        v-model="listmailboxselected"
      >
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          >
          </v-data-table-header>
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ $moment(item.created_at).format("HH:mm:ss DD/MM/YYYY") }}
        </template>

        <template #[`item.status`]="{ item }">
          <div class="min-width-70">
            <div v-if="item.status == 1">Success</div>
            <div v-else-if="item.status == 2">Resend</div>
            <div v-else-if="item.status == 3">Invalid Email</div>
            <div v-else-if="item.status == 4">Missing Body</div>
            <div v-else>Failed</div>
          </div>
        </template>
        <template #[`item.trigger`]="{ item }">
          <div class="min-width-70">
            {{ item.trigger }}
          </div>
        </template>

        <template #[`item.organization_name`]="{ item }">
          <div class="min-width-100">
            {{ item.organization_name ? item.organization_name : "-" }}
          </div>
        </template>

        <template #[`item.action`]="{item}">
          <div
            v-if="item.status == 1 || item.status === 3 || item.status === 4"
          >
            -
          </div>
          <p v-else-if="item.status === 2 || read_only" class="accent--text mb-0" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">
            Resend
          </p>
          <p
            v-else-if="item.status === 0"
            class="primary--text resend-btn mb-0"
            @click="
              if(read_only){
                return
              }
              listmailboxselectedvalue = item;
              opendialogresendemail = true;
            "
            :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
          >
            Resend
          </p>
        </template>

        <template v-slot:footer="{ props }">
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
    <dialogResendEmail
      v-if="opendialogresendemail && listmailboxselectedvalue"
      v-model="opendialogresendemail"
      :item="{ listmailboxselectedvalue, listmailboxselected }"
      @close="opendialogresendemail = false"
      @submit="resendEmail"
    />
  </v-card>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  watch,
} from "@vue/composition-api";
import { useMailbox } from "./useMailbox";
import dialogResendEmail from "./dialogResendEmail.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: { dialogResendEmail },
  setup(props, { emit, root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('MailBox Log'));
    const listmailboxselectedvalue: Ref<any> = ref("");
    const Composable = { ...useMailbox() };
    const { listmailbox, listmailboxselected } = Composable;
    const headers = ref([
      {
        text: "Subject",
        value: "subject",
        sortable: false,
      },
      {
        text: "Date",
        value: "created_at",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Trigger",
        value: "trigger",
        sortable: false,
      },
      {
        text: "Recipient",
        value: "email",
        sortable: false,
      },
      {
        text: "Organization",
        value: "organization_name",
        sortable: false,
      },
      {
        text: "Action",
        value: "action",
        sortable: false,
      },
    ]);

    return {
      read_only,

      vcalendar: false,
      headers,
      ...Composable,
      listmailbox,
      listmailboxselected,
      listmailboxselectedvalue,
      show: (items: any) => {
        console.log(items);
      },
    };
  },
  created() {
    this.fetchlistmailbox();
  },
});
</script>
<style lang="scss" scoped>
.min-width-70 {
  min-width: 70px;
}
.min-width-100 {
  min-width: 120px;
}
.search {
  ::v-deep .v-input__slot {
    margin-bottom: 0px;
  }
}
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 51px;
  min-width: 64px;
  padding: 0 16px;
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
.v-input {
  ::v-deep .v-input__append-outer {
    margin: 0px 0px !important;
  }

  .v-menu {
    height: 50px;
  }
}
.resend-btn {
  cursor: pointer;
}
</style>
