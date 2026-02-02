import { iVue } from "../type";
import manageorganization from "./manageorganization.vue";
import { GODMODEMANAGEORG, SUPERADMINMANAGEORG } from "./namespace";
import store from "./store";
import OrganizationDetail from "./organization-detail.vue";
import MainOrganizationDetail from "./main.organization-detail.vue";
import AddProject from "./addProject.vue";
import AddProjectMain from "./addproject.main.vue";
import ProjectDetailsNew from "./projectdetailsnew.vue";
import ProjectEdit from "./projectedit.vue";
import ProjectDetail from "./projectdetails.vue";
import ProjectDetailMain from "./projectdetail.main.vue";
import ProjectSettings from "../project/setting.vue";
import Page from "@/components/page.vue";
import customDekaFlexi from "./customDekaFlexi.vue";
import customDbaasLimit from "./customDbaasLimit.vue";
import customCDNLimit from "./customCDNLimit.vue";
import customDekaRockLimit from "./customDekaRockLimit.vue";
import customObjectStorageLimit from "./customObjectStorageLimit.vue";
import createrole from "../organization/createrole.vue";
import editrole from "../organization/editrole.vue";
import customQuotaLimit from "./customQuotaLimit.vue";
import customHarborLimit from './customHarborLimit.vue';
import customSlbLimit from './customSlbLimit.vue';
import customGlbLimit from './customGlbLimit.vue';
import customI3gisLimit from "./customI3gisLimit.vue";
import customRouterLimit from "./customRouterLimit.vue";
import customVpnLimit from "./customVpnLimit.vue";
import customDnsLimit from "./customDnsLimit.vue";
import customSSLLimit from "./customSSLLimit.vue";
import customNfsLimit from "./customNfsLimit.vue";
import createVdc from '../superadmin-dp-orgVdc/create-orgVdc.vue'
import detailUserDP from '../superadmin-dp-org/user/detail.vue'
import createEdgeDP from '../superadmin-dp-edgegateway/create-edge-gateway.vue' 
import detailEdge from '../superadmin-dp-edgegateway/detail.vue'
import customDekaAgentLimit from "./customDekaAgentLimit.vue";

