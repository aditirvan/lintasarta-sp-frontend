<template>
<div>
  <v-card class="rounded-lg" flat>
    <v-card-text class="pa-8">
      <v-row class="">
        <v-col class="d-flex py-0">
          <!-- <p class="d-flex fz-21 font-weight-bold align-center justify-center">Routing</p> -->
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
            Create Routing 
          </v-btn> -->
        </v-col>
      </v-row>

      <v-data-table
      class="my-3"
      :headers="headerSR"
      hide-default-footer
      :items="staticRoutings"
      :options.sync="options"
      :items-per-page="10"
      :server-items-length="totalRowsSR"
      >

        <template v-slot:no-data>
          <v-progress-circular v-if="isLoadingSR"
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
              Looks like you don’t have any Routes
            </p>
          </div>
        </template>
        <template v-slot:item.ip="{ item }">
          <p>{{ item.ip }} <span>/</span> {{ item.network_size }}</p>
        </template>
        <template v-slot:item.status="{ item }">
          <span
          v-if="item.status"
          class="black--text"
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
              selectedSR = item
              dialogDelete = true
              headerName = 'staticroute'
            }">
            Delete
          </span>
          <span class="grey--text" v-else>
            Delete
          </span>
        </template>
        <template v-slot:footer="{ props }" v-if="staticRoutings.length">
          <custom-footer-datatable @input="(val) => options = val" :props="props" />
        </template>
      </v-data-table>

    </v-card-text>
  </v-card>
  <dialogAddsr
  v-if="dialogAdd == true"
  v-model="dialogAdd"
  :vyos="vyos"
  @refreshTab="refreshTab"
  />

  <dialog-delete
  v-if="dialogDelete == true"
  v-model="dialogDelete"
  :itemSelected="selectedSR"
  :header="headerName"
  @refreshTab="refreshTab"
  />
</div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from "../namespace.ts";
import dialogAddsr from './dialogAddStaticRoute.vue'
import dialogDelete from './dialogDelete.vue'
import { AccessControl } from "@/lib/middleware";

export default{
  components:{
    dialogAddsr,
    dialogDelete
  },
  props:["value"],
  setup(props, context){
    const { vpcid, vyosid } = context.root._route.params;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { 
      fetchStaticRouting,
      deleteStaticRouting,
      DETAIL_VPC2,
      } = useNamespacedActions(NETWORKVPC, [
      "fetchStaticRouting",
      "deleteStaticRouting",
      "DETAIL_VPC2",
    ]);

    const { 
      staticRoutings,
      totalRowsSR,
      isLoadingSR,
      vpc,
      // detailVyos: vyos
      } = useNamespacedState(NETWORKVPC, [
      "staticRoutings",
      "totalRowsSR",
      "isLoadingSR",
      "vpc",
      // "detailVyos"
    ]);

    // watch(() => props.value, async (newVal) => {
    //   if(newVal){
    //     options.value.page = 1
    //     await fetchStaticRouting(options.value);
    //     await DETAIL_VPC2({id: vpcid})
    //   }
    // })

    const dialogAdd = ref(false)
    const headerSR = ref([
      // { text: "Name", value: "instance_name", sortable: false  },
      { text: "Destination CIDR", value: "ip", sortable: false  },
      // { text: "Network Size", value: "network_size" },
      { text: "Nexthop", value: "nexthop", sortable: false  },
      { text: "Description", value: "description", sortable: false  },
      { text: "Status", value: "status", sortable: false  },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center",
      },
    ])

    const selectedSR = ref(null)
    const textDelete = ref('')
    const dialogDelete = ref(false)
    const doDelete = async() => {
      let payload = {
        id: selectedSR.value.id,
      }
      let resp = await deleteStaticRouting(payload)
      if(resp.status == 200){
        refreshTab()
        dialogDelete.value = false
        textDelete.value = ''
      }else{
        console.log(resp)
      }
    }

    const vyos = ref(JSON.parse(localStorage.getItem("vyos")))
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      instance_id: vyos.value.instance_id
    })
    watch(options, async (val) => {
        // loading.value = true
        try{
          if(val){
            await fetchStaticRouting(val);
          }
        }finally {
            // loading.value = false;
        }
      },
      { deep: true }
    )

    const refreshTab = async() => {
      options.value.page = 1
      await fetchStaticRouting(options.value)
    }

    onMounted(async () => {
      if(read_only.value){
        headerSR.value.pop()
      }
      // console.log(props.value)
      // await fetchStaticRouting()
    })
    return{
      headerSR,
      options,
      staticRoutings,
      totalRowsSR,
      dialogAdd,
      selectedSR,
      dialogDelete,
      textDelete,
      doDelete,
      refreshTab,
      isLoadingSR,
      headerName: ref(''),
      vyos
    }
  }
}
</script>