<template>
  <v-card flat class="pa-3 rounded-lg">
    <v-card-title class="pb-7">
      <div class="headline font-weight-bold font--text">User Organization</div>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!loading && detailOrg.is_white_label"
        depressed
        height="50"
        width="150"
        class="secondary mr-2"
        :style="{ 'font-size': `${fontsize || 14}px` }"
        :disabled="detailOrg.IsRoleRestored"
        @click="
          () => {
            validateprivilages(['Organization', 'editor']).then(() => {
              dialogRestoreRole = true;
            });

          }
        "
        >Restore Role</v-btn>

      <p v-if="loading" class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <v-btn
        v-else-if="!read_only"
        id="AddNewMember"
        @click="
          () => {
            validateprivilages(['Organization', 'editor']).then(() => {
              dialogaddmember = true;
            });
          }
        "
        depressed
        height="50"
        width="150"
        class="secondary"
        :style="{ 'font-size': `${fontsize || 14}px` }"
        :disabled="organization.is_personal"
        >Add New User</v-btn
      >
    </v-card-title>
    <v-card-text :class="{ animate: loading }">
      <v-data-table
        hide-default-footer
        :headers="headers"
        :items="members"
        :server-items-length="pagination.count"
        :items-per-page="limit"
        :options.sync="options"

      >
        <template v-slot:item.fullname="{ item }">
          <div class="d-flex">
            <div class="dotblue mt-2"></div>
            <div>
              <span
                @click="
                  () => {
                    memberselectedvalue = item;
                    opendialogdetailuser = true;
                  }
                "
                class="primary--text linkpointer"
                >{{ item.fullname }}</span
              >
              <p>{{ item.email }}</p>
            </div>
          </div>
        </template>
        <template v-slot:item.project="{ item }" >
          <div v-if="userrole !='Superadmin'">
            <span
              @click="
                () => {
                  memberselectedvalue = item;
                  opendialoglistproject = true;
                }
              "
              class="linkpointer"
              v-if="item.project && item.project.length > 1"
            >
              {{ item.project.length }} projects
            </span>
            <span
              v-else-if="item.project && item.project.length == 1"
            >
              {{ item.project[0].name }}
            </span>
          </div>

           <div v-else>
            <span
              @click="
                () => {
                  memberselectedvalue = item;
                  opendialoglistproject = true;
                }
              "
              class="linkpointer"
              v-if="item.user_project && item.user_project.length > 1"
            >
              {{ item.user_project.length }} projects
            </span>
            <span
              v-else-if="item.user_project && item.user_project.length == 1"
            >
              {{ item.user_project[0].project.name}}
            </span>
          </div>
        </template>

        

        <template v-slot:item.role_name="{ item }">
          <span v-if="item.is_creator">
            Creator
          </span>

          <span v-else>
            {{ item.role_name == null ? item.role.name : item.role_name }}
          </span>
          
        </template>

        <template #[`item.verified_at`]="{ item }">
          <div class="primary--text" v-if="item.verified_at">Verified</div>
          <div class="red--text" v-else>Unverified</div>
        </template>

        <template #[`item.is_identity_verified`]="{ item }">
          <div
            v-if="item.is_identity_verified === true"
            class="npwp-verified min-width-200"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Verified </u>
          </div>

          <div
            v-if="item.is_identity_verified === false"
            class="npwp-notverified min-width-200"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Unverified </u>
          </div>

          <div
            v-if="item.is_identity_verified === null"
            class="npwp-waiting-confirmation min-width-200"
            @click="() => { 
              if (read_only) {
                return
              }
              memberselectedvalue = item; 
              memberselected = item; 
              opendialognpwpktp = true; 
            }"
          >
            <u> Waiting </u>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <div>
            <v-switch
              true-value="active"
              false-value="deactive"
              flat
              readonly
              :disabled="(item.role.name == 'Owner' && userrole != 'Superadmin' && item.is_creator==true) || read_only"
              @click="
                () => {
                  if (read_only){
                    return
                  }
                  validateprivilages(['Organization', 'editor']).then(() => {
                    memberselectedvalue = item;
                    opendialogactivateuser = true;
                  });
                }
              "
              :input-value="item.status"
            ></v-switch>
          </div>
        </template>
        <template v-slot:item.created_at="{ item }">
          {{ $FormatDate(item.created_at) }}
        </template>

        <template v-slot:item.action="{ item }"  >
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
              v-if="!read_only"
              :disabled="item.verified_at !== '' && item.status === 'active' || item.verified_at !== '' ? true : false"
                @click="
                  () => {
                    memberselected = item;
                    opendialogresendinviteuser = true;
                  }
                "
              >
                <v-list-item-title 
                  >Resend Invitation</v-list-item-title
                >
              </v-list-item>
                
              <v-list-item
                v-if="!read_only"
                :disabled="!((is_creator.toString() == 'true' || userrole == 'Superadmin') && item.is_creator.toString() == 'true')"
                @click="
                  () => {
                    validateprivilages(['Organization', 'editor']).then(() => {
                      memberselectedvalue = item;
                      opendialogtransferuser = true;
                    });
                  }
                "
              >
                <v-list-item-title>Transfer Creator Role</v-list-item-title>
              </v-list-item>

              <v-divider style="min-width: 160px" />
              
              <v-list-item v-if="!read_only"
               @click="
                  () => {
                      validateprivilages(['Organization', 'editor']).then(() => {
                        memberselected = item;
                        dialogeditemember = true;
                      });
                  }
                "
              >

              <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>

              <v-list-item
                @click="
                  () => {
                    memberselectedvalue = item;
                    opendialogdetailuser = true;
                  }
                "
              >
                <v-list-item-title>Detail</v-list-item-title>
              </v-list-item>
              <v-list-item
                style="min-height: 1px; margin-left: -16px; margin-right: -16px"
              >
                <v-divider style="min-width: 160px" />
              </v-list-item>
              <v-list-item
                v-if="!read_only"
                :disabled="item.is_creator === true && userrole !== 'Superadmin' && item.user_project.length > 0 ? true : false "
                @click="
                () => {
                    validateprivilages(['Organization', 'editor']).then(() => {
                      memberselected = item;
                      if (item.is_creator && projectsCount > 0) {
                        dialogdeletecreator = true;
                      } else {
                        dialogdeletemember = true;
                      }
                    });
                
                }
              "
              >
                <v-list-item-title class="error--text"
                  >Delete</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </popupquote>

        </template>

        <template v-slot:footer="{ props }">
          <custom-footer-datatable
            @input="
              (val) => {
                options = { ...options, ...val };
              }
            "
            :hidden="true"
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text>
    <dialogAddMember
      v-if="organization"
      :organization="organization"
      v-model="dialogaddmember"
      @added="
        ($event) => {
          fetchmembers(options).then(() => {
            opendialoghasbeensaved = true;
          });
        }
      "
    />

    <dialogDeleteMember
      v-model="dialogdeletemember"
      @confirm="
        () => {
          deletememberselected().then((response) => {
            dialogdeletemember = false;
            setmessagecommonsuccess('Your data has been removed.');
            setopendialogcommonsuccess(true);
            fetchmembers(options);
          }).catch((e) => {
            dialogdeletemember = false;
            setmessagecommonwarning(e.response.data.data);
            setopendialogcommonwarning(true);
        });
        }
      "
    />
    <dialogSuccess
      v-model="opendialogsuccess" :message="dialogemsgsuccess" :title="dialogetitlesuccess"
    />

    <dialogDeleteCreator
      v-model="dialogdeletecreator"
      @confirm="
        () => {
          deletememberselected().then(() => {
            dialogdeletemember = false;
          });
        }
      "
    />
    <dialogSuccess
      v-model="opendialogsuccess" :message="dialogemsgsuccess" :title="dialogetitlesuccess"
    />

    <dialogRecendInviteUser
      v-model="opendialogresendinviteuser"
      @confirm="
        () => {
          resendinvitememberselected().then(() => {
            opendialogsuccess=true;
            dialogemsgsuccess='Email has been sent, Please wait if mail has not appeared';
            dialogetitlesuccess='Email has been sent!';
            fetchmembers(options);
          });
        }
      "
    />

    <dialogTransferRoleUser
      v-if="memberselectedvalue && opendialogtransferuser"
      :memberselectedvalue="memberselectedvalue"
      v-model="opendialogtransferuser"
      @transfer="
        () => {
            setmessagecommonsuccess('Success Transfer Role Creator.');
            setopendialogcommonsuccess(true);
            fetchmembers(options);
        }
      "
    />

    <dialogEditMember
      v-if="memberselected && dialogeditemember"
      v-model="dialogeditemember"
      :memberselectedvalue="memberselected"
      @updated="
        (val) => {
          fetchmembers(options);
        }
      "
    />
    <dialogDetailUser
      v-if="opendialogdetailuser && memberselectedvalue"
      :user="memberselectedvalue"
      v-model="opendialogdetailuser"
    />
    <dialogListProject
      v-model="opendialoglistproject"
      v-if="opendialoglistproject && memberselectedvalue"
      :user="memberselectedvalue"
    />
    <dialogHasBeenSaved v-model="opendialoghasbeensaved" />
    <dialogActivateUser
      userorganization="user"
      v-if="memberselectedvalue"
      :onoff="memberselectedvalue.status === 'active' ? 'off' : 'on'"
      v-model="opendialogactivateuser"
      @confirm="confirmToggleUser"
    />

    <dialogRestoreRole
      v-if="organization"
      :organization="detailOrg"
      v-model="dialogRestoreRole"
    />

    <dialogNpwpKtp
      v-if="memberselectedvalue && opendialognpwpktp"
      :memberselectedvalue="memberselectedvalue"
      v-model="opendialognpwpktp"
      @confirm="onConfirm()"
      @reject="onReject($event)"
    />

    <v-dialog v-if="dialogrestore" v-model="dialogrestore" max-width="500">
      <v-card>
        <v-card-title class="headline font-weight-bold font--text">
          <v-icon left>$vuetify.ison.successCircleIcon</v-icon> Role has been
          Restored!
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="mb-0">Role data has been restored</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col>
              <v-btn
                height="50"
                depressed
                color="secondary"
                block
                @click="
                  () => {
                    dialogrestore = false;
                  }
                "
              >
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script lang="ts">
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedMutations,
} from "vuex-composition-helpers";

