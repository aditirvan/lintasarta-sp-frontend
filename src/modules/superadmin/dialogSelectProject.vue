<template>
  <v-dialog v-model="dialog" width="800" :retain-focus="false">
    <v-card flat class="rounded-lg">
      <v-card-title>
        <v-row>
          <v-col cols="8">
            <div class="headline font-weight-bold font--text">
              Select Project
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div
        id="SearchProject"
        style="max-width: 775px; padding-left: 25px; padding-bottom: 15px"
      >
        <v-text-field
          maxlength="50"
          placeholder="Search Organization or Project"
          prepend-inner-icon="mdi-magnify"
          single-line
          outlined
          v-model="searchProject"
        >
        </v-text-field>
      </div>
      <v-card-text>
        <v-data-table
          :search="searchProject"
          id="hideheader"
          :hide-default-footer="true"
          :headers="headersProject"
          :items="organizationprojects"
          :items-per-page="10"
          :options.sync="options"
          :server-items-length="organizationprojectpagination.count"
          height="290"
        >
          <template v-slot:item="{ item }">
            <tr :key="item.project_id">
              <td>
                <v-icon left>$vuetify.icons.gg_organizationIcon</v-icon>
                <span>{{ item.org_name }}</span>
              </td>
              <td>
                <div class="d-flex">
                  <v-icon left>$vuetify.icons.targetIcon</v-icon>
                  <div
                    v-if="item.project_name !== ''"
                    class="linkpointer"
                    @click="$emit('setProject', item)"
                  >
                    {{ item.project_name }}
                  </div>
                  <div v-else>-</div>
                </div>
              </td>
            </tr>
          </template>
          <template v-slot:footer="{ props }">
              <custom-footer-datatable
                @input="
                  (val) => {
                    options = { ...options, ...val };
                  }
                "
                :hidden="true"
                :props="props"
              />
            </template>
        </v-data-table>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import { ref, watch, onMounted } from "@vue/composition-api"
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api';
import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import { SUPERADMIN } from "./namespace"

export default defineComponent({
  props: ["value"],
  data() {
    return {
      headersProject: [
        { text: "Organization", value: "organizationName", sortable: false },
        { text: "Project", value: "projectName", sortable: false },
      ],
    };
  },
  methods: {

  },
  setup(props: any, context) {
    const { dialog } = useDialog(props, context)
    const { organizationprojects, organizationprojectpagination } = useNamespacedState(SUPERADMIN, [
      "organizationprojects", "organizationprojectpagination"
    ]);
    
    const { fetchorganizationprojects } = useNamespacedActions(SUPERADMIN, 
    ["fetchorganizationprojects"]);

    const options = ref({ page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    const loading = ref(false);
    
    // watch pagination
    watch(
      options,
      async (val) => {
        loading.value = true
        try {
          await fetchorganizationprojects(val)
        } finally {
          loading.value = false
        }
      },
      { deep: true }
    );
    // watch search field
    const searchProject = ref("")
    let searchtimeout = setTimeout(() => {}, 500)
    watch(searchProject, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1
        options.value.search = val
      }, 500);
    });

    onMounted(() => {
      fetchorganizationprojects(options.value)
    })

    return {
      dialog,
      searchProject,
      organizationprojects,
      organizationprojectpagination,
      options,
    }
  },
});
</script>