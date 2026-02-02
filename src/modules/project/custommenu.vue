<template>
  <v-container fluid class="pa-0">
    <!-- <v-expansion-panel :style="{ 'background-color': $vuetify.theme.themes.light.primary }">
      <v-expansion-panel-header> PROJECT </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list-item
          style="cursor: pointer"
          @click="
            () => {
              validateprivilages(['Project', 'editor'])
                .then(() => {
                  return validatelimitcreateproject();
                })
                .then(() => {
                  CrateModal = true;
                });
            }
          "
        >
          <v-list-item-icon>
            <v-icon>$vuetify.icons.newprojectIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New Project</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item style="cursor: pointer" @click="$router.push('/import')">
          <v-list-item-icon>
            <v-icon>$vuetify.icons.importIcon</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Import Deka Prime</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-content>
    </v-expansion-panel> -->
  </v-container>
</template>
<script>
import { useCreateProject } from "@/modules/project/useCreateProject";
import { useNamespacedActions } from "vuex-composition-helpers";
import { PROJECT } from "./namespace";
export default {
  setup() {
    const { CrateModal } = useCreateProject();
    const { validateprivilages, validateprivilagesync } = useNamespacedActions("HOMEPAGE", ["validateprivilages", "validateprivilagesync"]);
    const { validatelimitcreateproject } = useNamespacedActions(PROJECT, ["validatelimitcreateproject"]);
    return {
      validatelimitcreateproject,
      validateprivilages,
      validateprivilagesync,
      CrateModal,
    };
  },
};
</script>
