<template>
    <v-dialog v-model="dialog" width="650">
        <v-card >
            <v-card-title class="font-weight-bold fz-21">
                Detail Region
            </v-card-title>
            <v-card-text>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Name</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedRegion.actual_name}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Alias</p>                       
                   </v-col>                   
                   <v-col cols="6">
                        <p>{{selectedRegion.name}}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Description</p>                       
                    </v-col>                    
                    <v-col cols="6">                       
                        <p>{{ selectedRegion.description ? selectedRegion.description : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">CPU Limit</p>                                         
                   </v-col>
                   <v-col cols="6">
                        <span
                            :class="{'error--text': selectedRegion.cpu_usage >= selectedRegion.cpu_limit}"
                        >
                            {{ selectedRegion.cpu_limit ? `${selectedRegion.cpu_usage}/${selectedRegion.cpu_limit} GB` : '-' }}
                        </span>
                   </v-col>                   
                </v-row>                           
                <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Memory Limit</p>                                               
                    </v-col>
                    <v-col cols="6">
                        <span
                            :class="{'error--text': selectedRegion.ram_usage >= selectedRegion.ram_limit}"
                        >
                            {{ selectedRegion.ram_limit ? `${selectedRegion.ram_usage}/${selectedRegion.ram_limit} GB` : '-' }}
                        </span>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Root Disk</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.root_disk ? selectedRegion.root_disk+' GB' : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col csols="6">
                        <p class="font-weight-bold">Data Disk</p>                       
                    </v-col>
                    <v-col cols="6">
                            <p>{{ selectedRegion.data_disk ? selectedRegion.data_disk+' GB' : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Snapshot Instance Volume</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.snapshot_instance_vol ? selectedRegion.snapshot_instance_vol+' GB' : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Snapshot Storage Volume</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.snapshot_storage_vol ? selectedRegion.snapshot_storage_vol+' GB' : '-' }}</p>
                    </v-col>
               </v-row>                           
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Daily Backup Volume</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.daily_backup_vol ? selectedRegion.daily_backup_vol+' GB' : '-' }}</p>
                   </v-col>                   
               </v-row>    
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Custom Image Volume</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.custom_image_vol ? selectedRegion.custom_image_vol+' GB' : '-' }}</p>
                    </v-col>
               </v-row>                          
            </v-card-text>
            <v-card-title class="font-weight-bold fz-21">
                Data Credential Openstack 
            </v-card-title>
            <v-card-text>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Admin Username</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.username ? selectedRegion.credential_openstack.username : '-' }}</p>
                   </v-col>
                   <!-- <v-col cols="6">
                       <p class="font-weight-bold">Admin Password</p>
                       <p>{{ selectedRegion.credential_openstack.password ? selectedRegion.credential_openstack.password : '-' }}</p>
                   </v-col> -->
               </v-row>            
               <v-row class="mb-dr">
                   <v-col cols="6">
                        <p class="font-weight-bold">Admin Project ID</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.project_id ? selectedRegion.credential_openstack.project_id : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Admin ID</p>                       
                    </v-col>
                    <v-col cols="6">
                            <p>{{ selectedRegion.credential_openstack.admin_id ? selectedRegion.credential_openstack.admin_id : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Role Admin ID</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.role_admin_id ? selectedRegion.credential_openstack.role_admin_id : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Role Member ID</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.role_member_id ? selectedRegion.credential_openstack.role_member_id : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Role Admin ID</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.role_admin_id ? selectedRegion.credential_openstack.role_admin_id : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Role Member ID</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.role_member_id ? selectedRegion.credential_openstack.role_member_id : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">External Network ID</p>                       
                   </v-col>
                   <v-col cols="">
                    <p>{{ selectedRegion.credential_openstack.external_network_id ? selectedRegion.credential_openstack.external_network_id : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Load Balancer Url</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.load_balancer_url ? selectedRegion.credential_openstack.load_balancer_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Auth Url</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.auth_url ? selectedRegion.credential_openstack.auth_url : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Alarm Url</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.alarm_url ? selectedRegion.credential_openstack.alarm_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Openstack Url</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.url ? selectedRegion.credential_openstack.url : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Metric Url</p>                       
                    </v-col>
                    <v-col cols="6">
                            <p>{{ selectedRegion.credential_openstack.metric_url ? selectedRegion.credential_openstack.metric_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Network Url</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.network_url ? selectedRegion.credential_openstack.network_url : '-' }}</p>
                   </v-col>                   
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Compute Url</p>                       
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.compute_url ? selectedRegion.credential_openstack.compute_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                   <v-col cols="6">
                       <p class="font-weight-bold">Volume Url</p>                       
                   </v-col>
                   <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.volume_url ? selectedRegion.credential_openstack.volume_url : '-' }}</p>
                   </v-col>                   
               </v-row>               
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Image Url</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.image_url ? selectedRegion.credential_openstack.image_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Console Url</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.console_url ? selectedRegion.credential_openstack.console_url : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Domain ID</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.domain_id ? selectedRegion.credential_openstack.domain_id : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Domain Name</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.domain_name ? selectedRegion.credential_openstack.domain_name : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Openstack Project Name</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.project_name ? selectedRegion.credential_openstack.project_name : '-' }}</p>
                    </v-col>
               </v-row>
               <v-row class="mb-dr">
                    <v-col cols="6">
                        <p class="font-weight-bold">Openstack DNS Name Servers</p>                        
                    </v-col>
                    <v-col cols="6">
                        <p>{{ selectedRegion.credential_openstack.dns_nameservers ? selectedRegion.credential_openstack.dns_nameservers : '-' }}</p>
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
    props:['value', 'selectedRegion'],
    setup(props, context) {
        const {dialog} = useDialog(props, context)
        return {
            dialog
        }
    },
})
</script>
