<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <!-- title & buttons -->
    <v-card-text class="d-flex flex-row align-center">
      <div class="headline font-weight-bold font--text">Manage User</div>
      <v-spacer />
      <div style="height: auto; width: 20px" />
      <v-btn
        v-if="!read_only"
        id="CreateNewUser"
        depressed
        height="50"
        width="150"
        class="secondary"
        @click="
          () => {
            opendialogadduser = true;
          }
        "
        ><span class="fz-14">Add New User</span></v-btn
      >
      <div style="width: 20px; height: auto" />
      <v-btn
        @click="Download"
        class="secondary--text"
        depressed
        height="50"
        width="150"
        style="border: 3px solid #2c94d2; background-color: white"
        ><span class="fz-14">Download</span></v-btn
      >
    </v-card-text>

    <!-- select filter search box -->
    <v-card-text>
      <v-row>
        <v-col>
          <v-autocomplete
            id="FilterOrg"
            :search-input.sync="searchorganization"
            v-model="filterorganization"
            :items="organizations"
            outlined
            item-text="name"
            item-value="id"
            placeholder="Filter Organization"
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
          <v-select
            hide-details
            clearable
            v-model="filterrole"
            :items="[
              { name: 'owner', id: 1 },
              { name: 'member', id: 2 },
              { name: 'creator', id: 0 },
            ]"
            item-text="name"
            item-value="id"
            outlined
            placeholder="Filter Role"
          >
          </v-select>
        </v-col>
        <v-col>
          <v-text-field
            maxlength="50"
            clearable
            v-model="search"
            class="search"
            placeholder="Search"
            outlined
            @click:clear="
              () => {
                search = '';
              }
            "
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- table -->
    <v-card-text>
      <v-data-table
        id="my-table"
        show-select
        hide-default-header
        hide-default-footer
        :headers="headers"
        :items-per-page="10"
        :search="search"
        :items="members"
        :server-items-length="pagination.count"
        :options.sync="options"
        v-model="membersselected"
      >
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          >
          </v-data-table-header>
        </template>

        <!-- email -->
        <template #[`item.email`]="{ item }">
          <div>
            {{ item.email }}
          </div>
        </template>

        <!-- organization -->
        <template #[`item.organization`]="{ item }">
          <div>
            {{ item.organization_name }}
          </div>
        </template>

        <!-- role -->
        <template #[`item.role`]="{ item }">
          <div class="text-capitalize">
            {{ item.role_name }}
          </div>
        </template>

        <!-- status npwp & ktp -->
        <template #[`item.is_identity_verified`]="{ item }">
          <div
            v-if="item.is_identity_verified === true"
            class="npwp-verified"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Verified </u>
          </div>

          <div
            v-if="item.is_identity_verified === false"
            class="npwp-notverified"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Unverified </u>
          </div>

          <div
            v-if="item.is_identity_verified === null"
            class="npwp-waiting-confirmation"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Waiting </u>
          </div>
        </template>

        <template #[`item.joindate`]="{ item }">
          <div>
            {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
          </div>
        </template>

        <!-- user status -->
        <!-- <template #[`item.statususer`]="{ item }">
          <div v-if="item.verified_at != ''" class="min-width-130">
            Verified
          </div>
          <div v-else class="min-width-130">Unverified</div>
        </template> -->

        <!-- status -->
        <template #[`item.status`]="{ item }">
            <div>
                <v-switch
                    true-value="active"
                    false-value="deactive"
                    flat
                    readonly
                    :disabled="read_only"
                    @click="()=>{
                    if (read_only){
                      return
                    }
                    memberselectedvalue = item
                    opendialogactivateuser = true
                    }"
                    :input-value="item.status"
                ></v-switch>
            </div>
        </template>

        <!-- action -->
        <template #[`item.action`]="{ item }">
          <popupquote
            v-model="item.open"
            :offsetTop="20"
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
                    getmemberbyid(item.id);
                    if (member !== null) {
                      show($event, member);
                    }
                  }
                "
                >More
                <v-icon
                  :class="{
                    rotate: item.open,
                  }"
                  :id="'popup' + item.id"
                  color="primary"
                  >mdi-chevron-down</v-icon
                >
              </label>
            </template>
            <v-list>
              <!-- :disabled="(item.status=='active' && item.is_creator!=true) || (item.verified_at!='' && item.is_creator==true && item.status=='active')" -->
              <v-list-item
                v-if="!read_only"
                :disabled="item.verified_at !== '' ? true : false"
                @click="
                  () => {
                    memberselected = item;
                    opendialogresendinviteuser = true;
                  }
                "
              >
                <v-list-item-title>Resend Invitation</v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="!read_only"
                :disabled="item.role_name == 'creator' ? false : true" 
                @click="
                  () => {
                    memberselectedvalue = item;
                    opendialogtransferuser = true;
                  }
                "
              >
                <v-list-item-title>Transfer Creator Role </v-list-item-title>
              </v-list-item>

              <v-divider style="min-width: 160px" />

              <v-list-item
                v-if="!read_only"
                @click="
                  () => {
                    if (member !== null) {
                      memberselectedvalue = member;
                      opendialogedituser = true;
                    }
                  }
                "
              >
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  () => {
                    if (member !== null) {
                      memberselectedvalue = member;
                      opendialogdetailuser = true;
                    }
                  }
                "
              >
                <v-list-item-title>Detail</v-list-item-title>
              </v-list-item>
              <v-list-item
                style="min-height: 1px; margin-left: -16px; margin-right: -16px"
              >
                <v-divider style="min-width: 160px" />
              </v-list-item>
              <v-list-item
                v-if="!read_only"
                :disabled="item.is_creator === true ? true : false" 
                @click="
                  () => {
                    memberselected = item;
                    opendialogdeleteuser = true;
                  }
                "
              >
                <v-list-item-title class="error--text">
                  Delete</v-list-item-title
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
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <dialogNpwpKtp
      v-if="memberselectedvalue && opendialognpwpktp"
      :memberselectedvalue="memberselectedvalue"
      v-model="opendialognpwpktp"
      @confirm="verifynpwpmemberselected"
      @reject="rejectnpwpmemberselected($event)"
    />

    <dialogDeleteUser
      v-model="opendialogdeleteuser"
      @confirm="deletememberselected"
    />

    <dialogRecendInviteUser
      v-model="opendialogresendinviteuser"
      @confirm="
        () => {
          resendinvitememberselected().then(() => {
            opendialogsuccess = true;
            dialogemsgsuccess =
              'Email has been sent, Please wait if mail has not appeared';
            dialogetitlesuccess = 'Email has been sent!';
            refreshmembers();
          });
        }
      "
    />

    <dialogAddUser
      v-if="opendialogadduser"
      v-model="opendialogadduser"
      @added="
        () => {
          refreshmembers();
        }
      "
    />

    <dialogEditUser
      v-if="memberselectedvalue && opendialogedituser"
      :memberselectedvalue="memberselectedvalue"
      v-model="opendialogedituser"
      @updated="
        () => {
          refreshmembers();
        }
      "
    />

    <dialogTransferRoleUser
      v-if="memberselectedvalue && opendialogtransferuser"
      :memberselectedvalue="memberselectedvalue"
      v-model="opendialogtransferuser"
      @transfer="
        () => {
          refreshmembers();
        }
      "
    />

    <dialogProjectList
      v-if="opendialogprojectlist && projects.length"
      :projects="projects"
      v-model="opendialogprojectlist"
    />

    <dialogSuccess
      v-model="opendialogsuccess"
      :message="dialogemsgsuccess"
      :title="dialogetitlesuccess"
    />

    <dialogDetailUser
      v-if="opendialogdetailuser && memberselectedvalue"
      :user="memberselectedvalue"
      v-model="opendialogdetailuser"
    />

    <dialogActivateUser
      userorganization="user"
      :onoff="memberselectedvalue.status == 'active' ? 'off' : 'on'"
      v-model="opendialogactivateuser"
      @confirm="confirmToggleUser"
    />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from "@vue/composition-api";
