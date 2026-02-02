<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title"><v-icon class="mr-3">mdi-cloud-outline</v-icon>{{ $route.params.project_name }}</div>
              </v-col>
            </v-row>
            <br />
            <v-card class="rounded-lg mt-4 mb-4" flat outlined>
              <template>
                <v-tabs v-model="tab" class="mb-0">
                  <v-tab class="fz-12 firewall-title" >General</v-tab>
                  <v-tab class="fz-12 firewall-title" >Allocation</v-tab>
                </v-tabs>
              </template>
              <v-row class="pb-0"> </v-row>
              <v-tabs-items v-model="tab" class="mb-2">
                <v-tab-item>
                  <v-card flat>
                    <General />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <Allocation />
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onUnmounted, ref } from '@vue/composition-api'
import General from './general.vue'
import Allocation from './allocation.vue'

export default {
  components: {
    General,
    Allocation
  },
  setup() {
    onUnmounted(() => {
      localStorage.removeItem('detailOrgVdc')
    })
    const tab = ref(0)
    
    return {
      tab
    }
  },
}
</script>