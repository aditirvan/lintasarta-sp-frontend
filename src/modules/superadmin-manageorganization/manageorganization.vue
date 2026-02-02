<template>
  <v-container fluid class="px-0">
    <v-card flat class="pa-7 rounded-lg">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Manage Organization</p>
          <v-spacer/>
          <v-text-field
            maxlength="50"
            hide-details
            outlined
            style="max-width: 200px"
            placeholder="Search"
            v-model="search"
          ></v-text-field>
          <div style="height: auto; width: 30px"/>
          <v-btn
            v-if="!read_only"
            id="CreateNewOrg"
            @click="
              () => {
                opendialogadd = true;
              }
            "
            depressed
            height="50"
            class="secondary"
          >
            <span class="fz-14">Create New Organization</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            id="Table"
            hide-default-footer
            :items="organizations ? organizations : []"
            :items-per-page="10"
            :server-items-length="pagination.count"
            :headers="headers"
            :search="search"
            :options.sync="options"
            :footer-props="footerProps"
          >
            <!-- <template v-if="isDevModePrepaid" v-slot:item.service_type="{ item }">
              {{ uppercaseFirstLetter(item.service_type) }}
            </template> -->
            <template v-if="isDevModePrepaid" #[`item.is_personal`]="{ item }">
              {{ item.is_personal ? 'SME' : 'Enterprise' }}
            </template>
            <template v-else #[`item.type`]="{ item }">
              {{ ["Basic", "Premium", "", "Request Upgrade"][item.org_type] }}
            </template>
            <!-- <template v-slot:item.created_at="{ item }">
              {{ $FormatDate(item.created_at) }}
            </template> -->
            <template #[`item.is_white_label`]="{ item }">
              <v-container
                class="px-0"
                fluid
              >
                <v-chip
                 :color="item.is_white_label ? 'primary' : ''"
                 :text-color="item.is_white_label ? 'white' : ''"
                 style="text-transform: capitalize;"
                >
                  {{ item.is_white_label ? "yes" : "no" }}
                </v-chip>
              </v-container>
            </template>
            <template #[`item.dekaprime`]="{ item }">
              <v-container
                class="px-0"
                fluid
              >
                <v-chip
                 :color="item.dekaprime_organization_id ? 'primary' : ''"
                 :text-color="item.dekaprime_organization_id ? 'white' : ''"
                 style="text-transform: capitalize;"
                >
                  {{ item.dekaprime_organization_id ? "yes" : "no" }}
                </v-chip>
              </v-container>
            </template>
            <template #[`item.status`]="{ item }">
              <v-switch
                class="mt-0 mb-2"
                hide-details
                :true-value="1"
                :false-value="0"
                flat
                readonly
                :disabled="read_only"
                v-model="item.status"
                @click="
                  () => {
                    if (read_only){
                      return
                    }
                    orgselected = item;
                    opendialogactivateorg = true;
                  }
                "
              ></v-switch>
            </template>
            <template #[`item.action`]="{ item }">
              <popupquote
                v-model="item.open"
                :offsetTop="21"
                :documentid="'popup' + item.id"
                offset-y
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <label
                    v-bind="attrs"
                    class="primary--text linkpointer"
                    style="position: relative; white-space: nowrap"
                    @click="
                      ($event) => {
                        on.click($event);
                        item.open = true;
                      }
                    "
                  >More
                    <v-icon
                      :class="{
                        rotate: item.open,
                      }"
                      :id="'popup' + item.id"
                      color="primary"
                    >mdi-chevron-down
                    </v-icon
                    >
                  </label>
                </template>
                <v-list>
                  <template v-if="!isDevModePrepaid">
                    <v-list-item
                      v-if="item.org_type != 1"
                      @click="
                        () => {
                          orgselected = item;
                          opendialogupgradeorg = true;
                        }
                      "
                    >
                      <span class="font--text" style="font-weight: 600">
                        Upgrade to Premium
                      </span>
                    </v-list-item>

                    <v-list-item
                      v-else
                      @click="
                        () => {
                          orgselected = item;
                          opendialogdowngrade = true;
                        }
                      "
                    >
                      <span class="font--text" style="font-weight: 600">
                        Revert to Basic
                      </span>
                    </v-list-item>
                    <v-divider/>
                  </template>

                  <v-list-item
                    v-if="!read_only"
                    @click="
                      () => {
                        orgselected = item;
                        opendialogedit = true;
                      }
                    "
                  >
                    <span class="font--text" style="font-weight: 600"
                    >Edit</span
                    >
                  </v-list-item>
                  <v-list-item
                    @click="
                      () => {
                        $router.push(`/organization-detail/${item.id}`);
                      }
                    "
                  >
                    <span class="font--text" style="font-weight: 600"
                    >Detail</span
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="!read_only && item.suspend_type"
                    @click="
                      () => {
                        orgselected = item;
                        opendialogunsuspend = true;
                      }
                    "
                  >
                    <span class="font--text" style="font-weight: 600"
                    >Unsuspend</span
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="!read_only"
                    @click="
                      () => {
                        orgselected = item;
                        hapusORG();
                      }
                    "
                  >
                    <v-list-item-title class="error--text"
                    >Delete
                    </v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </popupquote>
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
    <dialogAddOrg
      v-model="opendialogadd"
      @added="
        () => {
          fetchorganizations(options);
        }
      "
    />
    <dialogAddOrg
      v-if="opendialogedit && orgselected"
      @updated="
        () => {
          fetchorganizations(options);
        }
      "
      v-model="opendialogedit"
      :organization="orgselected"
    />

    <dialogUnsuspendOrg
      v-if="opendialogunsuspend"
      :org="orgselected"
      v-model="opendialogunsuspend"
      @success="()=>{
        fetchorganizations(options);
      }"
      @error="(response) => {
        opendialogunsuspend = false;
        dialogerrormsg = response.data.data;
        opendialogerror = true;
      }"
    />

    <!-- <dialogDeleteOrg
      v-if="opendialogdelete"
      @delete="
        () => {
          fetchorganizations(options);
        }
      "
      v-model="opendialogdelete"
      :organization="orgselected"
    /> -->

    <dialogDeleteOrg
      v-if="opendialogdelete"
      :selectedorg="orgselected"
      v-model="opendialogdelete"
      @close="
        () => {
          opendialogdelete = false;
        }
      "
      @deleteorg="()=>{
        opendialogareyousure = true
      }"

    />

    <dialogUpgradeOrg
      :org="orgselected"
      v-model="opendialogupgradeorg"
      @success="
        () => {
          fetchorganizations(options);
          opendialogupgradeorg = false;
          opendialogupgradepremiumsuccess = true;
        }
      "
    />
    <dialogDowngradeOrg
      v-model="opendialogdowngrade"
      @confirm="
        () => {
          downgradeorg(orgselected).then(() => {
            opendialogdowngrade = false;
            fetchorganizations(options);
          });
        }
      "
    />

    <dialogAreYouSure v-if="opendialogareyousure" :org="orgselected" v-model="opendialogareyousure"
                      @deleted="()=>{
      fetchorganizations(options);
    }"
                      @error="
        (response) => {
          opendialogdelete = false;
          dialogerrormsg = response.data.data;
          opendialogerror = true;
        }
    "/>

    <dialogActivateUser
      userorganization="organization"
      v-if="orgselected"
      :onoff="orgselected.status ? 'off' : 'on'"
      v-model="opendialogactivateorg"
      @confirm="
        () => {
          changeorgstatus(orgselected).then(() => {
            orgselected.status = orgselected.status ? 0 : 1;
            opendialogactivateorg = false;
          });
        }
      "
    />
    <dialogUpgradePermiumSucces v-model="opendialogupgradepremiumsuccess"/>

    <dialogErrorDelete v-model="opendialogerror" :message="dialogerrormsg"/>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import Vue from "vue";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogAddOrg from "./dialogAddOrg.vue";
