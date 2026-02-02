<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">Transfer Role Creator</div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-text-field
            maxlength="50"
            clearable
            v-model="searchC"
            class="search"
            placeholder="Search"
            outlined
            @click:clear="
              () => {
                searchC = '';
              }
            "
          ></v-text-field>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-data-table
        id="my-table"
        show-select
        @input="enterSelect($event)"
        :single-select="true"
        hide-default-footer
        :headers="headers"
        hide-default-header
        :items-per-page="5"
        :search="searchC"
        :items="creators"
        :server-items-length="paginationC.count"
        :options.sync="optionsCreator"
        v-model="creatorselected"
      >
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          >
          </v-data-table-header>
        </template>
       
        <template v-slot:item.email="{ item }">
          {{ item.email }}
        </template>

        <template v-slot:footer="{ props }">
          <custom-footer-datatable
            @input="
              (val) => {
                optionsCreator = { ...optionsCreator, ...val };
              }
            "
            :props="props"
          />
        </template>

      </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              id="Update"
              depressed
              height="45"
              block
              class="secondary"
              @click="transfer"
              >Transfer Creator</v-btn
            ></v-col
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {useDialog} from '@/composable/usedialog'
import { defineComponent, ref, Ref, watch } from "@vue/composition-api";
import { useCreator } from "./useCreator";
import { useNamespacedMutations } from "vuex-composition-helpers";

export default {
  props: ["value", "user", "memberselectedvalue"],
  setup(props, { emit, root }) {
    const { dialog } = useDialog(props, { emit });
    // const orgId = ref(props.memberselectedvalue.id)
    
     const Composable = { ...useCreator() };
     const { creatorselected, creators, org, idSelect, tfcreator } = Composable;
     org.value=props.memberselectedvalue.organization_id;

     const headers = ref([
      {
        text: "Email",
        value: "email",
      },
      
    ]);
    // const orgId=props.memberselectedvalue.id;
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

  

    return {
      headers,
      ...Composable,
      dialog,
      enterSelect: async (v) => {
        idSelect.value = v.map(function(v){ return v.id })
       
      },
      transfer: async () => {
      
        const Value = {
          id: idSelect.value[0],
          user_id: props.memberselectedvalue.id,
          organization_id: props.memberselectedvalue.organization_id,
        };
        
        console.log(Value);
        return await tfcreator(Value).then(() => {
          dialog.value = false;
          emit("transfer");
          setopendialogcommonsuccess(true);
        });
      },
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  ::v-deep .v-input__slot {
    margin-bottom: 0px;
  }
}
.v-input--selection-controls {
  margin-top: 0;
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
.v-input--is-readonly {
  ::v-deep input {
    cursor: auto;
  }
}
</style>