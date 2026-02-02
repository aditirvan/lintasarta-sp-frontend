<template>
  <div>
    <v-container class="mt-6">
      <v-col cols="12"
        ><v-data-table
          :headers="headers"
          :items="listLogs"
          class="elevation-0"
          item-key="no"
          hide-default-footer
          :items-per-page="10"
          :options.sync="options"
          :loading="isLoading"
          :server-items-length="totalLogs.count"
        >
          <template #[`item.op_time`]="{ item }">
            <div>{{ formatDate(item.op_time) }}</div>
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
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import moment from "moment";

export default {
  setup() {
    onMounted(async () => {
      setLoadCard(false);
      // await getListProjects();
      const projectName = nameProject.value.name
        .toLowerCase()
        .replace(" ", "-");
      // const project = listProjects.value.find((element) => {
      //   return element.name === projectName;
      // });
      await getListLogs(projectName);
    });
    const { listProjects, isLoading, listLogs, totalLogs } = useNamespacedGetters(
      REGISTRY,
      ["listProjects", "isLoading", "listLogs", "totalLogs"]
    );

    const { getListLogs, getListProjects, fetchListLogs } = useNamespacedActions(REGISTRY, [
      "getListLogs",
      "getListProjects",
      "fetchListLogs",
    ]);
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const headers = ref([
      // { text: "No", value: "no" },
      { text: "Username", value: "username" },
      { text: "Resource", value: "resource" },
      { text: "Resource Type", value: "resource_type" },
      { text: "Operation", value: "operation" },
      { text: "Timestamp", value: "op_time" },
    ]);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });

    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };

    const changePage = (val) => {
      const params={
        page_size:val.itemsPerPage,
        page:val.page,
        project: nameProject.value.name,
      }
      const payload = {
        project: nameProject.value,
        params: params
      }
      fetchListLogs(payload);
    };

    return {
      headers,
      getListProjects,
      nameProject,
      listProjects,
      listLogs,
      fetchListLogs,
      getListLogs,
      isLoading,
      formatDate,
      setLoadCard,
      totalLogs,
      changePage,
      options
    };
  },
};
</script>

<style lang="scss" scoped>
</style>