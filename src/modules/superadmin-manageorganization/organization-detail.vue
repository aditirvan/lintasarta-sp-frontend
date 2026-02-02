<template>
  <div>
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7">
        <v-row>
          <v-col class="d-flex flex-row align-start">
            <div class="d-flex align-center">
              <v-flex v-if="currentOrg.is_white_label && user_role == 'Superadmin' && currentOrg.logo_name">
                <v-row>
                  <v-col>
                    <v-avatar style="margin-left: 25px; margin-right: 25px" color="#F1F2F2">
                      <v-img alt="Logo" contain :src="currentOrg.logo_name" />
                    </v-avatar>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      class="secondary mr-4"
                      @click="
                        () => {
                          openDialogChangeLogo = true;
                        }
                      "
                    >
                      <span style="font-size: 12px">Change Logo</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-flex>
              <v-icon v-else class="mr-4" style="font-size: 55px" color="#F1F2F2">mdi-circle</v-icon>
            </div>
            <div class="mr-8 pr-8">
              <div class="headline font-weight-bold">{{ currentOrg.name }}</div>

              <!-- postpaid / prepaid -->
              <p
                v-if="currentOrg.service_type && currentOrg.service_type !== 'undefined'"
                :style="{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: currentOrg.service_type === 'postpaid' ? '#27AE60' : '#A5B3BF',
                }"
              >
                <img :src="currentOrg.service_type === 'postpaid' ? '/postpaid.png' : '/prepaid.png'" alt="postpaid-logo" :style="{ marginRight: '4px' }" />
                {{ uppercaseFirstLetter(currentOrg.service_type) }}
              </p>

              <div class="mt-2 d-flex flex-row align-center">
                <v-icon v-if="currentOrg.OrgType == 0" style="width: 18px; height: 18px">$vuetify.icons.diamondIcon </v-icon>
                <v-icon v-if="currentOrg.OrgType == 1" style="width: 18px; height: 18px">$vuetify.icons.golddiamondIcon </v-icon>
                <div class="fz-14 ml-2 accent--text">
                  {{ ["Basic", "Premium"][currentOrg.OrgType] }}
                </div>
              </div>
              <div class="mt-2">
                <p class="fz-14">{{ currentOrg.details }}</p>

                <p class="fz-14" v-show="currentOrg.is_white_label && user_role == 'Superadmin'">
                  <b>White Label Organization</b>
                </p>
              </div>
            </div>
            <v-spacer />
            <popupquote v-if="!currentOrg.dekaprime_organization_id && !currentOrg.is_personal" v-model="openRotate" :offsetTop="21" offset-y allow-overflow>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-if="!read_only"
                  :loading="isLoading"
                  :disabled="isLoading"
                  class="secondary mr-2"
                  height="50"
                  width="150"
                  depressed
                  @click="
                    ($event) => {
                      on.click($event);
                      openRotate = true;
                    }
                  "
                >
                  <span style="font-size: 12px">Link to Dekaprime</span>
                  <v-icon
                    :class="{
                      rotate: openRotate,
                    }"
                    color="white"
                    >mdi-chevron-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  @click="
                    () => {
                      createNewDP();
                    }
                  "
                >
                  <span class="font--text" style="font-weight: 600"> Create New </span>
                </v-list-item>
                <v-list-item
                  @click="
                    () => {
                      $router.push('/import');
                    }
                  "
                >
                  <span class="font--text" style="font-weight: 600"> Link to Existing </span>
                </v-list-item>
              </v-list>
            </popupquote>

            <v-btn
              v-if="!read_only"
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
      <v-card class="bs pa-5">
        <v-tabs v-model="tabDetail">
          <v-tab class="fz-14 firewall-title">Detail</v-tab>
          <v-tab class="fz-14 firewall-title">Activity</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabDetail">
          <v-tab-item>
            <v-card flat class="pt-4">
              <infoDetail :currentOrg="currentOrg"></infoDetail>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="pt-4">
              <activityOrganization :organization="currentOrg" v-if="tabDetail == '1'"></activityOrganization>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>

    <v-card class="rounded-lg mt-8 mb-8" flat outlined>
      <v-card class="bs pa-5">
        <template>
          <v-tabs v-model="tab" class="mb-0 mt-2">
            <v-tab class="fz-14 firewall-title">User Organization</v-tab>
            <v-tab class="fz-14 firewall-title">Activity</v-tab>
            <v-tab class="fz-14 firewall-title" v-if="currentOrg.dekaprime_organization_id">User Dekaprime</v-tab>
          </v-tabs>
        </template>
        <v-row class="pb-0"> </v-row>
        <v-tabs-items v-model="tab" class="mb-2">
          <v-tab-item>
            <v-card flat>
              <memberlistcard v-if="orgDetail" title="Member List" :organization="currentOrg" :fontsize="12" />
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="pt-4">
              <activityUser :organization="currentOrg" v-if="tab == 1"></activityUser>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <userDP v-if="currentOrg.dekaprime_organization_id" />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>

    <v-card class="rounded-lg mt-8 mb-8" flat outlined>
      <v-card class="bs pa-5">
        <template>
          <v-tabs v-model="tabRole" class="mb-0 mt-2">
            <v-tab class="fz-14 firewall-title">Manage Role</v-tab>
            <v-tab class="fz-14 firewall-title">Activity</v-tab>
          </v-tabs>
        </template>
        <v-row class="pb-0"> </v-row>
        <v-tabs-items v-model="tabRole" class="mb-2">
          <v-tab-item>
            <v-card flat>
              <superadminmanagepermission v-if="orgDetail" title="Permission" :organization="currentOrg" />
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="pt-4">
              <activityRole :organization="currentOrg" v-if="tabRole == '1'"></activityRole>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>

    <!-- <div style="height: 30px; width: auto" />
    <superadminmanagepermission v-if="orgDetail" title="Permission" :organization="currentOrg" />
    <div style="height: 30px; width: auto" /> -->

    <v-card flat class="pa-0 rounded-lg">
      <ApprovalNotification />

      <v-card-text class="pa-7 d-flex flex-row align-center pt-0 pb-0">
        <div class="headline font-weight-bold">Project</div>
        <v-spacer />

        <v-btn v-if="currentOrg.dekaprime_organization_id" class="secondary mr-2" height="50" width="150" depressed :to="$route.path + '/create-vdc'">
          <span style="font-size: 12px">Create VDC</span>
        </v-btn>

        <v-btn v-if="isDevModePostpaid && !read_only" class="secondary" height="50" width="150" depressed :to="$route.path + '/project/add'">
          <span style="font-size: 12px">New Project</span>
        </v-btn>

        <v-btn
          v-else-if="!read_only"
          class="secondary"
          height="50"
          width="150"
          depressed
          @click="
            () => {
              validatelimitcreateproject().then(() => {
                if (isDevModePostpaid) {
                  toAddProject();
                } else {
                  opendialogaddproj = true;
                }
              });
            }
          "
        >
          <span style="font-size: 12px">New Project</span>
        </v-btn>
        <div v-if="!isDevModePostpaid" style="width: 30px; height: auto" />
        <v-btn v-if="!isDevModePostpaid" class="secondary--text" style="border: 2px solid #2c94d2; background-color: white" height="50" width="150" depressed>
          <span style="font-size: 12px">Download</span>
        </v-btn>
      </v-card-text>

      <v-card class="bs pa-5">
        <v-tabs v-model="tabProject">
          <v-tab class="fz-14 firewall-title">List</v-tab>
          <v-tab class="fz-14 firewall-title">Activity</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabProject">
          <v-tab-item>
            <v-card flat class="pt-4">
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-data-table
                      hide-default-footer
                      :headers="headers1"
                      :server-items-length="projectspagination.count"
                      :options.sync="options"
                      :items-per-page="10"
                      :items="projects"
                      show-select
                    >
                      <template v-slot:item.projectname="{ item }">
                        <div
                          class="linkpointer"
                          @click="
                            () => {
                              setCurrentProj(item);
                              openProject(item);
                            }
                          "
                        >
                          {{ item.name }}
                        </div>
                      </template>
                      <template v-slot:item.region="{ item }">
                        {{ item.region ? item.region : "-" }}
                      </template>
                      <template v-slot:item.payment_method="{ item }">
                        <div>
                          {{ item.payment_method === "postpaid" ? formatPostpaidType(item.postpaid_type) : uppercaseFirstLetter(item.payment_method) }}
                          <span v-if="item.postpaid_fixed_type">- {{ item.postpaid_fixed_type === "prorate" ? "Prorate" : "Full Cycle" }}</span>
                        </div>
                      </template>
                      <template v-slot:item.status="{ item }">
                        <!-- {{ projectStatus(item.status) }} -->

                        <span v-if="item.status === 1">
                          <v-chip class="mr-2 my-1" small color="green" outlined>
                            <b> {{ projectStatus(item.status) }} </b>
                          </v-chip>
                        </span>
                        <span v-else>
                          <v-chip class="mr-2 my-1" small color="red" outlined>
                            <b> {{ projectStatus(item.status) }} </b>
                          </v-chip>
                        </span>

                      </template>
                      <template v-slot:item.service_activation_date="{ item }">
                        <v-row>
                          <v-col>
                            <span v-if="item.service_activation_date">
                              <v-chip class="mr-2 my-1" small :color="getDate(item.service_activation_date) == 'Active' ? 'green' : 'red'" outlined>
                                <b> {{ getDate(item.service_activation_date) }} </b>
                              </v-chip>
                            </span>
                            <span v-else>
                              <v-chip class="mr-2 my-1" small color="red" outlined>
                                <b> Pending </b>
                              </v-chip>
                            </span>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-slot:item.type="{ item }">
                        <v-row>
                          <v-col cols="12">
                            <v-chip outlined class="mr-2 my-1" color="primary" small v-if="item.openstack_project_id">
                              <strong>Dekaflexi</strong>
                            </v-chip>
                            <v-chip outlined class="mr-2 my-1" color="primary" small v-if="item.dekaprime_project_id">
                              <strong>Dekaprime</strong>
                            </v-chip>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-slot:item.created_at="{ item }">
                        {{ $FormatDate(item.created_at) }}
                      </template>

                      <!-- more dropdown menu -->
                      <template v-slot:item.action="{ item }">
                        <v-menu v-if="isDevModePostpaid" offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn class="primary--text" color="white" dark v-bind="attrs" v-on="on" elevation="0">
                              More
                              <v-icon color="primary"> mdi-chevron-down </v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-dekarock-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Dekarock Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="item.payment_method == 'postpaid' && !read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-dbaas-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Dbaas Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-router-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Router Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-dns-limit');
                                  }
                                ">
                                <v-list-item-title>
                                  <span class="font-weight-bold">
                                    Custom DNS Limit
                                  </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-vpn-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom VPN Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div
                              v-if="
                                (item.payment_method == 'postpaid' && item.postpaid_type == 'fixed' && !read_only && item.openstack_project_id) ||
                                (item.payment_method == 'postpaid' && item.postpaid_type == 'usage' && item.openstack_project_id) ||
                                (item.payment_method == 'prepaid' && item.openstack_project_id)
                              "
                            >
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-deka-flexi');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Deka Flexi </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && user_role == 'Superadmin'">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-registry-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Registry Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-cdn-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom CDN Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-i3gis-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Deka AST Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-slb-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Server Load Balancer Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                              <v-divider />
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-glb-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Global Load Balancer Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-harbor-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom Deka Harbor Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-object-storage-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold" elevation="0"> Custom Deka Box Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-ssl-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom SSL Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only && item.openstack_project_id">
                              <v-list-item
                              @click="
                                () => {
                                  setCurrentProj(item);
                                  $router.push($route.path + '/custom-deka-monitoring-limit');
                                }
                              ">
                                <v-list-item-title>
                                  <span class="font-weight-bold">
                                    Custom Deka Agent Premium Limit
                                  </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <div v-if="!read_only">
                              <v-list-item
                                @click="
                                  () => {
                                    setCurrentProj(item);
                                    $router.push($route.path + '/custom-nfs-limit');
                                  }
                                "
                              >
                                <v-list-item-title>
                                  <span class="font-weight-bold"> Custom NFS Limit </span>
                                </v-list-item-title>
                              </v-list-item>
                            </div>
                            <v-divider />
                            <!-- $router.push(
                            $route.path + '/project/' + item.id + '/detail'
                          ); -->
                            <v-list-item
                              @click="
                                () => {
                                  setCurrentProj(item);
                                  dialogDetail = true;
                                  dataDetail = item;
                                }
                              "
                            >
                              <span color="white" class="primary--text cursor-pointer font-weight-bold" elevation="0"> Detail </span>
                            </v-list-item>
                            <v-list-item
                              v-if="!read_only && item.openstack_project_id"
                              @click="
                                () => {
                                  setCurrentProj(item);
                                  $router.push($route.path + '/project/' + item.id + '/edit');
                                }
                              "
                            >
                              <span color="white" class="primary--text cursor-pointer font-weight-bold" elevation="0"> Edit </span>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item
                              v-if="!read_only"
                              @click="
                                () => {
                                  selectedProj = item;
                                  hapusProject();
                                }
                              "
                            >
                              <span color="white" class="error--text cursor-pointer font-weight-bold" elevation="0"> Delete </span>
                            </v-list-item>
                          </v-list>
                        </v-menu>

                        <span
                          v-else
                          @click="
                            () => {
                              selectedProj = item;
                              hapusProject();
                              //opendeleteproject = true;
                            }
                          "
                          class="error--text"
                          style="cursor: pointer"
                          >Delete</span
                        >
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
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="pt-4">
              <activityProject :organization="currentOrg" v-if="tabProject == '1'"></activityProject>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>

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
    <dialogAddProj
      v-model="opendialogaddproj"
      @added="
        () => {
          fetchprojects(options);
        }
      "
    />

    <dialogDeleteProj
      v-if="opendeleteproject"
      :selectedproject="selectedProj"
      v-model="opendeleteproject"
      @close="
        () => {
          opendeleteproject = false;
        }
      "
      @deleteproject="
        () => {
          opendialogareyousure = true;
        }
      "
    />
    <dialogChangeLogo
      v-if="openDialogChangeLogo"
      v-model="openDialogChangeLogo"
      :organization="currentOrg"
      @update-image-logo="
        () => {
          getNewLogo(currentOrg);
        }
      "
    />

    <dialogAreYouSure
      v-if="opendialogareyousure"
      :project="selectedProj"
      v-model="opendialogareyousure"
      @deleted="
        () => {
          fetchprojects(options);
        }
      "
      @error="
        (response) => {
          opendeleteproject = false;
          dialogerrormsg = response.data.data;
          opendialogerror = true;
        }
      "
    />

    <dialogErrorDelete v-model="opendialogerror" :message="dialogerrormsg" />
    <DialogDetail :dialog-detail.sync="dialogDetail" :data-detail="dataDetail" v-if="dialogDetail"></DialogDetail>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted, getCurrentInstance } from "@vue/composition-api";
