<template>
  <div>
    <div class="row">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8" fluid>
            <v-overlay :value="loading">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
            <v-row class="pb-5">
              <v-col class="d-flex align-center">
                <p class="mb-0 fz-21 font-weight-bold">Open Support Ticket</p>
                <v-spacer />
                <v-btn
                  depressed
                  class="secondary ml-7"
                  to="/ticket/create-ticket"
                  ><span class="fz-14">Create Ticket</span></v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="3">
                <v-select
                  placeholder="Organization"
                  outlined
                  :items="organizations"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-col> -->
              <v-col cols="4">
                <v-select
                  placeholder="Project"
                  outlined
                  :items="projects"
                  item-text="name"
                  item-value="id"
                  v-model="projectselected"
                  flat
                  clearable
                  hide-details=""
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  placeholder="Request Type"
                  outlined
                  :items="requestsItem"
                  item-text="name"
                  item-value="ID"
                  v-model="typeselected"
                  flat
                  clearable
                  hide-details=""
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  placeholder="Status"
                  outlined
                  :items="statusitem"
                  item-text="name"
                  item-value="ID"
                  v-model="statusselected"
                  flat
                  clearable
                  hide-details=""
                ></v-select>
              </v-col>
            </v-row>
            <v-data-table
              :headers="table.headers"
              :items="tickets"
              :items-per-page="10"
              class="elevation-0"
              :server-items-length="totalRowsTickets"
              :options.sync="options"
              hide-default-footer
              item-key="createddate"
            >
              <template v-slot:item.subject="{ item }">
                <a
                  @click="
                    () => {
                      $router.push(`/ticket-detail/${item.id}`);
                    }
                  "
                >
                  {{ item.subject }}
                </a>
              </template>
              <template v-slot:item.project_name="{ item }">
                <div v-if="item.project_name !== ''">
                  {{ item.project_name }}
                </div>
                <div v-else>
                  -
                </div>
              </template>
              <template v-slot:item.created_at="{ item }">
                <p class="ml-3 mt-4">
                  {{ $moment(new Date(item.created_at)).locale('en').format("DD/MM/YYYY hh:mm A") }}
                </p>
              </template>

              <template v-slot:item.status="{ item }">
                <span class="cyan--text" v-if="item.status === 'Open'">{{
                  item.status
                }}</span>
                <span class="green--text" v-if="item.status === 'Resolved'">{{
                  item.status
                }}</span>
                <span class="red--text" v-if="item.status === 'Rejected'">{{
                  item.status
                }}</span>
                <span class="" v-if="item.status === 'Onhold'">{{
                  item.status
                }}</span>
                <span class="grey--text" v-if="item.status === 'In Progress'">{{
                  item.status
                }}</span>
                <span class="primary--text" v-if="item.status === 'Closed'">{{
                  item.status
                }}</span>
                <span class="" v-if="item.status === 'Assigned'">
                  {{ item.status }}</span
                >
                <span class="" v-if="item.status === 'Released Onhold'">
                  {{ item.status }}</span
                >
                <span class="" v-if="item.status === ''"> - </span>
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

            <!-- <v-simple-table
              v-if="!tickets.length"
              style="border: 1px solid #cad6e1"
            >
              <thead>
                <tr>
                  <th>Subjet</th>
                  <th>Ticket ID</th>
                  <th>Created Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colspan="4" class="py-8">
                    <v-row align="center" justify="center">
                      <div class="text-center w-50">
                        <h3>No Ticket</h3>
                      </div>
                    </v-row>

                    <v-row>
                      <v-col class="d-flex flex-row justify-center">
                        <router-link to="/ticket/create-ticket">
                          <v-btn
                            depressed
                            class="secondary"
                            height="55"
                            width="465"
                            ><span class="fz-14">Create Ticket</span></v-btn
                          >
                        </router-link>
                      </v-col>
                    </v-row>
                  </td>
                </tr>
              </tbody>
            </v-simple-table> -->
          </v-container>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<script>
