<template>
  <div>
    <v-container class="mt-6">
      <v-col
        ><v-btn
          color="secondary"
          @click="
            () => {
              action = 'create'
              openDialogAdd=true
            }
          "
          :disabled="disable"
          ><v-icon>mdi-plus</v-icon>NEW LABEL</v-btn
        ></v-col
      >
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="listLabels"
          class="elevation-0"
          item-key="no"
          hide-default-footer
          :items-per-page="10"
          :options.sync="options"
          :loading="isLoading"
          :server-items-length="totalLabels.count"
        >
          <template #[`item.creation_time`]="{ item }">
            <div>{{ formatDate(item.creation_time) }}</div>
          </template>
          <template #[`item.name`]="{ item }">
            <v-btn :color="item.color" class="white--text bs-tr"
              ><v-icon>mdi-lan</v-icon>&nbsp;{{ item.name }}</v-btn
            >
          </template>
          <template #[`item.action`]="{ item }">
            <div>
              More
              <v-menu right down>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
                </template>
                <v-list>
                  <v-list-item :disabled="disable">
                    <v-list-item-title
                      @click="
                        () => {
                          packageselected=item
                          action='update'
                          openDialogAdd=true

                        }
                      "
                      class="cursor-pointer"
                    >
                      Update
                      <v-icon color="blue-grey" dark class="ml-2">mdi-pencil</v-icon>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item :disabled="disable">
                    <v-list-item-title
                      @click="
                        () => {
                          onDelete(item);
                          action='delete';
                        }
                      "
                      :disabled="disable"
                      class="cursor-pointer"
                    >
                      Delete
                      <v-icon color="red" dark class="ml-2">mdi-delete</v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  options = val;
                  changePage(val);
                }
              "
              :props="props"
            />
          </template>
        </v-data-table> </v-col
    ></v-container>
    <dialogLabels
      v-if="openDialogAdd" v-model="openDialogAdd" :item="packageselected" :type="action"  @clearItem="packageselected = $event"
    ></dialogLabels>
    <dialogConfirmDelete
      :close.sync="Close"
      :project-id="projectId"
      :action="action"
      :data-delete="dataDelete"
    ></dialogConfirmDelete>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import dialogLabels from "./dialog/dialog-labels.vue";
import dialogConfirmDelete from "./dialog/dialog-confirm-delete.vue";
import moment from "moment";

export default {
  components: {
    dialogLabels,
    dialogConfirmDelete,
  },
  setup() {
    onMounted(async () => {
      setLoadCard(false);
      await getListLabels();
    });
    const { listProjects, isLoading, listLabels, totalLabels } =
      useNamespacedGetters(REGISTRY, [
        "listProjects",
        "isLoading",
        "listLabels",
        "totalLabels",
      ]);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);

    const { getListLabels, getListProjects, fetchLabels } =
      useNamespacedActions(REGISTRY, [
        "getListLabels",
        "getListProjects",
        "fetchLabels",
      ]);
    const headers = ref([
      // { text: "No", value: "no" },
      { text: "Label", value: "name" },
      { text: "Description", value: "description" },
      { text: "Creation Time", value: "creation_time" },
      { text: "Action", value: "action" },
    ]);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );

    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };
    const Close = ref(false);
    const projectId = ref(0);
    const openDialogAdd = ref(false)
    const disable = ref(true)
    const packageselected = ref({})
    const action = ref("");
    const dataDelete = ref({});
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });

    const role=localStorage.getItem("role"); 
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const onDelete = (item) => {
      dataDelete.value = item;
      Close.value = true;
    };
    const changePage = (val) => {
      const params={
        page_size:val.itemsPerPage,
        page:val.page,
        project: nameProject.value.name,
      }
      const payload = {
        project: projectId.value,
        params: params
      }
      // console.log("payload===========",payload)
      fetchLabels(payload);
    };


    return {
      headers,
      getListProjects,
      nameProject,
      listProjects,
      listLabels,
      role,
      disable,
      getListLabels,
      fetchLabels,
      isLoading,
      formatDate,
      projectId,
      onDelete,
      changePage,
      action,
      dataDelete,
      setLoadCard,
      options,
      totalLabels,
      Close,
      openDialogAdd,
      packageselected,
    };
  },
};
</script>

<style lang="scss" scoped>
.bs-tr {
  box-shadow: none !important;
  cursor: auto;
  pointer-events: none;
  border-radius: 1.5rem;
  border: none;
}
.bs-tr::before {
  background-color: transparent;
}
</style>