<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
   <v-card-text class="d-flex flex-row align-center">
     
    <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Manage Type Instance</p>
          <v-spacer />
        
           
          <div style="height: auto; width: 30px" />
          <v-btn
            v-if="!read_only"
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
        :items="flavorstype"
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
        <template v-slot:item.name="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:item.description="{ item }">
          {{ item.description }}
        </template>


        <template v-slot:item.action="{ item }">
          <span
              @click="
                () => {
                  if(read_only){
                    return
                  }
                  typeselectedvalue=item;
                  opendialogedittype=true;
                }
              "
              class="pr-3 edit"
              :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
              >Edit
          </span>

          <span
              @click="
                () => {
                  if(read_only){
                    return
                  }
                  typeselected = item;
                  opendialogdeletetype = true;
                }
              "
              class="error--text pr-3 delete ml-4"
              :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
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

import { AccessControl } from "@/lib/middleware";

// import dialogRecendInviteUser from "./dialogResendInviteUser.vue";

// import dialogProjectList from "./dialogProjectList.vue";
// import dialogDetailUser from "./dialogDetailUser.vue";

const { Parser, transforms: { unwind, flatten } } = require("json2csv");
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
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Pricing'));
    const typeselectedvalue: Ref<any> = ref("");
    const Composable = { ...useType() };
    const { typessselected, flavorstype } = Composable;
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
   
    watch
    //const opendialogactivateuser = ref(false)
    return {
      read_only,
      
      headers,
      opendialogdeletetype: ref(false),
      opendialogaddtype: ref(false),
      typeselectedvalue,
      opendialogedittype: ref(false),
      ...Composable,
      flavorstype,
      show: ($event: any, item: any) => {
        typeselectedvalue.value = item;
      },

      // Download,
    
      
    };
  },
  created() {
    this.fetchflavorstype();

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