import ticket from "./ticket";
import { onMounted, reactive, ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { TICKET } from "./namespace";
import { useProjects } from "@/modules/project/useprojects";
import { PROJECT } from "../project/namespace";

export default {
  setup() {
    const { items } = ticket();
    const Composable = {
      ...useProjects(),
    };

    const { fetchprojects, projectselected } = Composable;
    const typeselected = ref();
    const statusselected = ref();
    const projek = localStorage.getItem("projectid")
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"))
    projectselected.value = projek

    const loading = ref(false);

    const table = reactive({
      headers: [
        { text: "Subject", value: "subject", sortable: false },
        { text: "Project", value: "project_name", sortable: false },
        { text: "Request Type", value: "request_type", sortable: false },
        { text: "Site", value: "site", sortable: false },
        { text: "Created date", value: "created_at" },
        { text: "Status", value: "status", sortable: false },
        // { text: "Action", value: "action", sortable: false },
      ],
    });
    const {
      fetchtickets,
      fetchstatus,
      fetchrequest,
    } = useNamespacedActions(TICKET, [
      "fetchtickets",
      "fetchstatus",
      "fetchrequest",
    ]);
    const {
      // tickets,
      pagination,
      statusitem,
      requestsItem,
    } = useNamespacedState(TICKET, [
      // "tickets",
      "pagination",
      "statusitem",
      "requestsItem",
    ]);
    const { fetchTicketss } = useNamespacedActions("TICKETADMIN", ["fetchTicketss"])
    const { tickets, totalRowsTickets } = useNamespacedState("TICKETADMIN", ["tickets", "totalRowsTickets"])
    const { projects  } = useNamespacedState(PROJECT, ["projects"]);

    const projectByOrg = ref([])
    const selectedproject = ref([])
    selectedproject.value.push(projek)

    onMounted( async() => {
      fetchrequest();
      await fetchprojects();
      // fetchtickets();
      projects.value.map( (data) => {
        projectByOrg.value.push(data.id)
      })
      fetchstatus();
    });
    const severities = ref(["Normal", "Important", "Crucial"]);
    const status = ref([
      "Resolved",
      "In Progress",
      "Waiting Response",
      "Declined",
    ]);
    const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);

    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, project: selectedproject});

    watch(options, async (val) => {
      loading.value = true
      try {
        await fetchTicketss(val);
      } finally {
        loading.value = false;
      }
    });
    // watch(
    //   options,
    //   (val) => {
    //     fetchtickets(val);
    //   },
    //   { deep: true }
    // );

    watch(projectselected, async (val) => {
      loading.value = true
      options.value.page = 1;
      if (val) {
        selectedproject.value = []
        selectedproject.value.push(val)
        options.value.project = selectedproject.value;
      } else {
        options.value.project = projectByOrg;
        options.value.organization = currentOrg.id
        // options.value.user = currentOrg.user_id
      }
      let resp = await fetchTicketss(options.value);
      if(resp.code == 200){
        loading.value = false
      }
    });

    watch(typeselected, async (val) => {
      loading.value = true
      options.value.page = 1;
      if (val) {
        options.value.type = val;
      } else {
        options.value.type = "";
      }
      let resp = await fetchTicketss(options.value);
      if(resp.code == 200){
        loading.value = false
      }
    });

    watch(statusselected, async (val) => {
      loading.value = true
      options.value.page = 1;
      if (val) {
        options.value.status = val;
      } else {
        options.value.status = "";
      }
      // console.log("Project status" + val);
      let resp = await fetchTicketss(options.value);
      if(resp.code == 200){
        loading.value = false
      }
    });

    const selectStatus = ref([
      {
        text: "Resolved",
        value: "Resolved",
      },
      {
        text: "In Progress",
        value: "In Progress",
      },
      {
        text: "Waiting Response",
        value: "Waiting Response",
      },
      {
        text: "DecLined",
        value: "DecLined",
      },
      {
        text: "Open",
        value: "Open",
      },
    ]);

    return {
      requestsItem,
      statusitem,
      selectStatus,
      options,
      statusselected,
      typeselected,
      projectselected,
      validateprivilages,
      validateprivilagesync,
      status,
      severities,
      projects,
      tickets,
      items,
      table,
      pagination,
      loading,
      totalRowsTickets
    };
  },
};
</script>

<style scoped>
.v-btn {
  height: 45px !important;
}

.title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.title-info {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}
.Resolved {
  color: #27ae60;
}
.close {
  color: #a5b3bf;
}
.open {
  color: #eb5757;
}
</style>
