<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="d-flex flex-row align-center">
     
    <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Manage Super Admin</p>
          <v-spacer />
          <v-text-field
            maxlength="50"
            hide-details
            outlined
            style="max-width: 200px"
            placeholder="Search By Email"
            v-model="search"
          ></v-text-field>
          <div style="height: auto; width: 30px" />
          <v-btn
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
          >
            <span class="fz-14">Create New Admin</span>
          </v-btn>
        </v-col>
    </v-row>

    </v-card-text>
    
    <v-card-text>
      <v-data-table
        id="my-table"
        show-select
        hide-default-footer
        :headers="headers"
        hide-default-header
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
        <template v-slot:item.name="{ item }">
          {{ item.users.fullname }}
        </template>
        <template v-slot:item.email="{ item }">
          {{ item.email }}
        </template>

        <template v-slot:item.phone_number="{ item }">
          {{ item.phone_number }}
        </template>

       
      

         <template v-slot:item.statususer="{ item }">
         <div v-if="item.verified_at!=''">Verified</div>
         <div v-else>Unverified</div>
        </template>
        <template v-slot:item.status="{ item }">
          <v-switch
            true-value="active"
            false-value="deactive"
            flat
            readonly
            @click="()=>{
              memberselectedvalue = item
              opendialogactivateuser = true
            }"
            :input-value="item.status"
          ></v-switch>
        </template>
        <template v-slot:item.joindate="{ item }">
          {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:item.action="{ item }">
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
                    show($event, item);
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

              <v-list-item
                :disabled="item.status=='active'"
                @click="
                  () => {
                    memberselected = item;
                    opendialogresendinviteuser = true;
                  }
                "
              >
                <v-list-item-title 
                  >Resend Invitation</v-list-item-title
                >
              </v-list-item>

         

              <v-divider style="min-width: 160px" />
              
              <v-list-item
                @click="
                  () => {
                    memberselectedvalue = item;
                    opendialogedituser = true;
                  }
                "
              >
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="
                  () => {
                    memberselectedvalue = item;
                    opendialogdetailuser = true;
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
                
                @click="
                  () => {
                    memberselected = item;
                    opendialogdeleteuser = true;
                  }
                "
              >
                <v-list-item-title class="error--text"
                  >Delete</v-list-item-title
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
    <dialogDeleteUser
      v-model="opendialogdeleteuser"
      @confirm="deletememberselected"
    />

    <dialogRecendInviteUser
      v-model="opendialogresendinviteuser"
      @confirm="resendinvitememberselected"
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
   
    <dialogDetailUser
      v-if="opendialogdetailuser && memberselectedvalue"
      :user="memberselectedvalue"
      v-model="opendialogdetailuser"
    />
    <dialogActivateUser
     userorganization="user" 
     :onoff="memberselectedvalue.status == 'active'? 'off' : 'on'" 
     v-model="opendialogactivateuser"
     @confirm="()=>{
       changestatus(memberselectedvalue).then(()=>{
         opendialogactivateuser = false
         memberselectedvalue.status = ( memberselectedvalue.status == 'active') ? 'deactive' : 'active'
       })
     }"
      />
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch } from "@vue/composition-api";
import { useMember } from "./useMember";
import dialogEditUser from "./dialogEditUser.vue";
import dialogAddUser from "./dialogAddUser.vue";
import dialogDeleteUser from "./dialogDeleteUser.vue";

import dialogRecendInviteUser from "./dialogResendInviteUser.vue";

import dialogProjectList from "./dialogProjectList.vue";
import dialogDetailUser from "./dialogDetailUser.vue";

const { Parser, transforms: { unwind, flatten } } = require("json2csv");
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { GODMODEMANAGEUSER } from "./namespace";
import dialogActivateUser from './dialogActivateUser.vue'
export default defineComponent({
  components: {
    dialogEditUser,
    dialogAddUser,
    dialogDeleteUser,
    dialogProjectList,
    dialogDetailUser,
    dialogActivateUser,
    dialogRecendInviteUser
  },
  setup() {
    const memberselectedvalue: Ref<any> = ref("");
    const Composable = { ...useMember() };
    const { membersselected, members } = Composable;
    const headers = ref([
      {
        text: "Fullname",
        value: "fullname",
      },
      {
        text: "Email",
        value: "email",
      },
      {
        text: "Phone",
        value: "phone_number",
      },
     
      {
        text: "Date",
        value: "joindate",
      },
      {
        text: "User Status",
        value: "statususer",
      },
      {
        text: "Status",
        value: "status",
      },
      {
        text: "Action",
        value: "action",
      },
    ]);
    // const Download = () => {
    //   // const fields = ['id',	'organization_id',	'fullname',	'firstname',	'lastname',	'email',	'phone_number',	'npwp_privacy',	'role_id',	'photo',	'status',	'created_at',	'updated_at',	'deleted_at',	'organization',	'userproject',	'role']
    //   const json2csvParser = new Parser( { quote: '', transforms:[unwind({ paths:['userproject'], blankOut: true }),flatten('__')]});
    //   const csv = json2csvParser.parse(membersselected.value);
    //   FileDownload(csv, 'users.csv');
    // };
  
    const { changestatus } = useNamespacedActions(GODMODEMANAGEUSER, [
      "changestatus",
    ]);
    
    const opendialogactivateuser = ref(false)
    return {
      changestatus,
      opendialogactivateuser,
      headers,
      // Download,
      opendialogdetailuser: ref(false),
      opendialogprojectlist: ref(false),
      opendialogdeleteuser: ref(false),
      opendialogresendinviteuser: ref(false),
      opendialogadduser: ref(false),
      memberselectedvalue,
      opendialogedituser: ref(false),
      log(e: any) {
      },
      ...Composable,
      members,
      show: ($event: any, item: any) => {
        memberselectedvalue.value = item;
        console.log(memberselectedvalue);
      },
    };
  },
  created() {
    this.fetchmembers();

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
.v-input{
  ::v-deep .v-input__append-outer{
  margin: 0px 0px !important;
}
}

</style>