<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card class="rounded-lg elevation-0">
                    <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
                        <v-tabs slider-size="4">
                            <v-tab to="/overview/package-monthly">
                            <span class="ml-4" style="font-size: 16px">Monthly </span>
                            </v-tab>
                            <v-tab to="/overview/package-addons">
                            <span style="font-size: 16px">
                                Add Ons
                            </span>
                            </v-tab>
                        </v-tabs>
                    </v-card-text>
                    <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="$route.path">
                        <!-- Monthly -->
                        <v-tab-item value="/overview/package-monthly">
                            <router-view></router-view>
                        </v-tab-item>
                        <v-tab-item value="/overview/package-addons">
                            <router-view></router-view>
                        </v-tab-item>
                    </v-tabs-items>

                    <!-- <v-row>
                        <v-col class="d-flex justify-center fz-20" cols="12">
                            <span>Package Choice</span>
                        </v-col>
                    </v-row> -->
                            <!-- <v-slide-group
                            class="pa-4"
                            active-class="success"
                            show-arrows
                            > -->
                    <!-- <v-row class="mt-5 d-flex justify-center">
                        <v-col v-for="list in getListPackageMonthly" :key="list.id" class="d-flex flex-column" cols="3">
                            <v-card class="d-flex flex-column justify-space-around rounded-lg elevation-3 px-2">
                                <span class="d-flex justify-center my-2 fz-20 indigo--text">{{ list.name }}</span>
                                <v-divider></v-divider>
                                <div v-html="list.description"></div>
                                <span class="d-flex ml-3 mt-4 fz-15">Quota: {{ list.quota | qoutaUn }}/Month</span>
                                <span class="d-flex ml-3 mt-1 mb-8 fz-16 font-weight-bold">Price: {{ IDRformat.format(list.price) }}</span>
                                <div class="d-flex justify-center align-center my-2" v-if="getActivePackageMonthly.length && getActivePackageMonthly[0].monthly == 'true'">
                                    <v-chip v-if="getActivePackageMonthly[0].package_name == list.name" class="mb-1 font-weight-bold" color="primary" outlined>Your Active Package</v-chip>
                                    <v-btn
                                    v-if="getActivePackageMonthly[0].package_name != list.name && list.price > getActivePackageMonthly[0].price" 
                                    class="mb-1" color="success" 
                                    link
                                    @click.native="choosePackage(list)"
                                    to="/overview/list-package/form-package">Upgrade Package</v-btn>

                                    <v-btn
                                    v-if="getActivePackageMonthly[0].package_name != list.name && list.price < getActivePackageMonthly[0].price"
                                    class="mb-1 white--text" 
                                    color="orange" 
                                    link
                                    @click.native="choosePackage(list)"
                                    to="/overview/list-package/form-package">Downgrade Package</v-btn>
                                </div>
                                <div class="d-flex justify-center align-center my-2" v-else>
                                    <v-btn class="mb-1" color="secondary" @click.native="purchasePackage(list)" link to="/overview/list-package/form-package">Purchase</v-btn>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row> -->
                            <!-- </v-slide-group> -->
                    
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>