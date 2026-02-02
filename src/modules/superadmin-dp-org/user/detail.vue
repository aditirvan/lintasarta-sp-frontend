<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">
                  <!-- <v-icon class="mr-3">mdi-city</v-icon> -->
                  <!-- {{ $route.params.user_name }} -->
                  {{ userDP && userDP.name }}
                </div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-6">
                  <v-tab class="fz-12 firewall-title" >General</v-tab>
                  <!-- <v-tab class="fz-12 firewall-title" >User</v-tab> -->
                  <!-- <v-tab class="fz-12 firewall-title" :to="`/manage-orgdp/${$route.params.project_name}/fire`">Fire</v-tab> -->
                </v-tabs>
              </template>
              <v-row class="pb-0"> </v-row>
              <v-tabs-items v-model="tab" class="mb-6">
                <v-tab-item>
                  <v-card flat>
                    <General />
                  </v-card>
                </v-tab-item>
                <!-- <v-tab-item>
                  <v-card flat>
                  </v-card>
                </v-tab-item> -->
                <!-- <v-tab-item :value="`/manage-orgdp/${$route.params.name}/fire`">
                  <v-card flat>
                    <router-view></router-view>
                  </v-card>
                </v-tab-item> -->
              </v-tabs-items>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from '@vue/composition-api'
import General from './general.vue'

export default {
  components: {
    General
  },
  setup() {
    const userDP = ref()
    onUnmounted(() => {
      localStorage.removeItem('detailUserDP')
    })
    onMounted(() => {
      userDP.value = JSON.parse(localStorage.getItem("detailUserDP"))
    })
    
    const tab = ref(0)

    return{
      tab,
      userDP
    }
  },
}
</script>