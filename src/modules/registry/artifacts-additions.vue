<template>
  <div>
    <v-card class="rounded-lg mt-4 mb-4" flat>
      <template>
        <v-tabs v-model="tab" class="mb-6">
          <v-tab class="fz-14 firewall-title" @click="vulnerabilities()"
            >Vulnerabilities</v-tab
          >
          <v-tab class="fz-14 firewall-title" @click="buildHistory()"
            >Build History</v-tab
          >
        </v-tabs>
      </template>

      <v-tabs-items v-model="tab" class="mb-6">
        <v-tab-item>
          <div class="mb-5" >
            <v-btn outlined color="#1f60a8" width="125" @click="scaning()" 
            :disabled="loadings || disable"
            >
            <span v-if="loadings">SCANNING </span>
            <span v-else><v-icon left small>mdi-shield-check-outline</v-icon> SCAN</span>
            <beat-loader
              v-if="loadings"
              :loading="loadings"
              :size="'10px'"
              class="ml-2"
            />
            </v-btn
            >
          </div>
          <v-card flat
            ><v-data-table
              :headers="headersVul"
              :items="DataVulnerabilities"
              class="elevation-0"
              item-key="no"
              hide-default-footer
              v-if="DataVulnerabilities"
            >
              <template #[`item.CVSS3`]="{ item }">
                
                <div v-if="item.vendor_attributes">
                  <p v-if="item.vendor_attributes.CVSS.ghsa">ghsa : {{ item.vendor_attributes.CVSS.ghsa.V3Score }}</p>
                  <p v-if="item.vendor_attributes.CVSS.nvd">nvd : {{ item.vendor_attributes.CVSS.nvd.V3Score }}</p>
                  <p v-if="item.vendor_attributes.CVSS.redhat">redhat : {{ item.vendor_attributes.CVSS.redhat.V3Score }}</p>
                </div>
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
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat
            ><v-data-table
              :headers="headersBuild"
              :items="dataBuildHistory"
              class="elevation-0"
              item-key="no"
              hide-default-footer
              :items-per-page="10"
            >
              <template #[`item.created`]="{ item }">
                <div>
                  {{ formatDate(item.created) }}
                </div>
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
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { REGISTRY } from "./namespace";
import moment from "moment";
export default {

  // methods: {
  //    handler_vulnerabilities(name,project,artifacts){
  //     if(scaning_status.value){
  //       // console.log("scaning");
  //       // const { getGetDetailArtifact} =
  //       //   useNamespacedActions(REGISTRY, [
  //       //   "getGetDetailArtifact",
  //       // ]);
  //         const params = {
  //           name: name,
  //           project: project,
  //           artifacts:artifacts, 
  //         };
          
  //       // setTimeout(function () {
  //         getGetDetailArtifact(params);
  //       //   },
  //       // 3000);
  //     }else{
  //       // console.log("scan done");
  //       this.loadings = false
  //     }
  //   }
  // },
  // computed: {
  //   count() {
  //     // console.log("computed: ",$store.state.loading);
  //   }
  // },
  setup(props, context) {
    const { tableOverview, listVulnerabilities, listBuildHistory,loading,detailartifact} =
      useNamespacedGetters(REGISTRY, [
        "tableOverview",
        "listVulnerabilities",
        "listBuildHistory",
        "loading",
        "detailartifact",
      ]);
    const { getBuildHistory,getVulnerabilities,scanArtifact_detail,getGetDetailArtifact} = useNamespacedActions(REGISTRY, [
      "getBuildHistory",
      "getVulnerabilities",
      "scanArtifact_detail",
      "getGetDetailArtifact",
    ]);
    
    onMounted(async () => {
      const param = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        artifacts: context.root.$route.params.artifacts,
      };
      await getVulnerabilities(param);
      await getBuildHistory(param);
       DataVulnerabilities.value=listVulnerabilities.value
       dataBuildHistory.value=listBuildHistory.value
    });
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const disable = ref(true)
    const role=localStorage.getItem("role"); 
    // console.log("role====",role)
    if(role=="Owner"||role=='Superadmin'){
      disable.value=false
    }
    const dataTag = ref();
    const DataVulnerabilities=ref();
    const dataBuildHistory=ref();
    const scaning_status=ref(false);
    const loadings=ref(false);
    const panel = ref(0);
    const tab = ref(null);
    const formatDate = (date) => {
      return moment(date).format("l, LT");
    };
    const headersVul = ref([
      { text: "Vulnerability", value: "id" },
      { text: "Severity", value: "severity" },
      { text: "CVSS3", value: "CVSS3" },
      { text: "Package", value: "package" },
      { text: "Current version", value: "version" },
      { text: "Fixed in version", value: "fix_version" },
      // { text: "Listed In CVE Allowlist", value: "op_time" },
    ]);

    const headersBuild = ref([
      { text: "Create on", value: "created", width: "23%" },
      { text: "Commands", value: "created_by" },
    ]);

    const vulnerabilities = async () => {
      DataVulnerabilities.value=""
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        artifacts: context.root.$route.params.artifacts,
      };
      await getVulnerabilities(params);
      DataVulnerabilities.value=listVulnerabilities.value;
    };
    const scaning = async() => {
      loadings.value = true;
      const param = {
        project: context.root.$route.params.project_name,
        repository: context.root.$route.params.project,
        digest:context.root.$route.params.artifacts,
      };
      scaning_status.value=true
      await scanArtifact_detail(param);
      checking_status_scan()
    }
    const checking_status_scan =() => {
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        digest:context.root.$route.params.artifacts,
      };
      // console.log("checking_status_scan  params :",params)
      scaning_status.value=true   
        setTimeout(async function () {
          await getGetDetailArtifact(params);
          // console.log(detailartifact.value.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status)
          checking(detailartifact.value.scan_overview['application/vnd.security.vulnerability.report; version=1.1'].scan_status)
          },
        3000);
    };
    const checking = (status) => {
      var currentUrl = window.location.pathname;
      // console.log(currentUrl);
      var url=currentUrl.split("/")
      // console.log(url);
      // console.log(url[5]);
      // console.log("checking ",status)
      if(url[5]){
        if(status=="Pending"||status=="Running"){
          checking_status_scan()
        }
        else{
          loadings.value = false;
          vulnerabilities()
        }
      }
    };
    const buildHistory = async () => {
      const params = {
        name: context.root.$route.params.project_name,
        project: context.root.$route.params.project,
        artifacts: context.root.$route.params.artifacts,
      };
      await getBuildHistory(params);
      dataBuildHistory.value=listBuildHistory.value;
    };
    
    return {
      checking,
      checking_status_scan,
      // status_scan,
      panel,
      tableOverview,
      formatDate,
      hide,
      tab,
      headersVul,
      headersBuild,
      vulnerabilities,
      buildHistory,
      scaning,
      scaning_status,
      listVulnerabilities,
      listBuildHistory,
      getBuildHistory,
      DataVulnerabilities,
      dataBuildHistory,
      dataTag,
      loading,
      loadings,
      getGetDetailArtifact,
      detailartifact,
      role,
      disable,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>