import dialogSuccess from "@/modules/costumedialog/dialogSuccess.vue";
import dialogEditMember from "./dialogEditMember.vue";
import dialogDeleteMember from "./dialogDeleteMember.vue";
import dialogDeleteCreator from "./dialogDeleteCreator.vue";
import dialogAddMember from "./dialogAddMember.vue";
import dialogRestoreRole from "./dialogRestoreRole.vue"
import { useMember } from "./usemember";
import dialogDetailUser from "../superadmin-manageuser/dialogDetailUser.vue";
import dialogListProject from "./dialogListProject.vue";
import { onMounted, reactive, defineComponent, ref, watch, onUnmounted } from "@vue/composition-api";
import dialogHasBeenSaved from "./dialogHaveBeenSubmitted.vue";
import dialogActivateUser from "../superadmin-manageuser/dialogActivateUser.vue";
import { ROLEPERMISSION } from "./namespace";
import { SUPERADMINMANAGEUSER } from "@/modules/superadmin-manageuser/namespace";
import dialogRecendInviteUser from "../superadmin-manageuser/dialogResendInviteUser.vue";
import dialogTransferRoleUser from "../superadmin-manageuser/dialogTransferRoleUser.vue";
import localstorage from "@/lib/localstorage";
import api from "@/lib/api";
import { AccessControl } from "@/lib/middleware";
import { PROJECT } from "../project/namespace";
import { fetchorgbyid} from '../superadmin-manageorganization/fetchorgbyid'
import { SUPERADMIN } from "../superadmin/namespace";
import dialogNpwpKtp from "../superadmin-manageuser/dialogNpwpKtp.vue";

