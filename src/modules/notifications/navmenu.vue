<template>
  <v-menu ref="menu"  v-model="showMenu" offset-y allow-overflow>
    <template v-slot:activator="{ on, attrs }">
      <div
        id="NotificationNav"
        @click="($event)=>{
          on.click($event)
          }"
        v-bind="attrs"
        style="cursor: pointer"
        class="d-flex justify-center align-center navmenu"
      >
        <v-badge dot color="darkblue" overlap  id="NavNotifIcon">
        <v-icon style="width:20px; height:20px" class="mr-3">mdi-bell-outline</v-icon>
        </v-badge>
        <!-- <v-icon id="IconOrg" :class="{rotate:!showMenuN}">mdi-chevron-up</v-icon> -->
      </div>
    </template>
    <v-list two-line>
      <v-list-item-group
        active-class="blue--text"
        multiple
      >
    
        <template v-for="(item, index) in notifs">
         
          <v-list-item :key="item.id" :to="converLinkName(item.service_type,item.method_name)">
            <template >

              <!-- #db1313 -->
            <v-icon style="width:50px; height:50px; color:#db1313" v-if="item.level=='ERROR'" >{{
              converServiceNameErorr(item.service_type.toLowerCase())
            }}</v-icon>

            <v-icon style="width:50px; height:50px; color:#1f60a8" v-else >{{
              converServiceName(item.service_type.toLowerCase())
            }}</v-icon>

      
            <!-- <v-icon style="width:50px; height:50px;" :color="converColorServiceName(item.action)">{{
              converServiceName(item.service_type.toLowerCase())
            }}</v-icon> -->

             <!-- converServiceName(item.service_type.toLowerCase()) -->
              <v-list-item-content>
                <v-list-item-title v-text="item.service_name" :style="converColorServiceName(item.level)"></v-list-item-title>
                <v-list-item-subtitle>
                <div v-if="item.user.role_id==99">{{ item.action }} LA - {{ item.user.fullname }}</div>
                <div v-else>{{ item.action }} by {{ item.user.fullname }}</div>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text v-text="$moment(new Date(item.created_at)).format('DD/MM/YYYY h:mm A')"></v-list-item-action-text>
              </v-list-item-action>
            </template>
          </v-list-item>
          
          <v-divider
            v-if="index < notifs.length - 1"
            :key="index"
          ></v-divider>

          
        </template>
      </v-list-item-group>
      
    </v-list>
    <v-btn
        block
        elevation="2"
        x-large
        class="secondary"
        to="/audit-log"
       >See All Activity</v-btn>
  </v-menu>
</template>
<script>

import { onMounted, ref, watch } from '@vue/composition-api';
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters,
} from 'vuex-composition-helpers';
import { NOTIFICATION } from '@/modules/notifications/namespace';
import {useNotif} from "./usenotif"
// import { minValue } from '@vuelidate/validators';
// import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
// import { LIMITSERVICE } from '../service-limit/namespace';
export default {
  created() {
    this.getDataFromApi();
  },
  setup(){
     const Composable = {
      ...useNotif(),
    };
    const notification = ref([]);
    // const {fetchlimitservice} = useNamespacedActions(LIMITSERVICE,['fetchlimitservice'])
    // const {unlimited} = useNamespacedGetters(LIMITSERVICE,['unlimited'])
    
    const { fetchnotifs } = useNamespacedActions(NOTIFICATION,[
      'fetchnotifs',
    ]);

    const { notifs } = useNamespacedState(NOTIFICATION, [
      'notifs',
    ]);

    const loading = ref(true)
    const getDataFromApi = async () => {
      loading.value = true;
      try {
        await fetchnotifs();
      } finally { 
        loading.value = false;
      }
    };

    onMounted(()=>{
      getDataFromApi();
    })
    
    return{
      ...Composable,
      notifs,
      loading,
      getDataFromApi,
      caret: false,
      showMenu: false,
      x: null,
      y: null,
      tri: null,
      // items: [
      //   {
      //     id: '2122222',
      //     created_at: '01/01/2021 - 10.30 AM',
      //     metadata:'Success create project by QA GITS',
      //     method_name: 'gits-dev-org5-p3',
      //   },
        
      // ],
    //   unlimited
    }
  },
  // data() {
  //   return {
  //     selected: '',
  //     items: [
  //       {
  //         created_at: '01/01/2021 - 10.30 AM',
  //         metadata:'Success create project by QA GITS',
  //         method_name: 'gits-dev-org5-p3',
  //       },
  //       {
  //         action: '01/01/2021 - 10.30 AM',
  //         headline: 'Success delete project by QA GITS',
  //         title: 'Delete Project',
  //       },
  //       {
  //         action: '01/01/2021 - 10.30 AM',
  //         headline: 'Success delete project by QA GITS',
  //         title: 'Delete Project2',
  //       },
  //       {
  //         action: '01/01/2021 - 10.30 AM',
  //         headline: 'Success create project by QA GITS',
  //         title: 'gits-dev-org5-p4',
  //       },
  //       {
  //         action: '01/01/2021 - 10.30 AM',
  //         headline: 'Success create project by QA GITS',
  //         title: 'gits-dev-org5-p5',
  //       },
  //     ],
  //     caret: false,
  //     showMenu: false,
  //     x: null,
  //     y: null,
  //     tri: null,
  //   };
  // },
  watch:{
    showMenu:function(val){
      if(val){
        const nav = document.getElementById('NavNotifIcon')
        const content = document.getElementsByTagName('BODY')[0]
      const img = document.createElement('img');
        img.src = require("@/assets/tri.png");
        img.style.position = "fixed";
        img.style.top = `${nav.offsetTop + nav.offsetHeight -5   }px`;
        img.style.left = `${nav.offsetLeft  }px`
        img.style.zIndex = '10'
        this.tri = img
      content.insertBefore(img, content.firstElementChild)
      }else{
      this.tri.remove()
      }
    }
  },
};
</script>
<style lang="scss" scoped>
[role="menu"] {
  margin-top: -10px;
}


.name {
  color: #1f60a8;
}

.mdi-chevron-up.rotate::before{
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-up::before{
  transition: 100ms linear all;
}
.v-list-item{
  min-height: 38px;
}

.v-list-item-group{
  max-height: 50%;
}

p, .v-list-item__title{
  font-weight: 700;
  font-size: 15px;
  
} 

.v-list{
  height:450px;
  overflow-y:auto
}
</style>