import { useMember } from "../organization/usemember";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import dialogEditOrganization from "../organization/editorganization.dialog.vue";
import memberlistcard from "../organization/memberlist.card.vue";
import superadminmanagepermission from "../organization/superadmin-managepermission.vue";
import { SUPERADMINMANAGEORG } from "./namespace";
import dialogAddProj from "./dialogAddProj.vue";
import { PROJECT } from "../project/namespace";
import dialogAreYouSure from "../project/dialogAreYouSure.vue";
import dialogDeleteProj from "../project/dialogDeleteProj.vue";
import dialogErrorDelete from "../project/dialogErrorDelete.vue";
import { SUPERADMIN } from "../superadmin/namespace";
import ApprovalNotification from "./organization-detail/ApprovalNotification.vue";
import dialogChangeLogo from "../organization/changeLogo.dialog.vue";
import localstorage from "@/lib/localstorage";
import { AccessControl } from "@/lib/middleware";
import { VDC } from "../deka-prime/vdc/namespace";
import { fetchorgbyid } from "./fetchorgbyid";
import Vue from "vue";
import DialogDetail from "./projectdetailsnew.vue";
import moment from "moment";
import userDP from "../superadmin-dp-org/user/user.vue";
import infoDetail from "./info-detail.vue";
import activityOrganization from "./activity-organization.vue";
import activityUser from "./activity-user.vue";
import activityProject from "./activity-project.vue";
import activityRole from "./activity-role.vue";
import { projectStatus } from "@/lib/formatter";

