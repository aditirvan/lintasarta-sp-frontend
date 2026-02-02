<template>
  <div>
    <v-card class="rounded-lg" flat>
      <v-card-text class="pa-8">
        <v-row class="">
          <v-col class="d-flex py-0">
            <!-- <p class="d-flex fz-21 font-weight-bold align-center justify-center">Interfaces</p> -->
            <v-spacer />
            <!-- <v-btn
            depressed
            width="150"
            height="50"
            class="secondary fz-14"
            @click="() => {
            dialogAdd = true
            }"
            >
            Create Interfaces
            </v-btn> -->
          </v-col>
        </v-row>

        <v-data-table
        class="my-3"
        :headers="headers"
        hide-default-footer
        :items="interfaces"
        :options.sync="options"
        :items-per-page="10"
        :server-items-length="totalRowsInterfaces"
        >
          <template v-slot:no-data>
            <v-progress-circular v-if="isLoadingInterfaces"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <div class="my-7 text-center" v-else>
              <p
                style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
                "
                class="font-weight-bold"
              >
                Looks like you don’t have any Floating IP
              </p>
            </div>
          </template>
          <template #[`item.ip_public`]="{ item }">
            <span> {{ item.ip_public ? item.ip_public : '-' }} </span>
          </template>
          <template v-slot:item.status="{ item }">
            <span
            v-if="item.status"
            :class="{
              'success--text': item.status == 'CREATED',
              'error--text' : item.status == 'FAILED',
              'grey--text' : item.status == 'ON-PROGRESS' 
              }"
            >{{ item.status }}</span>
            <span v-else>
              -
            </span>
          </template>
          <template v-slot:item.action="{ item }">
            <span
            v-if="item.status != 'ON-PROGRESS'"
            style="cursor: pointer"
            class="pl-3 error--text"
            @click="
              () => {
                selectedItem= item
                dialogDelete = true
                headerName = 'interface'
              }">
              Delete
            </span>
            <span class="grey--text" v-else>
              Delete
            </span>
          </template>
          <template v-slot:footer="{ props }" v-if="interfaces.length">
              <custom-footer-datatable
              @input="
                (val) => {
                  options = val;
                }
              " 
              :props="props" />
          </template>
        </v-data-table>
      </v-card-text>
      <dialog-add
      v-if="dialogAdd == true"
      v-model="dialogAdd"
      :vyos="vyos"
      @refreshTab="refreshTab"
      />

      <dialog-delete
      v-if="dialogDelete == true"
      v-model="dialogDelete"
      :itemSelected="selectedItem"
      :header="headerName"
      @refreshTab="refreshTab"
      />
    </v-card>
    </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { NETWORKVPC } from "../namespace.ts";
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import dialogAdd from './dialogAddInterface.vue'
import dialogDelete from './dialogDelete.vue'
import { AccessControl } from "@/lib/middleware";

export default {
  props:['value',],
  components:{
    dialogAdd,
    dialogDelete
  },
  setup(props, context) {
    const { vpcid, vyosid } = context.root._route.params;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { 
      fetchInterfaces,
      DETAIL_VPC2,
      } = useNamespacedActions(NETWORKVPC, [
      "fetchInterfaces",
      "DETAIL_VPC2",
    ]);

    const { 
      interfaces,
      totalRowsInterfaces,
      isLoadingInterfaces,
      vpc,
      // detailVyos: vyos
      } = useNamespacedState(NETWORKVPC, [
      "interfaces",
      "totalRowsInterfaces",
      "isLoadingInterfaces",
      "vpc",
      // "detailVyos"
    ]);

    const dialogAdd = ref(false)
    const dialogDelete = ref(false)
    const headerName = ref('')
    const selectedItem = ref(null)
    const textDelete = ref('')
    const headers = ref([
      { text: "Name", value: "instance_name", sortable: false  },
      // { text: "Port", value: "instance_port", sortable: false  },
      { text: "Public IP", value: "ip_public", sortable: false  },
      { text: "Billing Type", value: "billing_type", sortable: false  },
      { text: "Status", value: "status", sortable: false  },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center",
      },
    ])

    const vyos = ref(JSON.parse(localStorage.getItem("vyos")))
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      instance_id: vyos.value.instance_id
    })

    watch(options, async (val) => {
        try{
          if(val){
            await fetchInterfaces(val);
          }
        }finally {
            // loading.value = false;
        }
      },
      { deep: true }
    )

    onMounted(async() => {
      if(read_only.value){
        headers.value.pop()
      }
    })

    const refreshTab = async() => {
      options.value.page = 1
      await fetchInterfaces(options.value)
    }

    return{
      dialogAdd,
      headers,
      options,
      interfaces,
      totalRowsInterfaces,
      isLoadingInterfaces,
      vpc,
      refreshTab,
      dialogDelete,
      headerName,
      selectedItem,
      vyos
    }
  },
}
</script>