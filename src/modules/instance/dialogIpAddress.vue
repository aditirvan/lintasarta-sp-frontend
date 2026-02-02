<template>
   <v-dialog v-model="dialog" width="1020">
      <v-card >
          <v-card-title class="font-weight-bold fz-21">
              IP Address
          </v-card-title>                    
          <v-card-text>            
            <v-data-table
              class="elevation-0 mb-30px"
              :hide-default-footer="true"
              :headers="headers"
              :items="item.ins_vpc_port"
            >            

            <template v-slot:item.ip_gateway="{ item }">
                <span v-if="item.ip_gateway && item.ip_gateway.length">
                    <div v-for="ip in item.ip_gateway" :key="ip">{{ ip }} </div>
                </span>
                <span v-else></span>
            </template>

            <template v-slot:item.internal="{ item }">
                <span v-if="item.internal && item.internal.length">
                    <div v-for="ip in item.internal" :key="ip">{{ ip }}</div>
                </span>
                <span v-else></span>
            </template>

            <template v-slot:item.mac_address="{ item }">
                <span v-if="item.mac_address && item.mac_address.length">
                    <div v-for="ip in item.mac_address" :key="ip">{{ ip }}</div>
                </span>
                <span v-else></span>
            </template>

            <template v-slot:item.external="{ item }">
                <span v-if="item.external && item.external.length">
                    <div v-for="ip in item.external" :key="ip">{{ ip }}</div>
                </span>
                <span v-else></span>
            </template>

          
            </v-data-table>
          </v-card-text>
          <br/>
          <v-card-text>
              <v-btn @click="()=>{dialog=false}" block depressed class="accent">Close</v-btn>
          </v-card-text>
      </v-card>
  </v-dialog>
</template>
<style>
  .mb-dr{
      margin-bottom:-3% !important;
  }
</style>
<script>
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props:['value', 'item'],
  setup(props, context) {
    console.log("value ", props.value);
    console.log("item ", props.item);
      const {dialog} = useDialog(props, context)
      return {
          dialog
      }
  },
  data (){
    return{
      headers: [
        { text: "VPC", value: "vpc_name", width:"15%" },   
        { text: "Type", value: "type",width:"15%"  },   
         {
          text: "Gateway",
          value: "ip_gateway",
          width: "15%",
        },
        { text: "Internal", value: "internal" },
        { text: "Mac Address", value: "mac_address" },
        { text: "External", value: "external" },          
      ],
    }
  }
})
</script>
