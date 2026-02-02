<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="12" md="8">
                <div class="headline font-weight-bold font--text">Security</div>
              </v-col>
              <v-col cols="12" md="4" class="d-flex justify-end align-center">
                <v-btn
                  style="height: 45px; width: 150px; font-size: 12px"
                  class="secondary mr-5"
                  depressed
                  v-if="securities.length && user_role === 'Superadmin'"
                  @click="() => {openSyncDialog = true;}"
                  >Sync Security</v-btn
                >
                <router-link to="/security/create-firewall" v-if="!read_only">
                  <v-btn
                    style="height: 45px; width: 150px; font-size: 12px"
                    class="secondary"
                    depressed
                    v-if="securities.length"
                    >Create Security</v-btn
                  >
                </router-link>
              </v-col>
            </v-row>
            <br />
            <v-data-table
              v-if="securities.length"
              :headers="table.headers"
              :items="securities"
              :items-per-page="10"
              class="elevation-0"
              hide-default-footer
            >
              <template v-slot:item.name="{ item }">
                <router-link :to="`/security/${item.id}`">
                  <span class="primary--text">{{ item.name }}</span>
                </router-link>
              </template>
              <template v-slot:item.apply="{ item }">
                <div>
                  {{
                    item.instance_ids.length
                      ? item.instance_ids.length > 1
                        ? `${item.instance_ids.length} Instances`
                        : `${item.instance_ids.length} Instance`
                      : "-"
                  }}
                </div>
              </template>
              <template v-slot:item.rule="{ item }">
                <div>
                  {{ item.security_rules.length }}
                </div>
              </template>
              <template v-slot:item.action="{ item }">
                <router-link
                  :to="{
                    path: `/security/edit-firewall/${item.id}`
                  }"
                >
                  <span class="primary--text edit">Edit</span>
                </router-link>
                <span
                  @click="
                    () => {
                      validateprivilages(['Security', 'editor']).then(() => {
                        selectedsecurity = item;
                        opendialogdelete = true;
                      });
                    }
                  "
                  class="error--text delete ml-4"
                  >Delete</span
                >
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  v-if="securities.length > 5"
                  :props="props"
                />
              </template>
            </v-data-table>
            <v-card flat outlined class="rounded-lg" v-else>
              <v-col md="12">
                <v-card
                  flat
                  class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
                >
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don’t have any Security Group
                    </p>
                    <v-row>
                      <v-col>
                        <p
                          style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          "
                        >
                          Manage access to the ports of your Instance with
                          security groups
                        </p>
                      </v-col>
                    </v-row>
                    <v-row v-if="!read_only">
                      <v-col>
                        <v-btn
                          v-if="user_role === 'Superadmin'"
                          width="100%"
                          append
                          max-width="150"
                          height="50"
                          depressed
                          class="secondary mr-5"
                          exact
                          @click="() => {openSyncDialog = true;}"
                        >
                          Sync Security Group
                        </v-btn>
                        <v-btn
                          width="100%"
                          append
                          max-width="300"
                          height="50"
                          depressed
                          class="secondary"
                          exact
                          to="/security/create-firewall"
                        >
                          Create Security Group
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogDeleteSecurity
      v-if="selectedsecurity && opendialogdelete"
      v-model="opendialogdelete"
      :selectedsecurity="selectedsecurity"
      @deleted="
        () => {
          fetchsecurity();
        }
      "
    />
    <dialogSyncSecurity
      v-if="openSyncDialog" 
      v-model="openSyncDialog"
      :isLoading="isLoading"
      @close="openSyncDialog = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import { SECURITY } from "./namespace";
import dialogDeleteSecurity from "./dialogDeleteSecurity.vue";
import dialogSyncSecurity from "./dialogSyncSecurity.vue";
import localstorage from "@/lib/localstorage";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: { dialogDeleteSecurity, dialogSyncSecurity },
  setup(props,context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Security'));
    const user_role = localstorage.getItem("role");
    const table = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "Applied to", value: "apply" },
        { text: "Rules", value: "rule" },
        { text: "Action", sortable: false, align: "center", value: "action" }
      ]
    });
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew"
    ]);
    const { fetchsecurity } = useNamespacedActions(SECURITY, ["fetchsecurity"]);
    const { securities } = useNamespacedState(SECURITY, ["securities"]);

    const openSyncDialog = ref(false);

    const openSyncDialogHandler = () => {
      openSyncDialog.value = true;
    };

    onMounted(() => {
      if(read_only.value){
        table.headers.pop()
      }
    })
    return {
      read_only,
      user_role,

      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      table,
      fetchsecurity,
      securities,
      opendialogdelete: ref(false),
      selectedsecurity: ref(""),
      openSyncDialog,
      openSyncDialogHandler,
    };
  },
  created() {
    this.fetchsecurity();
  }
});
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}

.edit,
.delete {
  cursor: pointer;
}

.firewall-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>
