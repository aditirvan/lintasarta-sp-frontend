<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-3">
        <v-card flat class="rounded-lg">
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="12">
                <div class="headline font-weight-bold font--text">
                  Create SSL
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold cb">DNS</span>
                    <v-select
                      height="35"
                      outlined
                      v-model="domainName"
                      :items="listDns"
                      item-text="name"
                      item-value="name"
                      placeholder="Select DNS"
                      :error-messages="createErrorMessage('domainName')"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <div
                      class="
                        d-flex
                        flex-row
                        justify-space-between
                        align-center
                      "
                    >
                      <span class="font-weight-bold text-right cb">FQDN</span>
                      <v-tooltip max-width="400" right class="text-right">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="grey "
                            dark
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                          >
                            mdi-information
                          </v-icon>
                        </template>
                        <span
                          >A fully qualified domain name (FQDN), sometimes also
                          referred to as an absolute domain name, is a domain
                          name that specifies its exact location in the tree
                          hierarchy of the Domain Name System (DNS). It
                          specifies all domain levels, including the top-level
                          domain and the root zone.
                          <br />
                          Examples: A device with the hostname
                          <i><b>somehost</b></i> in the parent domain
                          <i><b>example.com</b></i> has the fully qualified
                          domain name <i><b>somehost.example.com.</b></i> The
                          FQDN uniquely distinguishes the device from any other
                          hosts called <i><b>somehost</b></i> in other
                          domains.</span
                        >
                      </v-tooltip>
                    </div>
                    <v-text-field
                      :disabled="isLoading"
                      maxlength="50"
                      outlined
                      :suffix="`.${domainName}`"
                      v-model="fqdnName"
                      placeholder="example.com"
                      :error-messages="createErrorMessage('fqdnName')"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="6" class="mt-2">
                    <span class="font-weight-bold cb">Description</span>
                    <v-textarea
                      :disabled="isLoading"
                      maxlength="300"
                      v-model="description"
                      outlined
                      placeholder="Description"
                    >
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0">
                    <div class="d-flex align-center">
                      <v-checkbox v-model="agree" label="By Creating SSL You Agree To The"> </v-checkbox>
                      <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                        >Terms of Service</span
                      >
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-btn :disabled="isLoading" depressed block height="50" class="accent" to="/ssl">
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn v-if="role.toLowerCase() == 'superadmin'" depressed id="CreateSSL" @click="create" block height="50" class="secondary">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create SSL </span>
                    </v-btn>
                    <v-btn v-else-if="statusCheckEula" depressed id="CreateSSL" @click="create" block height="50" class="secondary">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create SSL </span>
                    </v-btn>
                    <v-btn v-else depressed id="CreateSSL" @click="create" block height="50" class="secondary" :disabled="!agree">
                      <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                      <span v-else> Create SSL </span>
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
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
  useState,
} from "vuex-composition-helpers";
const useVuelidate = require("@vuelidate/core").default;
const { required, minLength } = require("@vuelidate/validators");
import localstorage from "@/lib/localstorage";
import INSTANCE from "../instance/namespace";
export default {
  components: {},
  setup(props, context) {
    context.root.$router;
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);
    const domainName = ref("");
    const fqdnName = ref("");
    const description = ref("");
    const projJson = JSON.parse(localStorage.getItem("currentProj"));
    const orgJson = JSON.parse(localStorage.getItem("currentOrg"));
    const userId = localstorage.getItem("userId");
    const { listSsl, isLoading, isCreated, listDns } = useNamespacedGetters(
      "SSL",
      ["listSsl", "isLoading", "isCreated", "listDns"]
    );
    const { createSSL, getListDns } = useNamespacedActions("SSL", [
      "createSSL",
      "getListDns",
    ]);
    const { topbarloading } = useState(["topbarloading"]);
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);

    onMounted(() => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create Deka SSL");
      checkEula(params);
      getListDns(projJson.id);
    });

    const $v = useVuelidate({
      domainName: {
        required,
      },
      fqdnName: {
        minLength: minLength(5),
      },
    }, 
    { domainName, fqdnName });
    async function create() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const domain = fqdnName.value
        ? fqdnName.value + `.${domainName.value}`
        : domainName.value;
      const payload = {
        dns: domainName.value,
        fqdn: domain,
        description: description.value,
        project_id: projJson.id,
        organization_id: orgJson.id,
        user_id: userId.replaceAll('"', ""),
      };

      topbarloading.value.start();
      await createSSL(payload);
      if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Create Deka SSL",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload)
        }
      topbarloading.value.done();
      context.root.$router.push("/ssl");
    }
    function createErrorMessage(element) {
      return $v.value[element].$errors.length
        ? $v.value[element].$errors[0].$message
        : "";
    }
    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create Deka SSL" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };

    watch(isCreated, (val) => {
      if (val) {
        $v.value.domainName.$reset();
        // $v.value.description.$reset();
        domainName.value = "";
        description.value = "";
      }
    });
    return {
      listSsl,
      isLoading,
      isCreated,
      create,
      domainName,
      description,
      createErrorMessage,
      fqdnName,
      listDns,
      getEula,
      role,
      agree,
      statusCheckEula,
    };
  },
};
</script>
<style lang="scss" scoped>
.cb {
  color: #556272;
}
</style>