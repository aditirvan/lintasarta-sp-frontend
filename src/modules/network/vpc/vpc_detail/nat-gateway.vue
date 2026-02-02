<template>
  <div>
    <v-card class="rounded-lg" flat>
      <v-card-text class="pa-8">
        <v-row class="">
          <v-col class="d-flex py-0">
            <!-- <p class="d-flex fz-21 font-weight-bold align-center justify-center">NAT</p> -->
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
              Create NAT
            </v-btn> -->
          </v-col>
        </v-row>

        <v-data-table
        class="my-3"
          :headers="headerNG"
          hide-default-footer
          :items="natGateways"
          :options.sync="options"
          :items-per-page="10"
          :server-items-length="totalRowsNG"
        >

          <template v-slot:no-data>
            <v-progress-circular v-if="isLoadingNat"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <div class="my-7 text-center" v-else>
              <p
              v-if="interfaces.length"
                style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
                "
                class="font-weight-bold"
              >
                Looks like you don’t have any NAT
              </p>
              <p v-else
              style="
                font-size: 16px;
                margin-bottom: 10px;
                "
                class="font-weight-bold">
                You must be add a Floating IP
              </p>
            </div>
          </template>
          <template #[`item.type`]="{ item }">
            <span> {{ item.type == 'many' ? 'DNAT' : 'SNAT' }} </span>
          </template>
          <template #[`item.translation_address`]="{ item }">
            <span>{{ item.translation_name }} - {{ item.translation_address }}</span>
          </template>
          <template v-slot:item.protocol="{ item }">
            <span v-if="item.type == 'many'"> {{ uppercaseWord(item.protocol) }} / {{ item.destination_port }}</span>
            <span v-else>-</span>
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
                selectedItem = item
                dialogDelete = true
                headerName = 'nat'
              }">
              Delete
            </span>
            <span class="grey--text" v-else>
              Delete
            </span>
          </template>
          <template v-slot:footer="{ props }" v-if="natGateways.length">
            <custom-footer-datatable @input="(val) => options = val" :props="props" />
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>
    <dialog-add-nat
    v-if="dialogAdd == true"
    v-model="dialogAdd"
    @refreshTab="refreshTab"
    />

    <dialog-delete
    v-if="dialogDelete == true"
    v-model="dialogDelete"
    :itemSelected="selectedItem"
    :header="headerName"
    @refreshTab="refreshTab"
    />
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from "../namespace.ts";
import dialogAddNat from './dialogAddNat.vue'
import dialogDelete from './dialogDelete.vue'
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogAddNat,
    dialogDelete
  },
  props:["value"],
  setup(props, context) {
    const {  vyosid } = context.root._route.params;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { 
      fetchNatGateway,
      DETAIL_VPC2,
      fetchInterfaces,
      } = useNamespacedActions(NETWORKVPC, [
      "fetchNatGateway",
      "DETAIL_VPC2",
      "fetchInterfaces",
    ]);

    const { 
      natGateways,
      totalRowsNG,
      isLoadingNat,
      vpc,
      interfaces,
      // detailVyos: vyos
      } = useNamespacedState(NETWORKVPC, [
      "natGateways",
      "totalRowsNG",
      "isLoadingNat",
      "vpc",
      "interfaces",
      // "detailVyos"
    ]);

    // watch(() => props.value, async (newVal) => {
    //   if(newVal){
    //     options.value.page = 1
    //     await fetchNatGateway(options.value);
    //     await DETAIL_VPC2({id: vpcid})
    //     await fetchInterfaces({itemsPerPage: 100,instance_id: vpc.value.vyos.instance_id})
    //   }
    // })

    const headerNG = ref([
      { text: "Type", value: "type", sortable: false  },
      { text: "Destination Address", value: "destination_address", sortable: false  },
      { text: "Translation Address", value: "translation_address", sortable: false  },
      // { text: "Network Size", value: "network_size" },
      { text: "Protocol", value: "protocol", sortable: false  },
      // { text: "Rule Number", value: "rule_number", sortable: false  },
      { text: "Description", value: "rule_desc", sortable: false, },
      { text: "Status", value: "status", sortable: false  },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center",
      },
    ])
    const textDelete = ref('')
    const dialogDelete = ref(false)
    const  selectedItem = ref(null)

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
            await fetchNatGateway(val);
            await fetchInterfaces({itemsPerPage: 100,instance_id: vyos.value.instance_id})
          }
        }finally {
            // loading.value = false;
        }
      },
      { deep: true }
    )

    const refreshTab = async() => {
      options.value.page = 1
      await fetchNatGateway(options.value)
    }

    const uppercaseWord = (str) => {
      return str.toUpperCase()
    }

    const dialogAdd = ref(false)

    onMounted(() =>{
      if(read_only.value){
        headerNG.value.pop()
      }
    })

    return {
      dialogAdd,
      dialogDelete,
      natGateways,
      totalRowsNG,
      headerNG,
      options,
      refreshTab,
      isLoadingNat,
      textDelete,
      uppercaseWord,
      selectedItem,
      headerName: ref(''),
      interfaces
    }
  },
}
</script>