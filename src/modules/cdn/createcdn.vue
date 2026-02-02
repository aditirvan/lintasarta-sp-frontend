<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-3">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="12">
                <div class="headline font-weight-bold font--text">
                  Create CDN
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">Domain</span>
                    <v-text-field :disabled="isLoading" maxlength="50" outlined v-model="domain"
                      placeholder="example.com" :error-messages="createErrorMessage('domain')">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">IP Address</span>
                    <v-text-field :disabled="isLoading" maxlength="50" outlined v-model="ip" :error-messages="errorIp | createErrorMessage('ip')" placeholder="8.8.8.8">
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">Location</span>
                    <v-select height="35" outlined v-model="tags" :items="listTag.map((t) => t.name.toUpperCase())"
                      placeholder="Select Location" :error-messages="createErrorMessage('tags')"></v-select>
                  </v-col>
                </v-row> -->
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">Port</span>
                    <v-select height="35" outlined v-model="port" :items="listPort" item-text="name" item-value="name"
                      placeholder="Choose Port" :error-messages="createErrorMessage('port')"></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="port == '443'">
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">SSL</span>
                    <v-select height="35" outlined v-model="ssl" :items="listSsl.map(e => e.fqdn)" item-text="name"
                      item-value="name" placeholder="Choose SSL" :error-messages="createErrorMessage('ssl')"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold">Billing Type</span>
                    <v-select height="35" outlined v-model="billingType" :items="listBillingType" item-text="name"
                      item-value="name" placeholder="Choose Billing Type"
                      :error-messages="createErrorMessage('billingType')"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                    <div class="d-flex align-center">
                      <v-checkbox v-model="agree" label="By Creating CDN You Agree To The"> </v-checkbox>
                      <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                        >Terms of Service</span
                      >
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-btn :disabled="isLoading" depressed block height="50" class="accent" to="/cdn">
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn v-if="role.toLowerCase() == 'superadmin'" depressed id="CreateCDN" @click="create" block height="50" class="secondary">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create CDN </span>
                    </v-btn>
                    <v-btn v-else-if="statusCheckEula" depressed id="CreateCDN" @click="create" block height="50" class="secondary">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create CDN </span>
                    </v-btn>
                    <v-btn v-else depressed id="CreateCDN" @click="create" block height="50" class="secondary" :disabled="!agree">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create CDN </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import { isValidIPv4, isValidIPv6, detectChangedFieldsValue, extractData } from "@/lib/inputValidator";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
  useState,
} from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default;
const { required, requiredIf, minLength } = require("@vuelidate/validators");
import localstorage from "@/lib/localstorage";
import INSTANCE from "../instance/namespace";
export default {
  components: {},
  setup(props, context) {
    context.root.$router;
    const domain = ref("");
    const port = ref("");
    // const tags = ref([]);
    const ip = ref([]);
    const billingType = ref("");
    const ssl = ref("");
    const projJson = JSON.parse(localStorage.getItem("currentProj"));
    const orgJson = JSON.parse(localStorage.getItem("currentOrg"));
    const userId = localstorage.getItem("userId");
    const listBillingType = []
    const listPort = ["443", "80"]
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);
    const errorIp = ref(null);

    if (projJson.postpaid_type == "fixed") {
      listBillingType.unshift("Fixed")
    } else {
      listBillingType.unshift("Pay Per Use (PPU)")
    }

    const { listSsl, isLoading, isCreated, listDns, listTag, } = useNamespacedGetters(
      "CDN",
      ["listSsl", "isLoading", "isCreated", "listDns", "listTag", "listSsl"]
    );
    const { createCDN, getListTag, getListSSL } = useNamespacedActions("CDN", [
      "createCDN",
      "getListTag",
      "getListSSL",
    ]);
    const { topbarloading } = useState(["topbarloading"]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);


    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create CDN");
      await checkEula(params);
      await getListTag()
      await getListSSL({isNotExpired: true})
    });

    const $v = useVuelidate(
      {
        domain: {
          required,
          minLength: minLength(5),
        },
        ip: { required },
        port: { required },
        billingType: { required },
        ssl: {
          required: requiredIf(() => {
            return port.value == "443"
          })
        }
      },
      {
        domain,
        ip,
        port,
        billingType,
        ssl
      });
    async function create() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // let selectedTag = { id: '', name:'', varnishId: '' }
      // const filteredTag = listTag.value.filter((e) => e.name.toUpperCase() == tags.value)
      // if(filteredTag.length){
      //   selectedTag = {id: filteredTag[0].id, name: filteredTag[0].name, varnishId: filteredTag[0].varnishId}
      // }
      const payload = {
        domain: domain.value,
        port: port.value,
        // tag: selectedTag,
        ip: [ip.value],
        billing_type: billingType.value,
        project_id: projJson.id,
        organization_id: orgJson.id,
        user_id: userId.replaceAll('"', ""),
        ssl: ssl.value
      };

      topbarloading.value.start();
      const err = await createCDN(payload);
      if (err && err.data && err.data.responseMessage) {
        topbarloading.value.done();
        return
      }
      if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Create CDN",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload)
        }
      topbarloading.value.done();
      context.root.$router.push("/cdn");
    }
    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }

    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create CDN" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };

    watch(isCreated, (val) => {
      if (val) {
        domain.value = "";
        port.value = "";
        // tags.value = [];
        billingType.value = "";
      }
    });

    watch(ip, (val) => {
      if (val == "" || val == null){
        errorIp.value = null
        ip.value = null
        return
      }
      if (!isValidIPv4(val)){
        errorIp.value = "Invalid IP Address"
        return
      }
      errorIp.value = null
    })
    
    return {
      listSsl,
      listBillingType,
      listPort,
      listDns,
      listTag,
      isLoading,
      isCreated,
      create,
      createErrorMessage,
      domain,
      port,
      ip,
      errorIp,
      // tags,
      billingType,
      ssl,
      getEula,
      agree,
      role,
      statusCheckEula,
    };
  },
};
</script>