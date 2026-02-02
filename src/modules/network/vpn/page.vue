<template>
  <div class="">
    <v-card class="rounded-0 rounded-t-lg" flat>
      <v-container fluid class="pa-7 pb-0">
        <v-tabs class="pt-2">
            <v-tab to="/network/vpn/pfsense"><span>Pfsense</span></v-tab>
            <v-tab to="/network/vpn/tunnels"><span>Tunnels</span></v-tab>
            <v-tab to="/network/vpn/psk">Pre Shared Keys</v-tab>
        </v-tabs>
      </v-container>
    </v-card>
    <v-divider />

    <v-tabs-items v-model="$route.path" style="background: transparent">
      <v-tab-item value="/network/vpn/pfsense">
        <router-view></router-view>
      </v-tab-item>
      <v-tab-item value="/network/vpn/tunnels">
        <router-view></router-view>
      </v-tab-item>
      <v-tab-item value="/network/vpn/psk">
        <router-view></router-view>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