import dialogUnsuspendOrg from "./dialogUnsuspendOrg.vue";
import { SUPERADMINMANAGEORG } from "./namespace";
import dialogUpgradeOrg from "./dialogUpgradeOrg.vue";
import dialogDeleteOrg from "./dialogDeleteOrg.vue";
import dialogDowngradeOrg from "./dialogDowngradeOrg.vue";
import dialogErrorDelete from "./dialogErrorDelete.vue";
import dialogAreYouSure from "./dialogAreYouSure.vue";
import dialogActivateUser from "../superadmin-manageuser/dialogActivateUser.vue";
import dialogUpgradePermiumSucces from "./dialogUpgradePremiumSuccess.vue";
import { database } from "faker/locale/es_MX";
import { AccessControl } from "@/lib/middleware";

const isDevModePrepaid = true

export default defineComponent({
  components: {
    dialogAddOrg,
    dialogUnsuspendOrg,
    dialogDeleteOrg,
    dialogUpgradeOrg,
    dialogDowngradeOrg,
    dialogActivateUser,
    dialogErrorDelete,
    dialogAreYouSure,
    dialogUpgradePermiumSucces,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Organization'));
    const headers = [
      {
        text: "Name",
        value: "name",
      },
      // {
      //   text: "Address",
      //   value: "address",
      // },
      {
        text: "Type",
        value: isDevModePrepaid ? "is_personal" : "type",
        width: 100,
      },
      {
        text: "Phone Number",
        value: "phone_number_org",
      },
      // {
      //   text: "Created Date",
      //   value: "created_at",
      //   width: 150,
      // },
      {
        text: "Suspend Type",
        value: "suspend_type",
        align: "center",
        width: 100,
        sortable: false,
      },
      {
        text: "White Label",
        value: "is_white_label",
        width: 100,
        sortable: false,
      },
      {
        text: "Dekaprime",
        value: "dekaprime",
        width: 100,
        sortable: false
      },
      {
        text: "Status",
        value: "status",
        width: 100,
      },
      {
        text: "Action",
        value: "action",
        align: "center",
      },
    ];
    const { fetchorganizations, checkdeleteorg } = useNamespacedActions(SUPERADMINMANAGEORG, [
      "fetchorganizations",
      "checkdeleteorg",
    ]);
    const { setCurrentOrg, setCurrentProj } = useNamespacedMutations(
      "SUPERADMIN",
      ["setCurrentOrg", "setCurrentProj"]
    );
    onMounted(() => {
      fetchorganizations();
      setCurrentOrg(null)
      localStorage.removeItem('orgDP')
      localStorage.removeItem('dekaPrime')
      localStorage.removeItem('vdcById')
    });
    const {
      organizations,
      pagination,
    } = useNamespacedState(SUPERADMINMANAGEORG, [
      "organizations",
      "pagination",
    ]);
    const orgselected = ref();
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    const footerProps = ref({ 'items-per-page-options': [10, 20, 30, 50, 100] })
    const loading = ref(false);
    watch(
      options,
      async (val: any) => {
        loading.value = true;
        try {
          await fetchorganizations(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );
    const search = ref("");
    let searchtimeout: any = setTimeout(() => {
    }, 500);
    watch(search, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1;
        options.value.search = val;
      }, 500);
    });
    const {
      changeorgstatus,
      upgradeorg,
      downgradeorg,
    } = useNamespacedActions(SUPERADMINMANAGEORG, [
      "changeorgstatus",
      "upgradeorg",
      "downgradeorg",
    ]);
    const dialogerrormsg = ref("");
    const opendialogupgradeorg = ref(false);
    const opendialogdowngrade = ref(false);
    const opendialogactivateorg = ref(false);
    const opendialogdelete = ref(false);
    const opendialogerror = ref(false);
    const opendialogareyousure = ref(false);
    const {
      setopendialoghavebeensubmitted,
    } = useNamespacedMutations("DASHBOARD", ["setopendialoghavebeensubmitted"]);
    const opendialogupgradepremiumsuccess = ref(false);
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);


    const hapusORG = () => {
      const Value = {
        id: orgselected.value.id,
        name: orgselected.value.name
      };

      // checkdeleteorg(Value).then((e: any) => {

        opendialogdelete.value = true;
        //context.root.$router.replace(`/`);
        //opendialogareyousure=true;
        //opendialogareyousure(true);
        // updateCurrentProj(Value);
        // setopendialoghavebeensubmitted(true);
        // watch(opendialoghavebeensubmitted, (val) => {
        //   if (val == false) {
        //     context.root.$router.replace(`/project/${name.value}`);
        //   }
        // });
      // }).catch((e: any) => {
      //   // const {message} = e.response.message
      //   opendialogerror.value = true;
      //   dialogerrormsg.value = e.response.data.message
      // });

    }

    return {
      read_only,

      dialogerrormsg,
      opendialogdelete,
      opendialogerror,
      hapusORG,
      opendialogareyousure,
      setopendialogcommonsuccess,
      opendialogupgradepremiumsuccess,
      setopendialoghavebeensubmitted,
      changeorgstatus,
      opendialogactivateorg,
      opendialogdowngrade,
      upgradeorg,
      downgradeorg,
      opendialogupgradeorg,
      search,
      orgselected,
      pagination,
      options,
      opendialogadd: ref(false),
      opendialogedit: ref(false),
      opendialogunsuspend: ref(false),
      headers,
      organizations,
      fetchorganizations,
      footerProps,
    };
  },
  data() {
    return {
      isDevModePrepaid,
    }
  },
  methods: {
    uppercaseFirstLetter(string: String) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
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
</style>