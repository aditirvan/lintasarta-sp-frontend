<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg elevation-0">
          <v-card-text class="d-flex px-8 pb-0 flex-row align-center">
              <div class="headline font-weight-bold font--text">
                  Summary {{ headline }}
              </div>
          </v-card-text>
            <v-card-text class="px-0 pb-0 pt-1 rounded-lg">
                <v-tabs slider-size="4">
                    <v-tab to="/overview/monthly">
                    <span class="ml-4" style="font-size: 16px">Monthly</span>
                    </v-tab>
                    <v-tab to="/overview/addons">
                    <span style="font-size: 16px">
                        Add Ons
                    </span>
                    </v-tab>
                </v-tabs>
            </v-card-text>
            <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="$route.path">
                <v-tab-item value="/overview/monthly">
                    <router-view></router-view>
                </v-tab-item>
                <v-tab-item value="/overview/addons">
                    <router-view></router-view>
                </v-tab-item>
            </v-tabs-items>                  
        </v-card>
      </v-col>
    </v-row>
    </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'

export default {
    setup(props, context) {
        const headline = ref('')

        watch(() => context.root.$route ,(newVal) =>{
            if(newVal.path == '/overview/monthly'){
                headline.value = 'Monthly'
            }else{
                headline.value = 'Add Ons'
            }
        })

        onMounted(() => {
            if(context.root.$route.path == '/overview/monthly'){
                headline.value = 'Monthly'
            }else{
                headline.value = 'Add Ons'
            }
        })

        return{
            headline
        }
    },
}
</script>