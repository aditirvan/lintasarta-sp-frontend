<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card flat class="pa-0 rounded-lg">
          <v-col class="pa-7 d-flex flex-row align-start">
           <div style="height:100%" class="d-flex align-center">
            <v-flex
                v-if="currentOrg.is_white_label && currentOrg.logo_name"
                >
                <v-row>
                  <v-col>
                    <v-avatar
                      style="margin-left: 25px; margin-right:25px;" color="#F1F2F2"
                      >
                      <v-img
                        alt="Logo"
                        contain
                        :src="currentOrg.logo_name"
                      />
                    </v-avatar>
                  </v-col>
                </v-row>                
              </v-flex>
              <v-icon v-else class="mr-4" style="font-size: 55px" color="#F1F2F2">mdi-circle</v-icon>
            </div>
            <div>
              <div
                class="headline font-weight-bold font--text"
                style="text-transform: uppercase"
              >
                {{ currentOrg.name }}
              </div>
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
                <svg
                  v-if="currentOrg.OrgType == 3"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                    stroke="#2C94D2"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 6V9"
                    stroke="#2C94D2"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 12H9.00833"
                    stroke="#2C94D2"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <div class="fz-14 ml-2 accent--text">
                  <p
                    v-if="service_type && service_type !== 'undefined'"
                    :style="{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      color:
                        service_type === 'postpaid' ? '#27AE60' : '#A5B3BF',
                    }"
                  >
                    <img
                      :src="
                        service_type === 'postpaid'
                          ? '/postpaid.png'
                          : '/prepaid.png'
                      "
                      alt="postpaid-logo"
                      :style="{ marginRight: '4px' }"
                    />
                    {{ uppercaseFirstLetter(service_type) }}
                  </p>

                  <template v-else>
                    {{
                      [
                        "Basic",
                        "Premium",
                        "",
                        "Upgrade Request to premium is in progress",
                      ][currentOrg.OrgType]
                    }}
                  </template>
                </div>
              </div>
               <div class="mt-2">
                  <p class="fz-14">{{ currentOrg.details }}</p>
                  <p class="fz-14">
                    <b>Sales:</b> {{ currentOrg.sales && currentOrg.sales.fullname ? currentOrg.sales.fullname : '-' }}
                  </p>
                  <p class="fz-14" v-show="currentOrg.is_white_label">
                    <b>White Label Organization</b>
                  </p>
               </div>
            </div>
            <v-spacer></v-spacer>
            <!-- <v-btn
              v-if="currentOrg.OrgType == 0"
              depressed
              height="50"
              width="150"
              @click="
                () => {
                  validateprivilages(['Organization', 'editor']).then(() => {
                    opendialogupgradepremium = true;
                  });
                }
              "
              style="border: 1px solid #2c94d2; background-color: white"
              class="secondary--text"
              >Upgrade</v-btn
            > -->
            <div style="height: auto; width: 20px" />
            <v-btn
              depressed
              height="50"
              width="150"
              @click="
                () => {
                  validateprivilages(['Organization', 'editor']).then(() => {
                    dialogedit = true;
                  });
                }
              "
              class="secondary"
              >Edit Organization</v-btn
            >
          </v-col>
          <v-divider />
          <v-card-text class="footerheader px-7">
            <v-row>
              <!-- <v-col md="2"
                ><p class="mb-2">
                  <b>Address:</b>
                </p>
                {{ currentOrg.address }}
              </v-col> -->
              
              <!-- <v-col
                ><p class="mb-2">
                  <b>NPWP Number:</b>
                </p>
                {{ currentOrg.npwp_corporate }}
              </v-col> -->

              <!-- <v-col md="2"
                ><p class="mb-2"><b>Phone:</b></p>
                {{ currentOrg.phone_number_org }}
              </v-col> -->

              <v-col md="2">
                <p class="mb-2"><b>Type:</b></p>
                {{ currentOrg.is_personal ? 'SME' : 'Enterprise' }}
              </v-col>

              <v-col md="2">
                <p class="mb-2"><b>Created Date:</b></p>
                {{ $FormatDate(currentOrg.created_at) }}
              </v-col>

              <v-col md="2">
                <p class="mb-2"><b>Status:</b></p>
                <v-chip v-if="currentOrg.status === 1" class="mr-2 my-1" small color="green" outlined>
                  <b> {{ organizationStatus(currentOrg.status) }} </b>
                </v-chip>
                <v-chip v-else class="mr-2 my-1" small color="red" outlined>
                  <b> {{ organizationStatus(currentOrg.status) }} </b>
                </v-chip>
              </v-col>

              <v-col md="2">
                <p class="mb-2">
                  <b>Suspend Type:</b><br />
                </p>
                <v-badge v-if="currentOrg.suspend_type" :content="currentOrg.suspend_type" color="error" class="ml-1"/>
                <span v-else>-</span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col md="2">
                <p class="mb-2"><b>Primary or Business Address:</b></p>
                {{ currentOrg.address }}
              </v-col>
              <v-col md="2"
                ><p class="mb-2"><b>Phone:</b></p>
                {{ currentOrg.phone_number_org }}
              </v-col>
              <v-col md="2">
                <p class="mb-2"><b>Country:</b></p>
                {{ currentOrg.country }}
              </v-col>
              <v-col md="2">
                <p class="mb-2"><b>City:</b></p>
                {{ currentOrg.city }}
              </v-col>
              <v-col md="2">
                <p class="mb-2"><b>Region:</b></p>
                {{ currentOrg.region }}
              </v-col>
              <v-col md="2">
                <p class="mb-2"><b>Zip/Post:</b></p>
                {{ currentOrg.zip }}
              </v-col>
            </v-row>
            <!-- <v-divider></v-divider>
            <v-row>
              <v-col md="2">
                <p class="mb-2"><b>Sales:</b></p>
                {{ currentOrg.sales.fullname }}
              </v-col>
              <v-col md="2">
                <p class="mb-2"><b>Phone Number:</b></p>
                {{ currentOrg.sales.phone_number }}
              </v-col>
            </v-row> -->
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <memberlistcard
          title="Members"
          :organization="currentOrg"
          :fontsize="12"
        />
      </v-col>
    </v-row>
    <dialogeditorganization
      v-if="currentOrg && dialogedit"
      :organization="currentOrg"
      v-model="dialogedit"
      @close="
        (val) => {
          dialogedit = val;
        }
      "
      @updated="
        () => {
          fetchorganizationByUser().then((data) => {
            setCurrentOrg(data);
          });
        }
      "
    />
    <dialogUpgradePremium
      @success="
        () => {
          opendialogupgradepremium = false;
          fetchorganizationByUser().then((data) => {
            setCurrentOrg(data);
          });
          opendialogupgradepremiumsuccess = true;
        }
      "
      v-model="opendialogupgradepremium"
    />
    <dialogUpgradePermiumSucces v-model="opendialogupgradepremiumsuccess" />
  </div>
