<template>
  <div>
    <v-container class="mt-6" v-if="isLoading">
      <div class="d-flex justify-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-container>
    <v-container class="mt-0" v-else>
      <v-col cols="12">
        <v-row class="align-items-center mb-6">
          <v-col cols="6">
            <v-row class="align-items-center"
              ><v-col cols="6" class="fz-16">Immutability rules</v-col
              ><v-col cols="3"
                ><v-btn color="#1f60a8" class="white--text bs-bd"
                  >{{ listImmutable.length }}/15</v-btn
                ></v-col
              ></v-row
            >
          </v-col>
          <v-col cols="6" class="d-flex justify-end" 
          :disabled="disable"
            ><v-btn
              color="secondary"
              class="white--text"
              @click="dialogAdd('add')"
              :disabled="listImmutable.length==15 || disable"
              >ADD RULE</v-btn
            ></v-col
          >
        </v-row>
        <v-row v-if="listImmutable.length > 0"
          ><v-card-text>
            <v-data-table
              :headers="headers"
              :items="listImmutable"
              class="elevation-0"
              item-key="no"
              hide-default-footer
              :items-per-page="15"
            >
              <!-- <template #[`item.no`]="{ item }">
                <div>{{ listImmutability.indexOf(item) + 1 }}</div>
              </template> -->
              <template #[`item.rule`]="{ item }">
                <div>
                  <v-icon :color="item.disabled == true ? 'red' : 'green'"
                    >&nbsp;
                    {{
                      item.disabled == true
                        ? "mdi-alert-circle-outline"
                        : "mdi-check-circle-outline"
                    }}
                  </v-icon>
                  <span>
                    For the repositories
                    {{
                      item.scope_selectors.repository[0].decoration ==
                      "repoMatches"
                        ? "matching"
                        : "excluding"
                    }}
                    {{ item.scope_selectors.repository[0].pattern }}, tags
                    {{
                      item.tag_selectors[0].decoration == "matches"
                        ? "matching"
                        : "excluding"
                    }}
                    {{ item.tag_selectors[0].pattern }}
                  </span>
                </div>
              </template>
              <template #[`item.action`]="{ item }">
                <div>
                  More
                  <v-menu right down>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
                    </template>
                    <v-list>
                      <v-list-item 
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer"
                          @click="
                            () => {
                              tutupDialog = true;
                              actionText(item.status, item);
                            }
                          "
                        >
                          {{ item.disabled ? "Enable" : "Disable" }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer"
                          @click="() => {
                            packageselected=item;
                            openDialogAdd=true;
                            typePackage='edit'
                          }"
                        >
                          Edit
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="disable">
                        <v-list-item-title
                          class="cursor-pointer red--text"
                          @click="
                            () => {
                              tutupDialog = true;
                              actionText('delete', item);
                            }
                          "
                        >
                          Delete
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>
          </v-card-text></v-row
        >
        <v-row class="text-center" v-else
          ><v-card-text>
            <p class="font-weight-bold">
              Click the ADD RULE button to add a rule.
            </p>
          </v-card-text>
        </v-row>
      </v-col>
    </v-container>
    <dialogRule
      v-if="openDialogAdd" v-model="openDialogAdd" :item="packageselected" :type="typePackage" @clearItem="packageselected = $event"
    ></dialogRule>
    <dialogDeleteEnable
      :tutup.sync="tutupDialog"
      :action-text="text"
      :row-data="dataEdit"
    ></dialogDeleteEnable>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import dialogRule from "./dialog/dialog-rule.vue";
import dialogDeleteEnable from "./dialog/dialog-delete-enable.vue";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";

export default {
  components: {
    dialogRule,
    dialogDeleteEnable,
  },
  setup() {
    onMounted(async () => {
      setLoadCard(false);
      // await getListProjects();
      // const projectName = nameProject.value.name
      //   .toLowerCase()
      //   .replace(" ", "-");
      // const project = listProjects.value.find((element) => {
      //   return element.name === projectName;
      // });

      await getTagImmutable();
      // console.log("listImmutable===========",listImmutable)
    });
    const { listProjects, isLoading, listImmutable } = useNamespacedGetters(
      REGISTRY,
      ["listProjects", "isLoading", "listImmutable"]
    );

    const { getTagImmutable, getListProjects } = useNamespacedActions(
      REGISTRY,
      ["getTagImmutable", "getListProjects"]
    );
    const { setLoadCard } = useNamespacedMutations(REGISTRY, ["setLoadCard"]);
    const nameProject = ref(
      JSON.parse(localStorage.getItem("currentProj") || "{}")
    );
    const openDialogAdd = ref(false)
    const packageselected = ref({})
    const typePackage = ref("")
    const headers = ref([
      //   { text: "No", value: "no" },
      { text: "Rule", value: "rule", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);
    const offset = ref(true);
    const action = ref("");
    const closeDialog = ref(false);
    const tutupDialog = ref(false);
    const dataEdit = ref({});
    const text = ref("");
    const openDialog = (value, row) => {
      closeDialog.value = true;
      action.value = value;
      if (value == "edit") {
        dataEdit.value = row;
      }
    };
    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
const dialogAdd = (val) => {
    openDialogAdd.value = true
    typePackage.value = val
    // console.log(val)
}
    const actionText = (string, row) => {
      text.value = string;
      // console.log("=====actionText row=================",row)
      dataEdit.value = row;
    };

    const getData = (item) => {
      // console.log("data tabele", item);
    };

    return {
      typePackage,
      packageselected,
      openDialogAdd,
      dialogAdd,
      headers,
      nameProject,
      getListProjects,
      listProjects,
      listImmutable,
      offset,
      action,
      closeDialog,
      isLoading,
      dataEdit,
      tutupDialog,
      text,
      setLoadCard,
      openDialog,
      actionText,
      getData,
      role,
      disable,
    };
  },
};
</script>

<style lang="scss" scoped>
.bs-bd {
  box-shadow: none;
  border-radius: 20px;
}
.fz-16 {
  font-size: 16px;
}
::v-deep .v-list-item {
  min-height: 30px;
}
</style>