const isDevModePostpaid = true;

export default defineComponent({
  components: {
    dialogEditOrganization,
    memberlistcard,
    superadminmanagepermission,
    dialogAreYouSure,
    dialogAddProj,
    dialogDeleteProj,
    dialogErrorDelete,
    ApprovalNotification,
    dialogChangeLogo,
    DialogDetail,
    userDP,
    infoDetail,
    activityOrganization,
    activityUser,
    activityProject,
    activityRole,
  },
  props: ["currentOrg"],
  setup(props: any, context) {
    const user_role = localstorage.getItem("role");
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Organization"));
    const { fetchprojects, fetchorganization } = useNamespacedActions(SUPERADMINMANAGEORG, ["fetchprojects", "fetchorganization"]);
    const options = ref({});
    const orgDetail = ref();
    watch(
      options,
      (val) => {
        const op = { id: props.currentOrg.id, ...val };
        fetchprojects(op);
      },
      { deep: true }
    );
    onMounted(() => {
      fetchprojects({ id: props.currentOrg.id, itemsPerPage: 10 });
      orgDetail.value = props.currentOrg;
      setCurrentProj(null);
      localStorage.removeItem("currentProj");
      localStorage.removeItem("vdcById");
      localStorage.removeItem("dekaPrime");
      // if(props.currentOrg.dekaprime_organization_id){
      //   console.log(props)
      //   organizationDPById({orgDpId: props.currentOrg.dekaprime_organization_id })
      // }
    });
    const { projects, projectspagination } = useNamespacedState(SUPERADMINMANAGEORG, ["projects", "projectspagination"]);
    const Composable = {
      ...useMember(),
    };
    const { fetchmembers } = Composable;
    const { changeorgstatus } = useNamespacedActions(SUPERADMINMANAGEORG, ["changeorgstatus"]);
    const switchstatus = async (item: any) => {
      return await changeorgstatus(item);
    };
    const opendialogaddproj = ref(false);
    const { validatelimitcreateproject, checkproject } = useNamespacedActions(PROJECT, ["validatelimitcreateproject", "checkproject"]);
    const dataDetail = ref({});
    const selectedProj = ref();
    const opendeleteproject = ref(false);
    const dialogDetail = ref(false);
    const dialogerrormsg = ref("");
    const opendialogareyousure = ref(false);
    const opendialogerror = ref(false);
    const { setCurrentProj, setCurrentOrg } = useNamespacedMutations(SUPERADMIN, ["setCurrentProj", "setCurrentOrg"]);
    const { loginDns, loginDbaas, logoutDbaas, loginSsl } = useNamespacedActions(SUPERADMIN, ["loginDns", "loginDbaas", "logoutDbaas", "loginSsl"]);
    const { loginDP } = useNamespacedActions(VDC, ["loginDP"]);
    const { getNewDP, organizationDPById } = useNamespacedActions("ORGANIZATIONDP", ["getNewDP", "organizationDPById"]);
    const { orgDPById } = useNamespacedGetters("ORGANIZATIONDP", ["orgDPById"]);

    const openProject = async (item: any) => {
      const paramsDns = {
        organization_id: item.organization_id,
        project_id: item.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
      };
      const paramsDbaas = {
        organizationId: item.organization_id,
        projectId: item.id,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
      };
      const paramsSsl = {
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
        project_id: item.id,
        organization_id: item.organization_id,
      };

      // logout sebelum login
      const storageDbaas = localstorage.getItem("loginDbaas");
      const data = JSON.parse(storageDbaas);
      if (data) {
        logoutDbaas({ uniqueID: data.uniqueID });
      }
      const paramsDP = {
        organizationId: item.organization_id,
        organizationName: item.name,
        userId: localStorage.getItem("userId")?.replaceAll('"', ""),
        username: localStorage.getItem("username"),
        projectId: item.id,
        dekaprimeProjectId: item.dekaprime_project_id,
      };

      let loginDpRes = await loginDP(paramsDP);

      loginDns(paramsDns);
      loginDbaas(paramsDbaas);
      loginSsl(paramsSsl);
      context.root.$router.push(context.root.$route.path + "/project/" + item.name);
    };

    const hapusProject = () => {
      const curr = selectedProj.value as any;
      const Value = {
        id: curr.id,
        name: curr.name,
      };

      checkproject(Value)
        .then((e: any) => {
          console.log(e);
          opendeleteproject.value = true;
        })
        .catch((e: any) => {
          const { data } = e.response.data;
          opendialogerror.value = true;
          dialogerrormsg.value = data;
          console.log(data);
        });
    };

    const getNewLogo = (currentOrg) => {
      fetchorgbyid(currentOrg.id)
        .then((response) => {
          const org = response?.data.data;

          setCurrentOrg(org);
        })
        .catch(() => {});
    };
    const getDate = (data: string) => {
      const date1 = moment(data).format("YYYY-MM-DD");
      const date2 = moment(new Date()).format("YYYY-MM-DD");
      if (date1 == date2) {
        return "Active";
      } else if (date1 < date2) {
        return "Active";
      } else if (date1 > date2) {
        return "Pending";
      }
    };
    // CREATE NEW DEKAPRIME
    const isLoading = ref(false);
    const createNewDP = async () => {
      isLoading.value = true;
      await getNewDP({ spOrgId: context.root.$route.params.organizationid });
      await fetchorgbyid(context.root.$route.params.organizationid)
        .then(async (response) => {
          const org = response?.data.data;
          // next((vm: any) => {
          // const currentProj = localstorage.getItem("currentProj");
          setCurrentOrg(org);
          isLoading.value = false;
          if (org.dekaprime_organization_id) {
            await organizationDPById({ orgDpId: org.dekaprime_organization_id });
            localStorage.setItem("orgDP", JSON.stringify(orgDPById.value));
          }
          // if (currentProj) setCurrentProj(JSON.parse(currentProj));
          // });
        })
        .catch(() => {
          isLoading.value = false;
          // next("/notfound");
        });
    };
    const { fetchUsers } = useNamespacedActions("ORGANIZATIONDP", ["fetchUsers"]);
    const tab = ref(0);
    const tabDetail = ref("");
    const tabProject = ref("");
    const tabRole = ref("");
    watch(tab, (newVal) => {
      if (newVal == 2) {
        let detailOrg = JSON.parse(localStorage.getItem("orgDP"));
        fetchUsers({
          page: 1,
          itemsPerPage: 10,
          idOrg: detailOrg.id,
        });
      }
    });

    return {
      read_only,
      user_role,
      hapusProject,
      setCurrentProj,
      dialogerrormsg,
      opendialogerror,
      opendeleteproject,
      selectedProj,
      opendialogareyousure,
      validatelimitcreateproject,
      opendialogaddproj,
      switchstatus,
      options,
      fetchprojects,
      projectspagination,
      projects,
      fetchorganization,
      ...Composable,
      loginDns,
      openProject,
      orgDetail,
      fetchorgbyid,
      getNewLogo,
      setCurrentOrg,
      dialogDetail,
      dataDetail,
      getDate,
      openRotate: ref(false),
      createNewDP,
      tab,
      isLoading,
      tabDetail,
      tabProject,
      tabRole,
      projectStatus,
    };
  },
  data() {
    return {
      isDevModePostpaid,
      openDoalogEditOrg: false,
      switch1: true,
      headers: [
        { text: "Name", value: "name", sortable: false },
        { text: "Project", value: "project", sortable: false },
        { text: "Role ", value: "role", sortable: false },
        { text: "Status ", value: "status", sortable: false },
        { text: "Action ", value: "action", align: "center", sortable: false },
      ],
      headers1: [
        { text: "Project Name ", value: "projectname", sortable: false },
        { text: "Region ", value: "region", sortable: false },
        { text: "Payment Method ", value: "payment_method", sortable: false },
        { text: "Type ", value: "type", sortable: false },
        { text: "Service Instance ", value: "network_number", sortable: false },
        { text: "Status", value: "status", sortable: false, width: "10%" },
        { text: "Created Date ", value: "created_at", sortable: false },
        { text: "Action ", value: "action", sortable: false, align: "center" },
      ],
      openDialogChangeLogo: false,
    };
  },
  methods: {
    uppercaseFirstLetter(string: String) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toAddProject() {
      this.$router.push(this.$route.path + "/project/add");
    },
    getImgUrl(pic) {
      return require("@/assets/" + pic);
    },
    formatPostpaidType(type: string) {
      return type === "fixed" ? "Postpaid Fixed" : "Postpaid Usage Based";
    },
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

.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}

.mdi-chevron-down::before {
  transition: 100ms linear all;
}

.bs {
  box-shadow: none !important;
}
</style>
