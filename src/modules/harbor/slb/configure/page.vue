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
                    Create {{ $route.path == `/harbor/detail/${$route.params.harborid}/loadbalancer/config/backend` ? 'Backend' : 'Frontend' }}
                </v-btn>
              </div>

              <v-tabs class="pt-2">
                <v-tab :to="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/general`">General</v-tab>
                <v-tab :to="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/backend`"><span>Backend</span></v-tab>
                <v-tab :to="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/frontend`">Frontend</v-tab>
              </v-tabs>
            </v-container>
          </v-card>
          <v-divider />

          <v-tabs-items v-model="$route.path" style="background: transparent">
             <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/general`">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/backend`">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/loadbalancer/config/frontend`">
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
    const { harborid } = context.root._route.params;

    const path = ref('')
    watch(() => context.root.$route.path, (newVal) => {
      if(newVal == `/harbor/detail/${harborid}/loadbalancer/config/backend`){
        path.value = `/harbor/detail/${harborid}/loadbalancer/config/backend/create`
      }else if(newVal == `/harbor/detail/${harborid}/loadbalancer/config/frontend`){
        path.value = `/harbor/detail/${harborid}/loadbalancer/config/frontend/create`
      }else if(newVal == `/harbor/detail/${harborid}/loadbalancer/config/general`){
        path.value = ''
      }
    })

    onMounted(() => {
      if(context.root.$route.path == `/harbor/detail/${harborid}/loadbalancer/config/backend`){
        path.value = `/harbor/detail/${harborid}/loadbalancer/config/backend/create`
      }else if(context.root.$route.path == `/harbor/detail/${harborid}/loadbalancer/config/frontend`){
        path.value = `/harbor/detail/${harborid}/loadbalancer/config/frontend/create`
      }else if(context.root.$route.path == `/harbor/detail/${harborid}/loadbalancer/config/general`){
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