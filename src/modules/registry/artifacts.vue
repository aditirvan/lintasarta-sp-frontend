<template>
  <div>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <v-container class="mt-4" v-if="isLoading">
          <div class="d-flex justify-center">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </v-container>
        <v-container fluid class="px-7 py-4" v-else>
          <v-row>
            <v-col cols="9">
              <div class="firewall-title mb-7">
                {{ formatString($route.params.artifacts) }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="9">
              <div class="firewall-title cap">Tags</div>
            </v-col>
          </v-row>
          <v-col cols="10">
            <v-row>
              <v-col class="fg"
                ><v-btn
                  outlined
                  color="#1f60a8"
                  width="125"
                  @click="
                    () => {
                      closed = true;
                    }
                  "
                        :disabled="disable"
                  ><v-icon left small>mdi-plus</v-icon> ADD TAG</v-btn
                ></v-col
              >
              <!-- <v-col class="fg"
                ><v-btn
                  outlined
                  color="#1f60a8"
                  width="125"
                  :disabled="selected.length == 0"
                  ><v-icon left small>mdi-delete-outline</v-icon> REMOVE
                  TAG</v-btn
                ></v-col
              > -->
            </v-row>
          </v-col>
          <v-card class="rounded-lg mt-4 mb-4" flat>
            <v-data-table
              :headers="headers"
              :items="tableArtifacts"
              class="elevation-0"
              item-key="id"
              v-model="selected"
              hide-default-footer
              :loading="loadingTags"
              :items-per-page="10"
              :options.sync="options"
              :server-items-length="totaltableArtifacts.count"
            >
              <!-- <template #[`item.digest`]="{ item }">
                <div>{{ formatString(item.digest) }}</div>
              </template> -->
              <template #[`item.signed`]="{ item }">
                <div v-if="item.signed == false">
                  <v-icon color="red">mdi-close-circle-outline</v-icon>
                </div>
                <div v-else>
                  <v-icon color="green">mdi-check-circle-outline</v-icon>
                </div>
              </template>
              <template #[`item.push_time`]="{ item }">
                <div>{{ formatDate(item.push_time) }}</div>
              </template>
              <template #[`item.pull_time`]="{ item }">
                <div v-if="item.pull_time!='0001-01-01T00:00:00.000Z'">
                  {{ formatDate(item.pull_time) }}
                </div>
                <div  v-else>
                </div>
              </template>
              <template #[`item.name`]="{ item }">
                <div v-if="item.immutable">
                  {{item.name}} <v-chip x-small color="primary" style="float: right;">Immutable</v-chip>
                </div>
                <div  v-else>
                  {{ item.name }}
                </div>
              </template>
              <template #[`item.pull`]="{ item }">
                <div>
                  <v-btn
                    class="bs-tr"
                    :title="`docker pull ${infoSystem.external_url}/${$route.params.project_name}/${$route.params.project}:${item.name}`"
                    @click="copy(infoSystem.external_url,item.name)"
                    ref="pull"
                    ><v-icon class="text-center"
                      >mdi-content-copy</v-icon
                    ></v-btn
                  >
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
              
        <template #[`item.action`]="{ item }">
          <div  v-if="!item.immutable||!disable"
                    @click="
                      () => {
                        onDelete(item);
                      }
                    "
              style="cursor: pointer"
              class="ml-4 error--text"
          >
              Delete
          </div>
          <div  v-else>
          </div>
        </template>
        </v-data-table>
          </v-card>
          <v-row>
            <v-col cols="9">
              <div class="firewall-title mt-6">Overview</div>
            </v-col>
          </v-row>
          <artifactsOverview
            :data-overview="detailRepositories"
          ></artifactsOverview>
          <v-row>
            <v-col cols="9">
              <div class="firewall-title mt-6">Additions</div>
            </v-col>
          </v-row>
          <artifactsAdditions></artifactsAdditions>
        </v-container>
      </v-card>
    </v-col>
    <addTag :close.sync="closed"></addTag>
    <dialogConfirmDelete
      :close.sync="Close"
      :action="action"
      :data-delete="dataDelete"
    ></dialogConfirmDelete>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import artifactsOverview from "./artifacts-overview.vue";
import artifactsAdditions from "./artifacts-additions.vue";
import addTag from "./dialog/add-tag.vue";
import dialogConfirmDelete from "./dialog/dialog-confirm-delete-tags.vue";
import moment from "moment";

export default {
  components: {
    artifactsOverview,
    artifactsAdditions,
    dialogConfirmDelete,
    addTag,
  },
  setup(props, context) {
    const {
      detailRepositories,
      isLoading,
      infoSystem,
      tableArtifacts,
      loadingTags,
      totaltableArtifacts,
    } = useNamespacedGetters(REGISTRY, [
      "detailRepositories",
      "isLoading",
      "infoSystem",
      "tableArtifacts",
      "loadingTags",
      "totaltableArtifacts",
    ]);

    const { getDetailRepositories, getImage, getSystemInfo, getListTags, fetchListTags } =
      useNamespacedActions(REGISTRY, [
        "getDetailRepositories",
        "getImage",
        "getSystemInfo",
        "getListTags",
        "fetchListTags",
      ]);
    onMounted(async () => {
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
      };
      // console.log(context.root.$route.params);
      await getDetailRepositories(params);
      // getSystemInfo();
      await getListTags(context.root.$route.params);
      
    });

    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    // console.log("role====",role)
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const Close = ref(false);
    const selected = ref([]);
    const action = ref("");
    const closed = ref(false);
    const dataDelete = ref({});
    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Pull Command", value: "pull", sortable: false, width: "15%" },
      {
        text: "Signed by Notary",
        value: "signed",
        sortable: false,
        width: "25%",
      },
      { text: "Pull Time", value: "pull_time", width: "15%" },
      { text: "Push Time", value: "push_time", width: "15%" },
      { text: "Action", value: "action" },
    ]);

    const changePage = (val) => {
      const pagination={
        page_size:val.itemsPerPage,
        page:val.page,
      }
      const payload = {
        param: context.root.$route.params,
        pagination: pagination,
      };
      // console.log("fetchListTags=================",payload)
      // getListTags(context.root.$route.params);
      fetchListTags(payload);
    };
    const onDelete = (item) => {
      const params = {
        project: context.root.$route.params,
        item:item.name
      };
      // console.log(params)
      dataDelete.value = params;
      Close.value = true;
    };
    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };

    function copy(external_url,name) {
      var field="docker pull "+external_url+"/"+context.root.$route.params.project_name+"/"+context.root.$route.params.project+":"+name
      // console.log(field)
      navigator.clipboard.writeText("docker pull "+external_url+"/"+context.root.$route.params.project_name+"/"+context.root.$route.params.project+":"+name);
    }

    const formatString = (string) => {
      return string.substring(0, 15);
    };
    return {
      headers,
      selected,
      getDetailRepositories,
      detailRepositories,
      copy,
      formatDate,
      dataDelete,
      action,
      isLoading,
      formatString,
      getImage,
      infoSystem,
      getSystemInfo,
      tableArtifacts,
      closed,
      loadingTags,
      Close,
      onDelete,
      totaltableArtifacts,
      options,
      changePage,
      fetchListTags,
      role,
      disable,
    };
  },
};
</script>

<style lang="scss" scoped>
.fg {
  flex-grow: 0;
}
.bs-tr {
  box-shadow: none !important;
  background-color: transparent !important;
}
.bs-tr::before {
  background-color: transparent;
}
::v-deep .v-progress-linear__background {
  opacity: 1 !important;
}
.cap {
  text-transform: capitalize;
}
</style>