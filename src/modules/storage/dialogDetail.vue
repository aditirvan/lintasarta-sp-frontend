<template>
    <v-dialog v-model="dialog" width="650" v-if="selectedStorage">
        <v-card >
            <v-card-title class="font-weight-bold fz-21">
                Detail Storage
            </v-card-title>
            <v-card-text>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Name</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.name}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Billing Type</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.billing_type}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Storage Type</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.storage_type}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Size</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.size}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Instance Name</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.instance == null ? '-' : ` ${selectedStorage.path} on ${selectedStorage.instance.instanceName }` }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Region</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.proj_region}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Zone</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.zone_name}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Created Date</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedStorage.createdateymd}}</p>
                   </v-col>                   
               </v-row>                                       
            </v-card-text>              
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
    props:['value', 'selectedStorage'],
    setup(props, context) {
        const {dialog} = useDialog(props, context)
        return {
            dialog
        }
    },
})
</script>