export default {
  install(Vue: iVue) {
    Vue.addRoutetoDashboard({
      path: "/manage-organization",
      component: Page,
      meta: {
        breadcrumb: {
          text: "Manage Organization",
          to: "/manage-organization",
        },
      },
      children: [
        {
          path: "",
          component: manageorganization,
        },
        {
          path: "/organization-detail/:organizationid",

          component: MainOrganizationDetail,
          meta: {
            breadcrumb: {
              text: "Organization Detail",
              to: "/organization-detail/:organizationid",
            },
          },
          children: [
            {
              path: "",
              component: OrganizationDetail,
              name: "organization-detail-orgnizationid",
            },
            {
              path: "/organization-detail/:organizationid/custom-dekarock-limit",
              component: customDekaRockLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Dekarock Limit",
                  to: "/organization-detail/:organizationid/custom-dekarock-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customDekaRockLimit,
                  name: "custom-dbaas-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-dbaas-limit",
              component: customDbaasLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Dbaas Limit",
                  to: "/organization-detail/:organizationid/custom-dbaas-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customDbaasLimit,
                  name: "custom-dbaas-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-router-limit",
              component: customRouterLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Router Limit",
                  to: "/organization-detail/:organizationid/custom-router-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customRouterLimit,
                  name: "custom-router-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-vpn-limit",
              component: customVpnLimit,
              meta: {
                breadcrumb: {
                  text: "Custom VPN Limit",
                  to: "/organization-detail/:organizationid/custom-vpn-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customVpnLimit,
                  name: "custom-vpn-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-dns-limit",
              component: customDnsLimit,
              meta: {
                breadcrumb: {
                  text: "Custom DNS Limit",
                  to: "/organization-detail/:organizationid/custom-dns-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customDnsLimit,
                  name: "custom-dns-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/createrole",
              component: createrole,
              meta: {
                breadcrumb: {
                  text: "Create Role",
                  to: "/organization-detail/:organizationid/createrole",
                },
              },
              children: [
                {
                  path: "",
                  component: createrole,
                  name: "createrole",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/editrole",
              component: createrole,
              meta: {
                breadcrumb: {
                  text: "Edit Role",
                  to: "/organization-detail/:organizationid/editrole",
                },
              },
              children: [
                {
                  path: "",
                  component: createrole,
                  name: "superadmineditrole",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-deka-flexi",
              component: customDekaFlexi,
              meta: {
                breadcrumb: {
                  text: "Custom Deka Flexi",
                  to: "/organization-detail/:organizationid/custom-deka-flexi",
                },
              },
              children: [
                {
                  path: "",
                  component: customDekaFlexi,
                  name: "custom-deke-flexi",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-cdn-limit",
              component: customCDNLimit,
              meta: {
                breadcrumb: {
                  text: "Custom CDN Limit",
                  to: "/organization-detail/:organizationid/custom-cdn-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customCDNLimit,
                  name: "custom-cdn-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-ssl-limit",
              component: customSSLLimit,
              meta: {
                breadcrumb: {
                  text: "Custom ssl Limit",
                  to: "/organization-detail/:organizationid/custom-ssl-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customSSLLimit,
                  name: "custom-ssl-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-nfs-limit",
              component: customNfsLimit,
              meta: {
                breadcrumb: {
                  text: "Custom NFS Limit",
                  to: "/organization-detail/:organizationid/custom-nfs-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customNfsLimit,
                  name: "custom-nfs-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-registry-limit",
              component: customQuotaLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Registry Limit",
                  to: "/organization-detail/:organizationid/custom-registry-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customQuotaLimit,
                  name: "custom-quota-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-slb-limit",
              component: customSlbLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Server Load Balancer Limit",
                  to: "/organization-detail/:organizationid/custom-slb-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customSlbLimit,
                  name: "custom-slb-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-glb-limit",
              component: customGlbLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Global Load Balancer Limit",
                  to: "/organization-detail/:organizationid/custom-glb-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customGlbLimit,
                  name: "custom-glb-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-harbor-limit",
              component: customHarborLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Deka Harbor Limit",
                  to: "/organization-detail/:organizationid/custom-harbor-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customHarborLimit,
                  name: "custom-harbor-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-i3gis-limit",
              component: customI3gisLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Deka AST Limit",
                  to: "/organization-detail/:organizationid/custom-i3gis-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customI3gisLimit,
                  name: "custom-i3gis-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-object-storage-limit",
              component: customObjectStorageLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Deka Box Limit",
                  to: "/organization-detail/:organizationid/custom-object-storage-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customObjectStorageLimit,
                  name: "custom-object-storage-limit",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/create-vdc",
              component: createVdc,
              meta: {
                breadcrumb: {
                  text: "Create VDC",
                  to: "/organization-detail/:organizationid/create-vdc",
                },
              },
              children: [
                {
                  path: "",
                  component: createVdc,
                  name: "create-vdc",
                },
              ],
            },
            {
              path: "/organization-detail/:organizationid/detail-userdp",
              component: detailUserDP,
              meta: {
                breadcrumb: {
                  text: "User Dekaprime Detail",
                  to: "/organization-detail/:organizationid/detail-userdp",
                },
              },
              children: [
                {
                  path: "",
                  component: detailUserDP,
                  name: "detail-userdp",
                },
              ],
            },
            {
              path: "project/add",
              component: AddProjectMain,
              meta: {
                breadcrumb: {
                  text: "Add Project",
                  to: "/organization-detail/:organizationid/project/add",
                },
              },
              children: [
                {
                  path: "",
                  component: AddProject,
                  name: "organization-detail-orgnizationid-addproject",
                },
              ],
            },
            {
              path: "project/:project",
              component: ProjectDetailMain,
              meta: {
                breadcrumb: {
                  text: ":project",
                  to: "/organization-detail/:organizationid/project/:project",
                },
              },
              children: [
                {
                  path: "",
                  component: ProjectDetail,
                  name: "organization-detail-orgnizationid-projectname",
                },
                {
                  path: "detail",
                  component: ProjectDetailsNew,
                  name: "organization-detail-orgnizationid-projectname-detail",
                  meta: {
                    breadcrumb: {
                      text: "Detail",
                      to:
                        "/organization-detail/:organizationid/project/:project/detail",
                    },
                  },
                },
                {
                  path: "edit",
                  component: ProjectEdit,
                  name: "organization-detail-orgnizationid-projectname-edit",
                  meta: {
                    breadcrumb: {
                      text: "Edit",
                      to:
                        "/organization-detail/:organizationid/project/:project/edit",
                    },
                  },
                },
                {
                  path: "settings",
                  component: ProjectSettings,
                  name:
                    "organization-detail-orgnizationid-projectname-settings",
                  meta: {
                    breadcrumb: {
                      text: "Settings",
                      to:
                        "/organization-detail/:organizationid/project/:project/settings",
                    },
                  },
                },
                {
                  path: "create-edge",
                  component: createEdgeDP,
                  name:
                    "create-edge",
                  meta: {
                    breadcrumb: {
                      text: "Create Edge Gateway",
                      to:
                        "/organization-detail/:organizationid/project/:project/create-edge",
                    },
                  },
                },
                {
                  path: "detail-edge",
                  component: detailEdge,
                  name:
                    "detail-edge",
                  meta: {
                    breadcrumb: {
                      text: "Detail Edge Gateway",
                      to:
                        "/organization-detail/:organizationid/project/:project/detail-edge",
                    },
                  },
                },
                            
              ],
            },
            {
              path: "/organization-detail/:organizationid/custom-deka-monitoring-limit",
              component: customDekaAgentLimit,
              meta: {
                breadcrumb: {
                  text: "Custom Deka Agent Premium Limit",
                  to: "/organization-detail/:organizationid/custom-deka-monitoring-limit",
                },
              },
              children: [
                {
                  path: "",
                  component: customDekaAgentLimit,
                  name: "custom-deka-monitoring-limit",
                },
              ],
            },
          ],
        },
      ],
    });
    Vue.addModules({ [SUPERADMINMANAGEORG]: store });
    Vue.addModules({ [GODMODEMANAGEORG]: store });
  },
};
