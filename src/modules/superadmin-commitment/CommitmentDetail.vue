<template>
  <div>
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7">
        <v-row>
          <v-col class="d-flex flex-row align-center">
            <v-icon class="mr-4" style="font-size: 55px" color="#F1F2F2"
              >mdi-circle</v-icon
            >
            <div>
              <div class="headline font-weight-bold">{{ currentOrg.name }}</div>
              <div class="d-flex flex-row align-center">
                <v-icon
                  v-if="currentOrg.OrgType == 0"
                  style="width: 18px; height: 18px"
                  >$vuetify.icons.diamondIcon</v-icon
                >
                <v-icon
                  v-if="currentOrg.OrgType == 1"
                  style="width: 18px; height: 18px"
                  >$vuetify.icons.golddiamondIcon</v-icon
                >
                <div class="fz-14 ml-2 accent--text">
                  {{ ["Basic", "Premium"][currentOrg.OrgType] }}
                </div>
              </div>
            </div>
            <v-spacer />
            <v-btn
              class="secondary"
              height="50"
              width="150"
              depressed
              @click="
                () => {
                  openDoalogEditOrg = true;
                }
              "
            >
              <span style="font-size: 12px">Edit Organization</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <v-card-text class="pa-7">
        <v-row style="font-size: 12px">
          <v-col class="py-0">
            <p class="mb-0">
              <b>Details:</b><br />
              {{ currentOrg.details }}<br />
            </p>
          </v-col>
          <v-col class="py-0 d-flex justify-center">
            <p class="mb-0"><b>Address:</b><br />{{ currentOrg.address }}</p>
          </v-col>
          <v-col class="py-0 d-flex justify-center">
            <p class="mb-0"><b>Phone:</b><br />{{ currentOrg.phone_number }}</p>
          </v-col>
          <v-col class="py-0">
            <div class="d-flex flex-col justify-center">
              <div>
                <p class="mb-0">
                  <b>Status:</b><br />{{
                    !!currentOrg.Status ? "Active" : "Inactive"
                  }}
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div style="height: 30px; width: auto" />
    <memberlistcard
      v-if="currentOrg"
      title="Member List"
      :organization="currentOrg"
      :fontsize="12"
    />
    <div style="height: 30px; width: auto" />
    <v-card flat class="pa-0 rounded-lg">
      <v-card-text class="pa-7 d-flex flex-row align-center">
        <div class="headline font-weight-bold">Project List</div>
        <v-spacer />
        <v-btn
          class="secondary"
          height="50"
          width="150"
          depressed
          @click="
            () => {
              validatelimitcreateproject().then(() => {
                opendialogaddproj = true;
              });
            }
          "
        >
          <span style="font-size: 12px">New Project</span>
        </v-btn>
        <div style="width: 30px; height: auto" />
        <v-btn
          class="secondary--text"
          style="border: 2px solid #2c94d2; background-color: white"
          height="50"
          width="150"
          depressed
        >
          <span style="font-size: 12px">Download</span>
        </v-btn>
      </v-card-text>
      <v-card-text class="pa-7">
        <v-data-table
          hide-default-footer
          :headers="headers1"
          :server-items-length="projectspagination.count"
          :options.sync="options"
          :items-per-page="5"
          :items="projects"
          show-select
        >
          <template v-slot:item.projectname="{ item }">
            <router-link :to="'/project/' + item.name">{{
              item.name
            }}</router-link>
          </template>
          <template v-slot:item.projectnumber="{ item }">
            {{ item.id }}
          </template>
          <template v-slot:item.description="{ item }">
            {{ item.description }}
          </template>
          <template v-slot:item.action="{ item }">
            <router-link :to="'/project/' + item.name"> details </router-link>
          </template>
          <template v-slot:footer="{ props }">
            <custom-footer-datatable
              @input="
                (val) => {
                  options = val;
                }
              "
              :props="props"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <dialogEditOrganization
      v-if="openDoalogEditOrg"
      v-model="openDoalogEditOrg"
      :organization="currentOrg"
      @updated="
        () => {
          fetchorganization(currentOrg);
        }
      "
    />
  
      v-model="opendialogaddproj"
      @added="
        () => {
          fetchprojects(options);
        }
      "
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, onMounted } from "@vue/composition-api";
import { useMember } from "../organization/usemember";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogEditOrganization from "../organization/editorganization.dialog.vue";
import memberlistcard from "../organization/memberlist.card.vue";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import { PROJECT } from "../project/namespace";
export default defineComponent({
  components: { dialogEditOrganization, memberlistcard },
  props: ["currentOrg"],
  setup(props: any) {
    const {
      fetchprojects,
      fetchorganization,
    } = useNamespacedActions(SUPERADMINMANAGEORG, [
      "fetchprojects",
      "fetchorganization",
    ]);
    const options = ref({});
    watch(
      options,
      (val) => {
        const op = { id: props.currentOrg.id, ...val };
        fetchprojects(op);
      },
      { deep: true }
    );
    onMounted(() => {
      fetchprojects({ id: props.currentOrg.id });
    });
    const {
      projects,
      projectspagination,
    } = useNamespacedState(SUPERADMINMANAGEORG, [
      "projects",
      "projectspagination",
    ]);
    const Composable = {
      ...useMember(),
    };
    const { fetchmembers } = Composable;
    const { changeorgstatus } = useNamespacedActions(SUPERADMINMANAGEORG, [
      "changeorgstatus",
    ]);
    const switchstatus = async (item: any) => {
      return await changeorgstatus(item);
    };
    const opendialogaddproj = ref(false);
    const { validatelimitcreateproject } = useNamespacedActions(PROJECT, [
      "validatelimitcreateproject",
    ]);
    return {
      validatelimitcreateproject,
      opendialogaddproj,
      switchstatus,
      options,
      fetchprojects,
      projectspagination,
      projects,
      fetchorganization,
      ...Composable,
    };
  },

  data() {
    return {
      openDoalogEditOrg: false,
      switch1: true,
      headers: [
        { text: "Name", value: "name" },
        { text: "Project", value: "project" },
        { text: "Role ", value: "role" },
        { text: "Status ", value: "status" },
        { text: "Action ", value: "action", align: "center" },
      ],
      headers1: [
        { text: "Project Name ", value: "projectname", sortable: false },
        { text: "Project Number ", value: "projectnumber", sortable: false },
        { text: "Description ", value: "description", sortable: false },
        { text: "Action ", value: "action", sortable: false, align: "center" },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.v-input--selection-controls {
  margin-top: 0;
}
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--is-readonly {
  ::v-deep input {
    cursor: auto;
  }
}
</style>