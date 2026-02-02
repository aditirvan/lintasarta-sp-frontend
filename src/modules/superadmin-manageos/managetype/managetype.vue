<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="d-flex flex-row align-center">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">
            Manage Type Operating System
          </p>
          <v-spacer />

          <div style="height: auto; width: 30px" />
          <v-btn
            id="CreateNewType"
            depressed
            height="50"
            width="150"
            class="secondary"
            @click="
              () => {
                opendialogaddtype = true;
              }
            "
          >
            <span class="fz-14">Create New Type</span>
          </v-btn>
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
        :items="getostype"
        :server-items-length="paginationtype.count"
        :options.sync="options"
        v-model="typessselected"
      >
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          >
          </v-data-table-header>
        </template>
        <template #[`item.os_logo`]="{ item }">
          <div v-if="item.os_logo">
            <v-img
              :src="item.os_logo"
              :alt="item.name"
              max-height="32"
              width="32"
              contain
            />
          </div>
          <div v-else>-</div>
        </template>
        <template #[`item.type_os`]="{ item }">
          {{ item.type_os ? item.type_os : "-" }}
        </template>

        <template #[`item.price`]="{ item }">
          {{ item.price ? toIDRWithDotFormat(item.price) : "Free" }}
        </template>

        <template #[`item.action`]="{ item }">
          <span
            @click="
              () => {
                typeselectedvalue = item;
                opendialogedittype = true;
              }
            "
            class="pr-3 edit primary--text"
            >Edit
          </span>

          <span
            @click="
              () => {
                typeselected = item;
                opendialogdeletetype = true;
              }
            "
            class="error--text pr-3 delete ml-4"
            >Delete
          </span>
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

    <dialogDeleteType
      v-model="opendialogdeletetype"
      @confirm="deletetypeselected"
    />

    <dialogAddType
      v-if="opendialogaddtype"
      v-model="opendialogaddtype"
      @added="
        () => {
          refreshType();
        }
      "
    />
    <dialogEditType
      v-if="typeselectedvalue && opendialogedittype"
      :typeselectedvalue="typeselectedvalue"
      v-model="opendialogedittype"
      @updated="
        () => {
          refreshType();
        }
      "
    />
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch } from "@vue/composition-api";
// import { useMember } from "./useMember";
import { useType } from "./useType";
import dialogEditType from "./dialogEdit.vue";
import dialogAddType from "./dialogAdd.vue";
import dialogDeleteType from "./dialogDelete.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

// import dialogRecendInviteUser from "./dialogResendInviteUser.vue";

// import dialogProjectList from "./dialogProjectList.vue";
// import dialogDetailUser from "./dialogDetailUser.vue";

const {
  Parser,
  transforms: { unwind, flatten },
} = require("json2csv");
// import {
//   useNamespacedActions,
//   useNamespacedState,
// } from "vuex-composition-helpers";
//import { MANAGEFLAVOR } from "./namespace";

// import dialogActivateUser from './dialogActivateUser.vue'
export default defineComponent({
  components: {
    dialogEditType,
    dialogAddType,
    dialogDeleteType,
    // dialogProjectList,
    // dialogDetailUser,
    // dialogActivateUser,
    // dialogRecendInviteUser
  },
  setup() {
    const typeselectedvalue: Ref<any> = ref("");
    const Composable = { ...useType() };
    const { typessselected, ostype } = Composable;
    const headers = ref([
      {
        text: "No",
        value: "no",
      },
      {
        text: "Image",
        value: "os_logo",
      },
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Description",
        value: "description",
      },
      {
        text: "Type",
        value: "type_os",
      },
      {
        text: "Price",
        value: "price",
      },
      {
        text: "Action",
        value: "action",
        width: 200,
      },
    ]);

    watch;
    //const opendialogactivateuser = ref(false)
    return {
      toIDRWithDotFormat,
      headers,
      opendialogdeletetype: ref(false),
      opendialogaddtype: ref(false),
      typeselectedvalue,
      opendialogedittype: ref(false),
      ...Composable,
      ostype,
      show: ($event: any, item: any) => {
        typeselectedvalue.value = item;
      },

      // Download,
    };
  },
  created() {
    this.fetchostype();
  },
});
</script>
<style lang="scss" scoped>
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
}

.div.v-breadcrumbs__item {
  color: rgba(0, 0, 0, 0.38) !important;
}
</style>
