<template>
    <v-navigation-drawer v-model="drawer" app :clipped="$vuetify.breakpoint.lgAndUp" dark class="warning" width="248">
        <v-list dense v-for="item in menu" :key="item.name">
            <v-subheader>
                {{item.name}}
            </v-subheader>
            <v-list-item v-for="submenu in item.list" :key="submenu.link" router :to="item.link">
                <v-list-item-icon>
                    <v-icon style="color:white">${{submenu.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="submenu.name" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data : () => ({
        drawer : true,
        menu : [
            {
                name: 'PROJECT',
                list : [
                    {name : 'Project', link : 'project', icon: 'newprojectIcon'},
                ]  
            },
            {
                name : 'MANAGE',
                list : [
                    {name : 'Instance', link : 'instance', icon: 'instanceIcon'},
                    {name : 'Storage', link : 'image', icon: 'storageIcon'},
                    {name : 'Object Storage', link : 'storage', icon: 'objectstorageIcon'},
                    {name : 'Images', link : 'network', icon: 'imagesIcon'},
                    {name : 'Network', link : 'security', icon: 'networkIcon'},
                    {name : 'Security', link : 'monitoring', icon: 'securityIcon'},
                    {name : 'Alerting', link: 'alerting', icon: 'alertingIcon'}
                ],  
            },

            {
                name : 'BILLING',
                list : [
                    {name : 'Billing', link : 'billing', icon: 'billingIcon'},
                    // {name : 'Billing Payment', link : '/billing/payment', icon: 'billingPaymentIcon'}
                ]
            }
        ]
        

    })
}
</script>

<style scoped>
.v-list-item__icon {
    margin-right: 15px !important;
}
</style>