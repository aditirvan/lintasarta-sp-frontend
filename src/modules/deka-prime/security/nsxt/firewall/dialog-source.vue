<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4">
          Select Source Firewall Groups
        </div>
      </v-card-title>
      <v-card-text class="px-7">
        <v-data-table
        v-model="selectedItems"
        :headers="headers"
        :items="listSummary"
        :options.sync="options"
        :items-per-page="10"
        :server-items-length="rowsSummary"
        class="elevation-0"
        hide-default-footer
        show-select
        >
          <template v-slot:item.typeValue="{ item }">
            {{ formatType(item.typeValue) }}
          </template>
          
          <template v-slot:item.applicationPorts="{ item }">
            <div class="scroll2">
              <div class="d-flex" v-for="(row, key) in item.applicationPorts" :key="key" >
                <div class="my-0 py-0">{{ row.protocol }}</div>
                <div class="my-0 py-0 px-2"> : </div>
                <div class="my-0 py-0" v-for="(destination, i) in row.destinationPorts" :key="i">
                  {{ destination }}
                </div>
              </div>
            </div>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
            @input="
            (val) => {
              options = val ;
            }
            "
            :props="props"/>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-start">
          <v-col class="d-flex flex-row justify-center" cols="6">
            <v-btn class="white--text" color="#a5b3bf" block height="35" @click="dialog = false"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="6">
            <v-btn color="secondary" block height="35" @click="onConfirm"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { DPSECURITY } from '../../namespace'

export default {
  props: ["value", "dataSelected"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { fetchSummary } = useNamespacedActions( DPSECURITY, ["fetchSummary"])
    const { listSummary, rowsSummary } = useNamespacedGetters(DPSECURITY, ["listSummary", "rowsSummary"])

    const selectedItems = ref([])
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Type", value: "typeValue",  sortable: false },
      { text: "Description", value: "description",  sortable: false },
    ])

    const options = ref({
      page: 1,
      pageSize: 10,
      idEdge: context.root.$route.params.idEdge
    })

    watch(options,async (val) => {
      try {
          await fetchSummary(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    onMounted(async() => {
      await fetchSummary(options.value)
      selectedItems.value = props.dataSelected
      console.log(selectedItems.value)
    })

    const onConfirm = () => {
      let mapSelected = selectedItems.value.map((x) => {
        return{
          id: x.id,
          name: x.name
        }
      })
      console.log(mapSelected)
      context.emit('sendSelected', mapSelected)
      dialog.value = false
    }

    const formatType = (type) => {
      return type.replace('_', ' ')
    }

    return {
      dialog,
      headers,
      selectedItems,
      options,
      listSummary,
      rowsSummary,
      onConfirm,
      formatType
    }
  },
}
</script>

<style scoped>
.scroll2 {
  max-height: 65px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>