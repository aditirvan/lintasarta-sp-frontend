<template>
  <v-toolbar-items>
    <v-btn
      id="SelectOrganizationOrProject"
      :style="{ 'min-width': $vuetify.breakpoint.xsOnly ? 0 : '300px' }"
      text
      dark
      class="darkblue"
      @click="
        () => {
          if (isLoading == false) {
            setselectmodal(true)
          }          
        }
      "
    >
      <v-icon style="width: 30px; height: 30px" left color="white"
        >$vuetify.icons.gg_organizationIcon</v-icon
      >
      <span style="font-size: 14px">
        {{
          (currentOrg &&
            currentOrg.name + (currentProj ? " / " + currentProj.name : "")) ||
          "Select Organization or Project"
        }}
      </span>
      <v-spacer />
      <v-icon right>mdi-chevron-right</v-icon>
    </v-btn>
  </v-toolbar-items>
</template>
<script>
import {
  useGetters,
  useMutations,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import selectproject from "@/modules/project/selectproject";
import { computed, ref, watch } from "@vue/composition-api";
import { SUPERADMIN } from "./namespace";
import { PROJECT } from '../project/namespace';
import { INSTANCE } from "../instance/namespace";
export default {
  setup() {
    const { openModal, activeProject } = selectproject();
    const { navCustomMenu } = useGetters({
      navCustomMenu: "DASHBOARD/navCustomMenu",
    });
    const { triggerdrawer } = useMutations({
      triggerdrawer: "DASHBOARD/triggerdrawer",
    });
    const navCustomeMenuSorted = computed(() => {
      return navCustomMenu.value.slice().sort((a, b) => {
        return b.sort - a.sort;
      });
    });
    const { currentOrg, currentProj } = useNamespacedState(SUPERADMIN, [
      "currentOrg",
      "currentProj",
    ]);
    const { setselectmodal } = useNamespacedMutations(PROJECT, [
      "setselectmodal",
    ]);

    const {       
      isLoading
    } = useNamespacedState(INSTANCE, [      
      "isLoading"
    ]);

    return {
      setselectmodal,
      currentOrg,
      currentProj,
      openModal,
      activeProject,
      navCustomMenu: navCustomeMenuSorted,
      triggerdrawer,
      isLoading,
    };
  },
};
</script>