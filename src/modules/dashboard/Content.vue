<template>
    <v-main class="grey lighten-3">
      <div class="main-content">
        <v-container fluid>
          <dashboardBreadCrumbs-breadcrumbs />
          <div style="padding-top:18px">
          <router-view />
          </div>
        </v-container>
      </div>
    </v-main>
</template>

<style>
.main-content {
  min-height: calc(100vh - 112px - 48px);
  margin: 20px;
}
</style>
<script>
import {useGetters} from 'vuex-composition-helpers'
export default {
  setup(){
    const {dashboardoverlay} = useGetters({
      dashboardoverlay: 'DASHBOARD/dashboardoverlay'
    })
    return{
      dashboardoverlay
    }
  }
}
</script>