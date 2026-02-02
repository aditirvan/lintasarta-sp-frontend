<template>
  <v-toolbar-items>
    <v-btn
      :style="{ 'min-width': $vuetify.breakpoint.xsOnly ? 0 : '300px' }"
      text
      dark
      class="darkblue"                
      @click="
        () => {
          test = true          
          if (isLoading == false) {
            opendialogselectproject();
          }
        }                  
      "            
    >
      <span style="font-size: 14px">
        {{ activeProject ? activeProject : "Select Project" }}
      </span>
      <v-spacer />
      <v-icon right>mdi-chevron-right</v-icon>
    </v-btn>
    <dialogSelectProject v-if="SelectModal" />
  </v-toolbar-items>
</template>
<script>
import {
  useGetters,
  useMutations,
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { computed, ref } from "@vue/composition-api";
import { PROJECT } from "./namespace";
import dialogSelectProject from "./selectproject.vue";
import { useProjects } from './useprojects';
import { INSTANCE } from "../instance/namespace";
export default {
  components: { dialogSelectProject },

  setup() {            
    const { SelectModal } = useProjects();
    const { navCustomMenu } = useGetters({
      navCustomMenu: "DASHBOARD/navCustomMenu",
    });
    const { triggerdrawer } = useMutations({
      triggerdrawer: "DASHBOARD/triggerdrawer",
    });    

    //const activeProject = ref("");

    const navCustomeMenuSorted = computed(() => {
      return navCustomMenu.value.slice().sort((a, b) => {
        return b.sort - a.sort;
      });
    });
    const { opendialogselectproject } = useNamespacedActions(PROJECT, [
      "opendialogselectproject",
    ]);

    //activeProject.value=localStorage.getItem('projectname');

    const {getprojectname: activeProject} = useNamespacedGetters(PROJECT,['getprojectname']);

    const {       
      isLoading
    } = useNamespacedState(INSTANCE, [      
      "isLoading"
    ]);

    return {
    isLoading,
		test: ref(false),
      opendialogselectproject,
      activeProject,
      navCustomMenu: navCustomeMenuSorted,
      triggerdrawer,SelectModal
    };
  },


  
  
};
</script>