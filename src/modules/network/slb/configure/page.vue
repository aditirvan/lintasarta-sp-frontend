<template>
  <div>
    <div class="px-3">
      <v-row>
        <v-col cols="12" class="pl-0">
          <v-card class="rounded-0 rounded-t-lg" flat>
            <v-container fluid class="pa-7 pb-0">
              <div class="d-flex">
                <span class="page-title pb-5">Configuration Load Balancer</span>
                <v-spacer></v-spacer>
                <v-btn
                v-if="path != ''"
                width="150"
                height="50"
                class="secondary fz-14"
                depressed
                :to="path"
                >
                    Create {{ $route.path == '/network/slb/config/backend' ? 'Backend' : 'Frontend' }}
                </v-btn>
              </div>

              <v-tabs class="pt-2">
                <v-tab to="/network/slb/config/general">General</v-tab>
                <v-tab to="/network/slb/config/backend"><span>Backend</span></v-tab>
                <v-tab to="/network/slb/config/frontend">Frontend</v-tab>
              </v-tabs>
            </v-container>
          </v-card>
          <v-divider />

          <v-tabs-items v-model="$route.path" style="background: transparent">
             <v-tab-item value="/network/slb/config/general">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item value="/network/slb/config/backend">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item value="/network/slb/config/frontend">
              <router-view></router-view>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'

export default {
  setup(props, context) {
    const path = ref('')
    watch(() => context.root.$route.path, (newVal) => {
      if(newVal == '/network/slb/config/backend'){
        path.value = '/network/slb/config/backend/create'
      }else if(newVal == '/network/slb/config/frontend'){
        path.value = '/network/slb/config/frontend/create'
      }else if(newVal == '/network/slb/config/general'){
        path.value = ''
      }
    })

    onMounted(() => {
      if(context.root.$route.path == '/network/slb/config/backend'){
        path.value = '/network/slb/config/backend/create'
      }else if(context.root.$route.path == '/network/slb/config/frontend'){
        path.value = '/network/slb/config/frontend/create'
      }else if(context.root.$route.path == '/network/slb/config/general'){
        path.value = ''
      }
    })

    return{
      path
    }
  },
}
</script>


<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>