</template>
<script lang="ts">
import dialogeditorganization from "./editorganization.dialog.vue";
import memberlistcard from "./memberlist.card.vue";
import { useMember } from "./usemember";
import { defineComponent, reactive, ref, Ref } from "@vue/composition-api";
import dialogUpgradePremium from "./dialogUpgradePemium.vue";
import dialogUpgradePermiumSucces from "./dialogUpgradePremiumSuccess.vue";
import { useNamespacedActions } from "vuex-composition-helpers";
import { ORGANIZATION } from "./namespace";
import { organizationStatus } from "@/lib/formatter";

export default defineComponent({
  components: {
    dialogeditorganization,
    memberlistcard,
    dialogUpgradePremium,
    dialogUpgradePermiumSucces,
  },
  setup() {
    let currentOrg: Ref = ref({});
    const setCurrentOrg = (payload: any) => {
      currentOrg.value = payload;
    };
    const { fetchorganizationByUser } = useNamespacedActions(ORGANIZATION, [
      "fetchorganizationByUser",
    ]);
    const { validateprivilages, validateprivilagesync } = useNamespacedActions(
      "HOMEPAGE",
      ["validateprivilages", "validateprivilagesync"]
    );
    return {
      validateprivilages,
      validateprivilagesync,
      fetchorganizationByUser,
      setCurrentOrg,
      ...useMember(),
      dialogaddmember: ref(""),
      dialogdeletemember: ref(false),
      dialogeditemember: ref(false),
      currentOrg,
      opendialogupgradepremium: ref(false),
      opendialogupgradepremiumsuccess: ref(false),
      organizationStatus,
    };
  },
  data() {
    return {
      dialogedit: false,
      dialog: false,
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Project",
          value: "project",
        },
        {
          text: "Role",
          value: "role",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Action",
          value: "action",
          width: "150px",
        },
      ],
    };
  },
  computed: {
    service_type() {
      return localStorage.getItem("service_type");
    },
  },
  methods: {
    uppercaseFirstLetter(string: String) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  created() {
    this.fetchorganizationByUser()
      .then((data: any) => {
        this.setCurrentOrg(data);
      })
      .catch(() => {
        this.$router.replace("/notfound");
      });
    this.fetchmembers();
  },
});
</script>
<style lang="scss" scoped>
.footerheader {
  font-size: 12px;
  p {
    margin: 0;
  }
}
</style>