export default defineComponent({
  components: {
    dialogAddMember,
    dialogDeleteMember,
    dialogDeleteCreator,
    dialogEditMember,
    dialogDetailUser,
    dialogListProject,
    dialogHasBeenSaved,
    dialogActivateUser,
    dialogRecendInviteUser,
    dialogTransferRoleUser,
    dialogSuccess,
    dialogRestoreRole,
    dialogNpwpKtp
  },
  props: ["title", "organization", "fontsize"],
  setup(props, context) {

    const { projectsCount } = useNamespacedState(PROJECT, ["projectsCount"]);
    const { getProjectsCountInOrganization } = useNamespacedActions(
      PROJECT,
      ["getProjectsCountInOrganization"]
    );
    const { verifynpwpktp, rejectnpwpktp } = useNamespacedActions(SUPERADMINMANAGEUSER, ["verifynpwpktp", "rejectnpwpktp"])
    const detailOrg = ref()
    detailOrg.value = props.organization;

    const op = { id: props.organization.id };

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Organization'));
    const { userrole } = useNamespacedState("ROLEPERMISSION", ["userrole"]);
    const Composable = useMember();
    const { fetchmembers, pagination } = Composable;
    const loading = ref(false);
    const limit = ref(5);
    const options = ref({ itemsPerPage: 10, sortBy: [], sortDesc: [] });
    const dialogrestore = ref(false);

    watch(options, async (val) => {
      loading.value = true;
      try {
        await fetchmembers(val);
      } finally {
        loading.value = false;
      }
    });

    const memberselectedvalue = ref();
    const opendialogdetailuser = ref(false);
    const opendialoglistproject = ref(false);
    const opendialoghasbeensaved = ref(false);
    const opendialogtransferuser= ref(false);
    const opendialogresendinviteuser= ref(false);
    const opendialogsuccess = ref(false)

    const is_creator = localstorage.getItem("is_creator");

    const { validateprivilages, validateprivilagesync } = useNamespacedActions(
      "HOMEPAGE",
      ["validateprivilages", "validateprivilagesync"]
    );
    const opendialogactivateuser = ref(false);
    const userStore = useNamespacedActions(ROLEPERMISSION, [
      "changestatus",
    ]);
    const adminStore = useNamespacedActions(SUPERADMINMANAGEUSER, [
      "changestatus",
    ]);
    const { setopendialogcommonsuccess, setmessagecommonsuccess,setopendialogcommonwarning,setmessagecommonwarning} =
      useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
        "setmessagecommonsuccess",
        "setopendialogcommonwarning",
        "setmessagecommonwarning",
      ]);
    const { setCurrentOrg } = useNamespacedMutations(SUPERADMIN, [
      "setCurrentOrg"
    ]);
    const changestatus = (payload) => {
      const userrole = localstorage.getItem('role')
      if (userrole === 'Superadmin' || userrole === 'Customer-Care' || userrole === 'GodMode') {
        return adminStore.changestatus(payload)
      } else {
        return userStore.changestatus(payload)
      }
    }

    const confirmToggleUser = async () => {
      const userrole = localstorage.getItem('role')
      if (userrole === 'Superadmin' || userrole === 'Customer-Care' || userrole === 'GodMode') {
        const res = await adminStore.changestatus(memberselectedvalue.value)
        if (res.status < 300) {
          memberselectedvalue.value.status = memberselectedvalue.value.status == 'active' ? 'deactive' : 'active';
        }
      } else {
        const res = await userStore.changestatus(memberselectedvalue.value)
        if (res.status < 300) {
          memberselectedvalue.value.status = memberselectedvalue.value.status == 'active' ? 'deactive' : 'active';
        }
      }
      opendialogactivateuser.value = false;
    }

    const onConfirm = async() => {
       const res = await verifynpwpktp(memberselectedvalue.value)
      if(res.status == 200) {
        fetchmembers(options.value);
      }
      setopendialogcommonsuccess(true);
    }

    const onReject = async (event: any) => {
      const res = await rejectnpwpktp({ ...memberselectedvalue.value, reason: event});
      if(res.status == 200) {
        fetchmembers(options.value);
      }
      setopendialogcommonsuccess(true);
    }

    onMounted(() => {
      getProjectsCountInOrganization()
    })

    return {
      read_only,

      opendialogsuccess,
      dialogetitlesuccess:ref(""),
      dialogemsgsuccess:ref(""),
      setmessagecommonsuccess,
      setopendialogcommonsuccess,
      setopendialogcommonwarning,
      setmessagecommonwarning,
      confirmToggleUser,
      opendialogresendinviteuser,
      opendialogtransferuser,
      opendialogactivateuser,
      validateprivilages,
      validateprivilagesync,
      opendialoghasbeensaved,
      opendialoglistproject,
      opendialogdetailuser,
      memberselectedvalue,
      log(e: any) {
      },
      loading,
      limit,
      is_creator,
      options,
      userrole,
      ...Composable,
       show: ($event: any, item: any) => {
        memberselectedvalue.value = item;
      },
      dialogaddmember: ref(false),
      dialogdeletemember: ref(false),
      dialogdeletecreator: ref(false),
      dialogeditemember: ref(false),
      projectsCount,
      dialogRestoreRole: ref(false),
      detailOrg,
      dialogrestore,
      setCurrentOrg,
      opendialognpwpktp: ref(false),
      verifynpwpktp,
      rejectnpwpktp,
      onConfirm,
      onReject,
      
    };
  },
  data() {
    return {
      dialogedit: false,
      dialog: false,
      headers: [
        {
          text: "Name",
          value: "fullname",
          sortable: true,
        },
        {
          text: "Project",
          value: "project",
          sortable: true,
        },
        {
          text: "Role",
          value: "role_name",
          align: "center",
          sortable: false,
          width: "8%",
        },
        {
        text: "Verification",
        value: "is_identity_verified",
        sortable: false,
        width: "8%",
        },
        {
        text: "Email Verification",
        value: "verified_at",
        sortable: false,
        width: "13%",
        },
        {
          text: "Status",
          value: "status",
          sortable: true,
          width: "9%",
        },
        {
          text: "Created Date",
          value: "created_at",
          sortable: true,
          width: "12%",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          sortable: false,
          width: "8%",
        },
      ],
      personalStatus: false,
    };
  },
  computed: {
    isPersonal() {
      return localstorage.getItem('type') === 'P'
    }
  },
  methods: {
    async getPersonalStatus() {
      this.loading = true;

      try {
        const res = await api.GET("/user/personal-status");
        this.personalStatus = res.data.personal_active;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getPersonalStatus()
    this.$root.$on('load_new_list_permission', async () => {
      await this.fetchmembers(this.options)
      await fetchorgbyid(this.detailOrg.id)
        .then((response) => {
            const org = response?.data.data;
            this.setCurrentOrg(org);
            this.detailOrg.IsRoleRestored = org.IsRoleRestored
          })
          .catch(() => {});
      this.dialogrestore = true;
    })
    this.$root.$on('emit_after_delete_manager_role', async () => {
      await fetchorgbyid(this.detailOrg.id)
        .then((response) => {
            const org = response?.data.data;
            this.setCurrentOrg(org);
            this.detailOrg.IsRoleRestored = org.IsRoleRestored
          })
          .catch(() => {});
    })
  }
});
</script>
<style lang="scss" scoped>
.disable {
  opacity: 0.6;
  user-select: none;
}
.footerheader {
  font-size: 12px;
  p {
    margin: 0;
  }
}
.animate {
  .v-data-table {
    visibility: hidden;
  }
}
.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }
  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
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

.npwp-verified {
  cursor: pointer;
  color: #1f60a8;
}

.npwp-notverified {
  cursor: pointer;
  color: #eb5757;
}

.npwp-waiting-confirmation {
  cursor: pointer;
  color: #a5b3bf;
}
</style>
