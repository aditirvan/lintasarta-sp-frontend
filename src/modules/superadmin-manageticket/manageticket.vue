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
                <p class="mb-0 fz-21 font-weight-bold">Manage Ticket </p>
                <v-spacer />
                <v-btn
                  v-if="!read_only"
                  depressed
                  class="secondary ml-7"
                  to="/manage-ticket/create-ticket"
                  ><span class="fz-14">Create Ticket</span></v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="3">
                <v-autocomplete
                :search-input.sync="searchorganization"
                v-model="org"
                :items="organizations"
                outlined
                item-text="name"
                item-value="id"
                placeholder="Select Organization"
                attach="#SelectOrgAttach"
                clearable
                hide-details=""
              >
                <template v-slot:append-outer>
                  <div id="SelectOrgAttach"></div>
                </template>
              </v-autocomplete>
              </v-col> -->
              <v-col cols="4">
                <v-autocomplete
                  placeholder="Select Project"
                  outlined
                  v-model="projectselected"
                  :items="allProjects"
                  return-object
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="type"
                  placeholder="Request Type"
                  outlined
                  :items="requestType"
                  item-text="name"
                  item-value="ID"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="id_status"
                  placeholder="Status"
                  outlined
                  :items="status"
                  item-text="name"
                  item-value="ID"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
            <v-data-table
              :headers="table.headers"
              :items="tickets"
              :items-per-page="5"
              class="elevation-0"
              :server-items-length="totalRowsTickets"
              :options.sync="options"
              hide-default-footer
              item-key="createddate"
            >
              <!-- <template v-slot:item.status="{ item }">
                  <v-select
                    height="50"
                    :items="selectStatus"
                    v-model="item.status"
                    item-text="text"
                    item-value="value"
                    placeholder="Select Status"
                    hide-details=""
                    outlined
                    :menu-props="{ contentClass: item.status }"
                  ></v-select>
              </template> -->
              <template v-slot:item.subject="{ item }">
                <a
                  @click="
                    () => {
                      $router.push(`/detail-ticket/${item.id}`);
                    }
                  "
                >
                  {{ item.subject }}
                </a>
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
              <template v-slot:item.project="{ item }">
                <p>
                  {{ item.name }}
                </p>
              </template>
              <template v-slot:item.created_at="{ item }">
                <p>
                  {{ $moment(new Date(item.created_at)).locale('en').format("DD/MM/YYYY hh:mm A") }}
                </p>
              </template>

               <!-- <template v-slot:item.action="{ item }">
                <popupquote
                  v-model="item.open"
                  :offsetTop="20"
                  :documentid="'popup' + item.id"
                  offset-y
                  allow-overflow
                >
                  <template v-slot:activator="{ on, attrs }">
                    <label
                      v-bind="attrs"
                      class="primary--text linkpointer"
                      style="position: relative; white-space: nowrap"
                      @click="
                        ($event) => {
                          on.click($event);
                          show($event, item);
                        }
                      "
                      >More
                      <v-icon
                        :class="{
                          rotate: item.open,
                        }"
                        :id="'popup' + item.id"
                        color="primary"
                        >mdi-chevron-down</v-icon
                      >
                    </label>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="
                        () => {
                          memberselectedvalue = item;
                          opendialogedituser = true;
                        }
                      "
                    >
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                   
                    <v-list-item
                      style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                    >
                      <v-divider style="min-width: 160px" />
                    </v-list-item>
                    <v-list-item
                      @click="
                        () => {
                          memberselected = item;
                          opendialogdeleteuser = true;
                        }
                      "
                    >
                      <v-list-item-title class="error--text"
                        >Delete</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </popupquote>
              </template> -->

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
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { TICKET } from "./namespace";
import { PROJECT } from "../project/namespace";
import { SUPERADMIN } from '../superadmin/namespace'
import { useUser } from "@/modules/superadmin-manageuser/useUser";
import { useProjects } from "@/modules/project/useprojects";

import { AccessControl } from "@/lib/middleware";

