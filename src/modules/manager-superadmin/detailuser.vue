<template>
  <div v-if="userdetail">
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7">
        <v-row>
          <v-col class="d-flex flex-row align-center">
            <v-icon
              class="mr-4"
              style="font-size: 55px"
              color="#F1F2F2"
            >
              mdi-circle
            </v-icon>
            <div class="headline font-weight-bold">{{ userdetail.name }}</div>
            <v-spacer/>
            <v-btn
              class="secondary"
              height="50"
              width="150"
              depressed
              @click="
                () => {
                  opendialogedituser = true;
                }
              "
            >
              <span style="font-size: 12px">Edit</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider/>
      <v-card-text class="pa-7">
        <v-row style="font-size: 12px">
          <v-col class="py-0">
            <p class="mb-0">
              <b>Email:</b><br/>
              {{ userdetail.email }}
            </p>
          </v-col>
          <v-col class="py-0 d-flex justify-center">
            <p class="mb-0"><b>Organization:</b><br/>{{ userdetail.org.name }}</p>
          </v-col>
          <v-col class="py-0 d-flex justify-center">
            <p class="mb-0"><b>Role:</b><br/>{{ userdetail.role.name }}</p>
          </v-col>
          <v-col class="py-0 d-flex justify-center">
            <p class="mb-0"><b>Join Date:</b><br/>14 Desember 2020</p>
          </v-col>
          <v-col class="py-0">
            <div class="d-flex flex-col justify-center">
              <div>
                <p class="mb-0"><b>Status:</b><br/>Active</p>
              </div>
              <div class="ml-7">
                <v-switch :readonly="true" v-model="switch1" inset></v-switch>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div style="height: 30px; width: auto"/>
    <v-card flat class="rounded-lg pa-4">
      <v-card-text class="d-flex flex-row align-center">
        <div class="headline font-weight-bold font--text">Member List</div>
      </v-card-text>
      <v-card-text>
        <v-data-table
          hide-default-footer
          :headers="headers"
          hide-default-header
          :items="members">
          <template v-slot:header="{ props, on }">
            <v-data-table-header v-on="on" v-bind="props" sort-icon="mdi-menu-down">
            </v-data-table-header>
          </template>
          <template v-slot:item.name="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item.email="{ item }">
            {{ item.email }}
          </template>
          <template v-slot:item.project="{ item }">
            {{ item.project ? item.project.name : '' }}
          </template>
          <template v-slot:item.role="{ item }">
            {{ item.role.name }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-switch flat v-model="item.status"></v-switch>
          </template>
          <template v-slot:item.action="{ item }">
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
								}
							"
                >More
                  <v-icon
                    :class="{
									rotate: item.open,
								}"
                    :id="'popup' + item.id"
                    color="primary"
                  >mdi-chevron-down
                  </v-icon
                  >
                </label>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Detail</v-list-item-title>
                </v-list-item>
                <v-list-item style="min-height:1px; margin-left:-16px;margin-right:-16px">
                  <v-divider style="min-width:160px"/>
                </v-list-item>
                <v-list-item
                  @click="
								() => {
									// opendialogdelete = true;
								}
							"
                >
                  <v-list-item-title class="error--text"
                  >Delete
                  </v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </popupquote>
          </template>
        </v-data-table>
      </v-card-text>
      <dialogAddUser v-model="opendialogadduser"/>
      <dialogEditUser v-if="userdetail" :memberselectedvalue="userdetail" v-model="opendialogedituser"/>
    </v-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, Ref } from "@vue/composition-api";
import { useMember } from "../organization/usemember";
// import { useProjects } from "../project/useprojects";
import {
  useNamespacedActions,
} from "vuex-composition-helpers";
import dialogEditUser from './dialogEditUser.vue'
import dialogAddUser from './dialogAddUser.vue'

export default defineComponent({
  components: { dialogEditUser, dialogAddUser },
  setup(props: any) {
    // const { fetchprojects } = useNamespacedActions("ORGANIZATION", [
    //   "fetchprojects",
    // ]);
    const { fetchmemberById } = useNamespacedActions('MEMBER', ['fetchmemberById'])
    //const projects = ref([]);
    const Composable = {
      ...useMember()
    }
    const { fetchmembers } = Composable
    const userdetail: Ref = ref({})
    const setuserdetail = (data: any) => {
      userdetail.value = data
    }
    return {
      setuserdetail, userdetail,
      fetchmemberById,
      //...useProjects(),
      //fetchprojects,
      //projects,
      ...Composable
    };
  },
  data() {
    return {
      opendialogadduser: false,
      memberselectedvalue: '',
      opendialogedituser: false,
      switch1: true,
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Project",
          value: "project",
        },
        {
          text: "Join Date",
          value: "joindate",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Action",
          value: "action",
          align: 'center'
        },
      ],
    };
  },
  created() {
    this.fetchmembers()
  }
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
</style>