import { useMember } from "./useMember";
import dialogNpwpKtp from "./dialogNpwpKtp.vue";
import dialogEditUser from "./dialogEditUser.vue";
import dialogAddUser from "./dialogAddUser.vue";
import dialogDeleteUser from "./dialogDeleteUser.vue";
import dialogSuccess from "@/modules/costumedialog/dialogSuccess.vue";
import dialogRecendInviteUser from "./dialogResendInviteUser.vue";

import dialogProjectList from "./dialogProjectList.vue";
import dialogDetailUser from "./dialogDetailUser.vue";
import dialogTransferRoleUser from "./dialogTransferRoleUser.vue";
import { useRoles } from "@/modules/organization/userole";
import FileDownload from "js-file-download";
const {
  Parser,
  transforms: { unwind, flatten },
} = require("json2csv");
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { SUPERADMINMANAGEUSER } from "./namespace";
import dialogActivateUser from "./dialogActivateUser.vue";
// import Dialogsuccess from "../emailverification/dialogsuccess.vue";

import { AccessControl } from "@/lib/middleware";
export default defineComponent({
  components: {
    dialogNpwpKtp,
    dialogEditUser,
    dialogAddUser,
    dialogDeleteUser,
    dialogProjectList,
    dialogDetailUser,
    dialogActivateUser,
    dialogTransferRoleUser,
    dialogRecendInviteUser,
    dialogSuccess,
    // Dialogsuccess
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage User'));
    const memberselectedvalue: Ref<any> = ref("");
    const Composable = { ...useMember(), ...useRoles() };
    const { membersselected, members } = Composable;
    const headers = ref([
      {
        text: "Email",
        value: "email",
        sortable: false,
      },
      {
        text: "Organization",
        value: "organization",
      },
      {
        text: "Role",
        value: "role",
        width: "8%",
      },
      {
        text: "Verification",
        value: "is_identity_verified",
        width: "12%",
      },
      {
        text: "Join Date",
        value: "joindate",
        width: "13%",
      },
      {
        text: "Status",
        value: "status",
        width: "8%",
      },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center",
        width: "8%",
      },
    ]);
    const Download = () => {
      // const fields = ['id',	'organization_id',	'fullname',	'firstname',	'lastname',	'email',	'phone_number',	'npwp_privacy',	'role_id',	'photo',	'status',	'created_at',	'updated_at',	'deleted_at',	'organization',	'userproject',	'role']
      const json2csvParser = new Parser({
        quote: "",
        transforms: [
          unwind({ paths: ["userproject"], blankOut: true }),
          flatten("__"),
        ],
      });
      const csv = json2csvParser.parse(membersselected.value);
      FileDownload(csv, "users.csv");
    };
    const { organizations } = useNamespacedState(SUPERADMINMANAGEORG, [
      "organizations",
    ]);
    const { changestatus } = useNamespacedActions(SUPERADMINMANAGEUSER, [
      "changestatus",
    ]);

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      rowsPerPage: 10,
      search: "",
      sortBy: [],
      sortDesc: [],
      is_created: [],
    });

    const opendialogactivateuser = ref(false);

    const opendialogsuccess = ref(false);

    const confirmToggleUser = async () => {
      const res = await changestatus(memberselectedvalue.value)
      if (res.status < 300) {
        memberselectedvalue.value.status = memberselectedvalue.value.status == 'active' ? 'deactive' : 'active';
      }
      opendialogactivateuser.value = false;
    }

    return {
      read_only,

      dialogetitlesuccess:ref(""),
      dialogemsgsuccess:ref(""),
      opendialogsuccess,
      changestatus,
      opendialogactivateuser,
      organizations,
      headers,
      Download,
      projects: ref([]),
      opendialognpwpktp: ref(false),
      opendialogdetailuser: ref(false),
      opendialogprojectlist: ref(false),
      opendialogdeleteuser: ref(false),
      opendialogtransferuser: ref(false),
      opendialogresendinviteuser: ref(false),
      opendialogadduser: ref(false),
      memberselectedvalue,
      opendialogedituser: ref(false),
      log(e: any) {},
      ...Composable,
      members,
      show: ($event: any, item: any) => {
        memberselectedvalue.value = item;
      },
      confirmToggleUser,
    };
  },
  created() {
    this.fetchmembers();
    //FIXME:
    // this.fetchRoles();
  },
});
</script>

<style lang="scss" scoped>
.min-width-100 {
  min-width: 100px;
}
.min-width-130 {
  min-width: 130px;
}
.min-width-150 {
  min-width: 150px;
}
.min-width-200 {
  min-width: 200px;
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

.npwp-verified {
  cursor: pointer;
  color: #1f60a8;
}

.npwp-notverified {
  cursor: pointer;
  color: #eb5757;
}

.npwp-waiting-confirmation {
  cursor: pointer;
  color: #a5b3bf;
}
</style>
