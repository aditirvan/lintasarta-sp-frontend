<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col md="12">
        <v-card flat class="rounded-lg pa-4">
          <v-card-title>
            <div class="headline font-weight-bold font--text">
              My Account Settings
            </div>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col md="12">
        <v-card flat class="rounded-lg pa-4">
          <v-card-text>
            <div class="d-flex flex-row">
              <div class="mr-4">
                <v-icon style="font-size: 60px" color="#F1F2F2"
                  >mdi-circle</v-icon
                >
              </div>
              <div class="d-flex flex-column align-self-center">
                <div class="headline font-weight-bold font--text">
                  {{ userprofile.email }}
                </div>

                <p class="mb-0" style="font-size: 12px; color: #a5b3bf">
                  Member since
                  {{
                    $moment(new Date(userprofile.createdate)).format(
                      "DD/MM/YYYY"
                    )
                  }}
                </p>

                <p class="mb-0" style="font-size: 12px;">
                  <b>Sales:</b> {{ currentOrg ? (currentOrg.sales && currentOrg.sales.fullname ? currentOrg.sales.fullname : '-') : '-' }}
                </p>

                <!-- postpaid / prepaid -->
                <p v-if="service_type !== 'undefined'" :style="{marginTop: '8px', display: 'flex', alignItems: 'center', color: service_type === 'postpaid' ? '#27AE60' : '#A5B3BF'}">
                  <img :src="service_type === 'postpaid' ? '/postpaid.png' : '/prepaid.png'" alt="postpaid-logo" :style="{marginRight: '4px'}" />
                  {{uppercaseFirstLetter(service_type)}}
                </p>
              </div>
              <v-spacer />
              <div class="d-flex align-self-center">
                <v-btn
                  @click="
                    () => {
                      opendialogchangepassword = true;
                    }
                  "
                  depressed
                  outlined
                  height="50"
                  width="150"
                  class="secondary--text"
                  >Change Password</v-btn
                >
                <div style="height: auto; width: 28px"></div>
                <v-btn
                  @click="
                    () => {
                      memberselected = userprofile;
                      opendialogeditprofile = true;
                    }
                  "
                  depressed
                  height="50"
                  width="150"
                  class="secondary"
                  >Edit Profile</v-btn
                >
              </div>
            </div>
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col class="d-flex">
                <v-icon
                  class="mr-4"
                  style="font-size: 60px; visibility: hidden"
                  color="#F1F2F2"
                  >mdi-circle</v-icon
                >
                <p>
                  <b>Full Name:</b><br />
                  {{ userprofile.fullname }}
                </p>
              </v-col>

              <v-col class="justify-left d-flex">
                <p>
                  <b>Phone Number:</b><br />
                  {{ userprofile.phone }}
                </p>
              </v-col>

              <v-col class="justify-left d-flex">
                <p>
                  <b>Address:</b><br />
                  {{ userprofile.address }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="12"
        :style="{ 'display': isShowSshGrid ? '': 'none' }"
      >
        <v-card flat class="rounded-lg pa-4">
          <v-card-title>
            <div class="headline font-weight-bold font--text">
              SSH Keys
            </div>
            <v-btn
              id="CreateNewAttach"
              depressed
              class="secondary mb-5 ml-auto"
              height="50"
              width="150"
              @click="
                () => {
                  userId = userprofile.id;
                  opendialogaddssh = true;
                }
              "
              ><span class="fz-14">Add SSH Key</span></v-btn
            >
          </v-card-title>
          <div>
            <v-container class="px-4">
              <template>
                <v-data-table
                  :headers="table.headers"
                  :items="sshkeys"
                  :items-per-page="10"
                  :server-items-length="pagination.count"
                  :options.sync="options"
                  hide-default-footer
                >
                  <template #[`item.fingerprint`]="{ item }">
                    <p>
                      {{ item.fingerprint !== "" ? item.fingerprint : "-" }}
                      <span
                        v-if="item.fingerprint"
                        @click="copyToClipBoard(item.fingerprint)"
                        class="primary--text pr-3 delete ml-4"
                        >Copy</span
                      >
                    </p>
                  </template>
                  <template #[`item.action`]="{ item }">
                    <span
                      @click="
                        () => {
                          ssh = item.id;
                          userId = userprofile.id;
                          openDialogDeleteSsh = true;
                        }
                      "
                      class="error--text pr-3 delete ml-4"
                      >Delete</span
                    >
                    <span
                      @click="
                        () => {
                          sshItem = item;
                          openDialogUpdate = true;
                        }
                      "
                      class="primary--text pr-3 delete ml-4"
                      >Edit</span
                    >
                  </template>
                  <template #footer="{ props }">
                    <custom-footer-datatable
                      @input="
                        (val) => {
                          options = { ...options, ...val };
                        }
                      "
                      :props="props"
                    />
                  </template>
                </v-data-table>
              </template>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <dialogEditProfile
      :userselected="memberselected"
      v-if="memberselected && opendialogeditprofile"
      v-model="opendialogeditprofile"
    />
    <dialodchangepassword
      v-if="opendialogchangepassword"
      v-model="opendialogchangepassword"
    />
    <dialogupdatessh
      v-if="sshItem && openDialogUpdate"
      :ssh="sshItem"
      v-model="openDialogUpdate"
      @close="openDialogUpdate = false"
    />
    <dialogcreatessh
      :userid="userId"
      v-if="userId && opendialogaddssh"
      v-model="opendialogaddssh"
      @close="opendialogaddssh = false"
    />
    <dialogdeletessh
      :ssh-id="ssh"
      :user-id="userId"
      v-if="ssh && userId && openDialogDeleteSsh"
      v-model="openDialogDeleteSsh"
      @close="openDialogDeleteSsh = false"
    />
  </v-container>
</template>
<script>
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import dialodchangepassword from "./dialogChangePassword";
import dialogEditProfile from "./dialogEditProfile";
import { PROFILE } from "./namespace";
import dialogcreatessh from "./dialogCreateSsh.vue";
import dialogdeletessh from "./dialogDeleteSsh.vue";
import dialogupdatessh from "./dialogUpdateSsh.vue";
import localStorage from "@/lib/localstorage";

export default {
  components: {
    dialodchangepassword,
    dialogEditProfile,
    dialogcreatessh,
    dialogupdatessh,
    dialogdeletessh,
  },
  setup() {
    const { member, userprofile } = useNamespacedState("ROLEPERMISSION", [
      "member",
      "userprofile",
    ]);

    const { fetchsshkeys } = useNamespacedActions(PROFILE, ["fetchsshkeys"]);
    const { showSuccessToast } = useNamespacedActions("HOMEPAGE", [
      "showSuccessToast",
    ]);
    const { fetchUserProfile } = useNamespacedActions("ROLEPERMISSION", [
      "fetchUserProfile",
    ]);
    const { sshkeys, pagination } = useNamespacedState(PROFILE, [
      "sshkeys",
      "pagination",
    ]);

    const openDialogDeleteSsh = ref(false);

    const table = reactive({
      headers: [
        { text: "Region", value: "region", sortable: false },
        { text: "Project", value: "project", sortable: false },
        { text: "Name", value: "name", sortable: false },
        { text: "Fingerprint", value: "fingerprint", sortable: false },
        { text: "Action", value: "action", sortable: false, align: "center" },
      ],
    });
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      rowsPerPage: 10,
      search: "",
      sortBy: [],
      sortDesc: [],
    });

    const sshselected = ref("");
    const userId = ref("");
    const ssh = ref("");
    const sshItem = ref({});

    const profile = JSON.stringify(userprofile.value.id);

    const copyToClipBoard = (data) => {
      window.navigator.clipboard.writeText(data);
      showSuccessToast("Clipboard Copied!");
    };

    watch(
      options,
      (val) => {
        fetchsshkeys(profile.id, options);
      },
      { deep: true }
    );

    let isShowSshGrid = ref(true);
    onMounted(() => {
      fetchUserProfile().then((profile) => {
        fetchsshkeys(profile.id, options);
      });
      const role = localStorage.getItem('role')
      if (role !== "Superadmin" || role === 'Customer-Care' || role === 'GodMode') {
        const privilages = JSON.parse(localStorage.getItem('privilages'));
        privilages.map((x) => {
          let name = x.name.toLowerCase()
          if (x.disable && name == 'instance') {
            isShowSshGrid.value = false
          }
        })
      }
    });

    const Update = () => {
      return member.value.ref.update({
        name: member.value.name,
        email: member.value.email,
        phone: member.value.phone,
        address: member.value.address,
      });
    };
    return {
      userId,
      memberselected: ref(),
      opendialogeditprofile: ref(false),
      opendialogchangepassword: ref(false),
      userprofile,
      member,
      copyToClipBoard,
      profile,
      Update,
      dialog: ref(false),
      table,
      sshkeys,
      opendialogaddssh: ref(false),
      openDialogDeleteSsh,
      sshselected,
      openDialogUpdate: ref(false),
      ssh,
      sshItem,
      options,
      pagination,
      isShowSshGrid,
    };
  },
  computed: {
    service_type() {
      return localStorage.getItem('service_type')
    },
    currentOrg() {
      const json = localStorage.getItem('currentOrg')
      const obj = json && json !== 'undefined' ? JSON.parse(json) : {}
      return obj
    },
  },
  methods: {
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
};
</script>
<style lang="scss" scoped>
.v-card__text {
  ::v-deep [type="button"].error--text {
    border: 2px solid red;
    background-color: transparent !important;
  }
  ::v-deep p {
    font-size: 12px;
  }
}
</style>
