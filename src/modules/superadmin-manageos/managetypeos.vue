<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
   <v-card-text class="d-flex flex-row align-center">
     
    <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Manage Type Operation System</p>
          <v-spacer />
        
          <div style="height: auto; width: 30px" />
          <v-btn
            id="CreateNewUser"
            depressed
            height="50"
            width="150"
            class="secondary"
            @click="
              () => {
                // opendialogadduser = true;
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
        show-select
        hide-default-footer
        :headers="headers"
        hide-default-header
        :items-per-page="5"
        :search="search"
        :items="members"
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
          {{ item.name }}
        </template>
        <template v-slot:item.description="{ item }">
          {{ item.description }}
        </template>

        <template v-slot:item.action="{ item }">
              <div>
                <label
                  style="cursor: pointer"
                  @click="
                    () => {
                       // itemdefaultedited = item;
                    }
                  "
                  ><span class="primary--text">Edit</span>
                </label>
              </div>
        </template>

       
      

       
        <template v-slot:footer="{ props }">
          <custom-footer-datatable
            @input="
              (val) => {
                // options = { ...options, ...val };
              }
            "
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch } from "@vue/composition-api";
// import { useMember } from "./useMember";
// import dialogEditUser from "./dialogEditUser.vue";
// import dialogAddUser from "./dialogAddUser.vue";
// import dialogDeleteUser from "./dialogDeleteUser.vue";

// import dialogRecendInviteUser from "./dialogResendInviteUser.vue";

// import dialogProjectList from "./dialogProjectList.vue";
// import dialogDetailUser from "./dialogDetailUser.vue";

const { Parser, transforms: { unwind, flatten } } = require("json2csv");
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { SUPERADMINMANAGEOS } from "./namespace";
// import dialogActivateUser from './dialogActivateUser.vue'
export default defineComponent({
  components: {
    // dialogEditUser,
    // dialogAddUser,
    // dialogDeleteUser,
    // dialogProjectList,
    // dialogDetailUser,
    // dialogActivateUser,
    // dialogRecendInviteUser
  },
  setup() {
    // const memberselectedvalue: Ref<any> = ref("");
    // const Composable = { ...useMember() };
    // const { membersselected, members } = Composable;
    const headers = ref([

      {
        text: "Name",
        value: "name",
      },
      {
        text: "Description",
        value: "description",
      },

      {
        text: "Action",
        value: "action",
      },
    ]);
   
  
    // const { changestatus } = useNamespacedActions(SUPERADMINMANAGEOS, [
    //   "changestatus",
    // ]);
    
    const opendialogactivateuser = ref(false)
    return {
     
      headers,
      search:[],
      members:[],
      pagination:[],

      // Download,
    
      
    };
  },
  created() {
    

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