export default {
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Tickets'));
    const { items } = ticket();
    const Composable = { 
      ...useUser(),
      ...useProjects()
    }

    const table = reactive({
      headers: [
        { text: "Subject", value: "subject" },
        { text: "Project", value: "project_name" },
        { text: "Request Type", value: "request_type" },
        { text: "Site", value: "site", sortable: false },
        { text: "Created date", value: "created_at" },
        { text: "Status", value: "status" },
        // { text: "Action", value: "action", sortable: false },
      ],
    });
    const { fetchTicketss, fetchRequestType, fetchStatus } = useNamespacedActions(TICKET, ["fetchTicketss", "fetchRequestType", "fetchStatus"]);
    const { tickets, pagination, totalRowsTickets } = useNamespacedState(TICKET, [
      "tickets",
      "pagination",
      "totalRowsTickets"
    ]);
    const { requestType, status } = useNamespacedState(TICKET, ["requestType", "status"]);
    const { fetchorganizations } = useNamespacedActions(SUPERADMIN, [
      "fetchorganizations"
    ]);
    const { organizations } = useNamespacedState(SUPERADMIN, [
      "organizations",
    ]);

    const loading = ref(false);
    const projects = ref([])
    const type = ref("")
    const id_status = ref("")
    const org = ref();
    const { projectselected } = Composable
    const projek = localStorage.getItem("projectid")
    projectselected.value = projek
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      project: projek
    });
    const allProjects = ref([])

    onMounted( async () => {
      let res = await fetchorganizations({ limiitemsPerPage : -1})
      await fetchRequestType();
      await fetchStatus()

      if (res.status == 200) {
          let projects = [];
          organizations.value.forEach((org) => {
            if (org.projects == null) {
              projects.push({
                value: "-",
                text: "-",
                organizationName: org.name,
                organizationId: org.id,
                projectData: "-",
                organizationData: org,
              });
            } else {
              org.projects.forEach((pro) => {
                projects.push({
                  value: pro.id,
                  text: pro.name,
                  organizationName: org.name,
                  organizationId: org.id,
                  projectData: pro,
                  organizationData: org,
                });
              });
            }
          });
          allProjects.value = projects;
        }
    });

    const severities = ref(["Normal", "Important", "Crucial"]);
    const {
      validateprivilages,
      validateprivilagesync,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);

    watch(
      options,
      async (val) => {
        loading.value = true
        try{
          await fetchTicketss(val);
        }finally {
            loading.value = false;
        }
      },
      { deep: true }
    );
    // watch(org, (val) => {
    //   if(val){
    //     options.value.organization = val
    //   }else{
    //     options.value.organization = ""
    //     options.value.project = ""
    //   }
    //   fetchprojects({page:1, limitPerPage: -1, id: val})
    //   fetchTicketss(options.value)
    // })
    watch(projectselected, async (val) => {
      loading.value = true
      options.value.page = 1
      if (val) {
        options.value.project = val.value;
      }else {
        options.value.project = ""
      }
      let resp = await fetchTicketss(options.value)
      if(resp.code == 200){
        loading.value = false
      }
    })
    watch(type, async (val) => {
      loading.value = true
      options.value.page = 1
      if(val){
        options.value.type = val
      }else{
        options.value.type = ""
      }
      let resp = await fetchTicketss(options.value)
      if(resp.code == 200){
        loading.value = false
      }
    })
    watch(id_status, async (val) => {
      loading.value = true
      options.value.page = 1
      if(val){
        options.value.status = val
      }else{
        options.value.status = ""
      }
      let resp = await fetchTicketss(options.value)
      if(resp.code == 200){
        loading.value = false
      }
    })

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
      ...Composable,
      read_only,
      
      selectStatus,
      options,
      validateprivilages,
      validateprivilagesync,
      severities,
      projects,
      tickets,
      totalRowsTickets,
      loading,
      items,
      table,
      pagination,
      requestType,
      org,
      type,
      status,
      id_status,
      allProjects
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