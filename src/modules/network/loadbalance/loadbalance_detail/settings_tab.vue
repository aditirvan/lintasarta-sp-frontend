<template>
  <v-card-text class="pa-8" v-if="loadBalancer">
    <v-row>
      <v-col cols="2" class="d-flex flex-row align-center">
        <p class="fz-16 font-weight-bold mb-0">Forwarding Rules</p>
      </v-col>
      <v-col
        md="10"
        class="d-flex flex-row align-center"
      >
        <v-spacer />
        <v-btn
          v-if="editMode"
          @click="
            () => {
              newrules();
            }
          "
          color="#6FCF97"
          dark
          depressed
          height="44"
          width="103"
          >
            <span class="fz-14 fw-600">New Rule</span>
        </v-btn>
        <v-btn
          v-else
          @click="
            () => {
              validateprivilages([
                'Network',
                'editor',
              ]).then(() => {
                editMode = true
              });
            }
          "
          color="secondary"
          dark
          depressed
          height="44"
          width="103"
          >
            <span class="fz-14 fw-600">Edit</span>
          </v-btn>
      </v-col>
      <v-col offset="2" cols="10">
        <v-simple-table
          class="pb-2 rounded-b-0"
          style="border-bottom: 1px solid #e0e0e0"
        >
          <thead>
            <tr>
              <th
                colspan="2"
                class="pl-4"
                style="height: 40px; text-align: left"
              >
                Load Balancer
              </th>
              <th></th>
              <th
                colspan="2"
                class="pr-4"
                style="height: 40px; text-align: left"
              >
                Instances
              </th>
              <th
                colspan="2"
                class="pr-4"
                style="height: 40px; text-align: left"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody v-for="(rule, index) in forwardingrules" :key="index">
              <forwardingrulesvue :value="rule" :editMode="editMode" @protocolChanges="protocolChanges()" @delete="(rule) => { deleteRule(rule) }"/>
          </tbody>
          <tbody v-if="!forwardingrules.length">
            <tr>
              <td colspan="6" class="text-center" style="border-bottom: none;">No data available</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <br />
    <v-divider />
    <br />
    <v-row>
      <v-col
        cols="2"
        :class="{ 'align-center': !editMode }"
        class="d-flex flex-row"
      >
        <p class="fz-16 font-weight-bold mb-0">Algorithm</p>
      </v-col>
      <v-col cols="10" class="d-flex flex-row">
        <label
          style="cursor: pointer"
          class="d-flex flex-row"
          @click="
            () => {
              if (editMode) algorithm = 'ROUND_ROBIN';
            }
          "
        >
          <div class="mr-2">
            <svg
              v-if="algorithm == 'ROUND_ROBIN'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle v-if="editMode" cx="10" cy="10" r="9.5" stroke="#2C94D2" />
              <circle v-else cx="10" cy="10" r="9.5" stroke="#999" />
              
              <circle v-if="editMode" cx="10" cy="10" r="5" fill="#2C94D2" />
              <circle v-else cx="10" cy="10" r="5" fill="#999" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" stroke="#556272" />
            </svg>
          </div>

          <span class="text">Round Robin</span>
        </label>
        <div style="height: auto; width: 70px" />
        <label
          style="cursor: pointer"
          class="d-flex flex-row"
          @click="
            () => {
             if (editMode) algorithm = 'LEAST_CONNECTIONS';
            }
          "
        >
          <div class="mr-2">
            <svg
              v-if="algorithm == 'LEAST_CONNECTIONS'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle v-if="editMode" cx="10" cy="10" r="9.5" stroke="#2C94D2" />
              <circle v-else cx="10" cy="10" r="9.5" stroke="#999" />
              
              <circle v-if="editMode" cx="10" cy="10" r="5" fill="#2C94D2" />
              <circle v-else cx="10" cy="10" r="5" fill="#999" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" stroke="#556272" />
            </svg>
          </div>

          <span class="text">Least Connections</span>
        </label>
      </v-col>
    </v-row>
    <br />
    <v-divider />
    <br />
    <v-row>
      <v-col
        cols="2"
        :class="{ 'align-center': !editMode }"
        class="d-flex flex-row"
      >
        <p class="fz-16 font-weight-bold mb-0">Health Check</p>
      </v-col>
      <v-col cols="10">
        <p class="fz-16" style="font-weight: 600">TARGET</p>
        <div class="d-flex flex-row">
          <v-select
            style="max-width: 150px"
            hide-details
            class="labelinside"
            label="Protocol"
            append-icon="mdi-chevron-down"
            :items="selectprotocol"
            v-model="health_check.protocol"
            placeholder="HTTP"
            :disabled="!editMode"
            outlined
          ></v-select>
          <div style="height: auto; width: 20px" />
          <v-text-field
            style="max-width: 150px"
            hide-details
            class="labelinside"
            label="Port"
            placeholder="80"
            v-model="health_check.port"
            :disabled="!editMode"
            outlined
            type="number"
          ></v-text-field>
          <div style="height: auto; width: 20px" />

          <v-select
            style="max-width: 150px"
            class="labelinside"
            label="Path"
            append-icon="mdi-chevron-down"
            :items="selectHTTPPaths"
            v-model="health_check.path"
            ref="customPathInput"
            :disabled="!editMode"
            placeholder="HTTP"
            outlined
            hide-details
          >
            <template v-slot:append-item>
              <v-list-item color="grey lighten-3">
                <v-text-field
                  v-model="customPath"
                  ref="customPathInput"
                  placeholder="Custom Path"
                ></v-text-field>
              </v-list-item>
            </template>
          </v-select>
        </div>
      </v-col>
      <v-col offset="2" cols="10">
        <p class="fz-16" style="font-weight: 600">ADDITIONAL SETTINGS</p>
        <div class="d-flex flex-row">
          <v-text-field
            style="max-width: 150px"
            hide-details
            class="labelinside"
            :disabled="!editMode"
            label="Check interval (in s)"
            placeholder="10"
            v-model="health_check.interval"
            outlined
            type="number"
          ></v-text-field>
          <div style="height: auto; width: 20px" />
          <v-text-field
            style="max-width: 150px"
            hide-details
            class="labelinside"
            label="Response Timeout (in s)"
            placeholder="5"
            :disabled="!editMode"
            v-model="health_check.timeout"
            outlined
            type="number"
          ></v-text-field>
          <div style="height: auto; width: 20px" />

          <v-text-field
            style="max-width: 150px"
            hide-details
            class="labelinside"
            label="Unhealthy Threshold"
            placeholder="3"
            :disabled="!editMode"
            v-model="health_check.max_unhealthy"
            outlined
            type="number"
          ></v-text-field>
          <div style="height: auto; width: 20px" />

          <v-text-field
            style="max-width: 150px"
            hide-details
            class="labelinside"
            label="Healthy Threshold"
            :disabled="!editMode"
            placeholder="5"
            v-model="health_check.max_healthy"
            outlined
            type="number"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>

    <br />
    <v-divider />
    <br />
    <v-row>
      <v-col
        cols="2"
        :class="{ 'align-center': !editMode }"
        class="d-flex flex-row"
      >
        <p class="fz-16 font-weight-bold mb-0">Sticky sessions</p>
      </v-col>
      <v-col cols="10" class="d-flex flex-row">
        <label
          style="cursor: pointer"
          class="d-flex flex-row"
          @click="
            () => {
              if (editMode) stickysession = '';
            }
          "
        >
          <div class="mr-2">
            <svg
              v-if="!stickysession"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle v-if="editMode" cx="10" cy="10" r="9.5" stroke="#2C94D2" />
              <circle v-else cx="10" cy="10" r="9.5" stroke="#999" />
              
              <circle v-if="editMode" cx="10" cy="10" r="5" fill="#2C94D2" />
              <circle v-else cx="10" cy="10" r="5" fill="#999" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" stroke="#556272" />
            </svg>
          </div>

          <span class="text">None</span>
        </label>
        <div style="height: auto; width: 70px" />
        <label
          style="cursor: pointer"
          class="d-flex flex-row"
          @click="
            () => {
              if (editMode) stickysession = 'HTTP_COOKIE';
            }
          "
        >
          <div class="mr-2">
            <svg
              v-if="stickysession == 'HTTP_COOKIE'"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle v-if="editMode" cx="10" cy="10" r="9.5" stroke="#2C94D2" />
              <circle v-else cx="10" cy="10" r="9.5" stroke="#999" />
              
              <circle v-if="editMode" cx="10" cy="10" r="5" fill="#2C94D2" />
              <circle v-else cx="10" cy="10" r="5" fill="#999" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9.5" stroke="#556272" />
            </svg>
          </div>

          <span class="text">Cookie</span>
        </label>
      </v-col>
    </v-row>
    <br />
    <v-divider />
    <br />

    <!-- <v-row>
      <v-col cols="2" class="d-flex flex-row align-center">
        <p class="mt-1 fz-16 font-weight-bold mb-0">SSL</p>
      </v-col>
      <v-col v-if="!editMode" md="8" class="d-flex flex-row align-center">
        <div class="fz-16">
          {{ ssl ? "Redirected from http to https" : "No redirect" }}
        </div>
      </v-col>
      <v-col v-if="editMode" cols="10" class="d-flex flex-row">
        <v-checkbox
          class="mt-0 pt-0"
          hide-details
          label="Redirect HTTP to HTTPS"
          v-model="ssl"
        ></v-checkbox>
      </v-col>
    </v-row>
    <br />
    <v-divider />
    <br /> -->
    <div v-if="isHTTPSExists">
      <v-row v-if="!editMode">
        <v-col cols="2">
          <p class="mt-1 fz-16 font-weight-bold mb-0">SSL</p>
        </v-col>
        <v-col cols="8">
          <div style="max-width: 470px">
            <div>
              <span>{{ certificate ? 'Redirect HTTP to HTTPS' : '-' }}</span><br><br>
              <span>{{ certificate ? `Certificate : ${certificate.name}` : '' }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="2">
          <p class="mt-1 fz-16 font-weight-bold mb-0">SSL</p>
        </v-col>
        <v-col cols="8">
          <v-checkbox v-model="ssl" class="mt-0" label="Redirect HTTP to HTTPS"></v-checkbox>
          <div style="max-width: 470px" v-if="ssl">
            <div>
              <v-select
                placeholder="Choose a cerficate"
                append-icon="mdi-chevron-down"
                :items="certificates"
                item-text="name"
                item-value="id"
                v-model="selectedCertificate"
                outlined
                single-line
              ></v-select>
            </div>
          </div>
        </v-col>
      </v-row>
      <div v-if="!editMode">
        <br />
        <v-divider />
        <br />
      </div>
    </div>
    <v-row v-if="!editMode">
      <v-col cols="2" class="d-flex flex-row">
        <p class="mt-1 fz-16 font-weight-bold mb-0">Destroy</p>
      </v-col>
      <v-col cols="8" class="d-flex flex-row">
        <div style="max-width: 470px">
          <p class="mb-0">
            Your Load Balancer will be permanently destroyed. Any associated
            Instance will be disconnected and will stop receiving distributed
            traffic. Instance will not be destroyed.
          </p>
        </div>
        
      </v-col>
      <v-col cols="2" class="d-flex flex-row justify-center">
        <v-btn
          width="100"
          height="55"
          depressed
          class="error--text rounded-lg "
          style="background-color: white; border: 1px solid #eb5757"

          @click="
            () => {
              validateprivilages([
                'Network',
                'editor',
              ]).then(() => {
                opendialogdeletedload = true
              });
            }
          "
          
          :disabled="isLoading"
        >Destroy</v-btn>
      </v-col>
      <br />
      <v-divider />
      <br />
    </v-row>
    <v-row v-if="editMode">
      <v-col cols="12" class="text-right">
        <v-btn
          color="accent"
          depressed
          x-large
          class="mr-4"
          :disabled="isLoading"
          @click="cancelUpdate"
        >Cancel</v-btn>
        <v-btn
          color="secondary"
          depressed
          x-large
          :disabled="isLoading"
          @click="doUpdate"
        >Save Changes</v-btn>
      </v-col>
    </v-row>
    <dialogDeleteLoad v-model="opendialogdeletedload" :redirectToPageList="true" :loadBalancer="loadBalancer" @close="opendialogdeletedload = false" />
  </v-card-text>
</template>
<script>
import { ref, reactive, watch, onMounted, defineComponent } from "@vue/composition-api";
import forwardingrulesvue from "./forwardingrules.vue";
import dialogDeleteLoad from '../dialogDeleteLoad.vue'
import { useLoadBalancer } from '../useLoadBalancer'
import { useNamespacedActions } from "vuex-composition-helpers";

export default defineComponent({
  components: { 
    forwardingrulesvue,
    dialogDeleteLoad,
  },
  props: ['loadBalancer'],
  setup(props, { root }) {

    const { updateLoadBalancer, deleteLoadBalancer, isLoading, certificates, fetchCertificates, selectHTTPPaths } = useLoadBalancer()
    
    const algorithm = ref(null)
    const certificate = ref(null)
    const health_check = reactive({
      protocol: null,
      port: null,
      path: null,
      interval: null,
      timeout: null,
      max_unhealthy: null,
      max_healthy: null,
    })

    const forwardingrules = ref([])
    const stickysession = ref(null);
    const ssl = ref(null);
    const proxy = ref(null);
    const proxyedit = ref(true);
    const keepalive = ref(null);
    const keepaliveedit = ref(true)
    const selectedCertificate = ref(null)
    
    const customPath = ref(null)
    const customPathInput = ref(null)
    const selectHTTPPathsLength = selectHTTPPaths.value.length
    watch(customPath, (val) => {
      if (customPath.value) {
        if (selectHTTPPaths.value.length == selectHTTPPathsLength) {
          selectHTTPPaths.value.push(val)
          health_check.path = val
        }
        else if (selectHTTPPaths.value.length == selectHTTPPathsLength + 1) {
          selectHTTPPaths.value.pop()
          selectHTTPPaths.value.push(val)
          health_check.path = val
        }
        setTimeout(() => {
          customPathInput.value.focus()
        }, 50);
      }
      else {
        selectHTTPPaths.value.pop()
        health_check.path = '/'
      }
    })

    watch(ssl, (val) => {
      if (!val) selectedCertificate.value = null
    })

    const isHTTPSExists = ref(false)
    const protocolChanges = () => {
      isHTTPSExists.value = forwardingrules.value.some(x => x.protocol == 'HTTPS')
    }

    onMounted(async () => {
      await fetchCertificates()
      algorithm.value = props.loadBalancer.algorithm 
      forwardingrules.value = props.loadBalancer.rules || []
      stickysession.value = props.loadBalancer.stickysession
      
      health_check.protocol = props.loadBalancer.health_check ? props.loadBalancer.health_check.protocol : null
      health_check.port = props.loadBalancer.health_check ? props.loadBalancer.health_check.port : null
      health_check.path = props.loadBalancer.health_check ? props.loadBalancer.health_check.path : null
      health_check.interval = props.loadBalancer.health_check ? props.loadBalancer.health_check.interval : null
      health_check.timeout = props.loadBalancer.health_check ? props.loadBalancer.health_check.timeout : null
      health_check.max_unhealthy = props.loadBalancer.health_check ? props.loadBalancer.health_check.max_unhealthy : null
      health_check.max_healthy = props.loadBalancer.health_check ? props.loadBalancer.health_check.max_healthy : null
      
      certificate.value = props.loadBalancer.certificate_id ? props.loadBalancer.certificate : null
      ssl.value = props.loadBalancer.certificate_id ? true : false
      selectedCertificate.value = props.loadBalancer.certificate_id
      
      customPath.value = health_check.path
      if (!selectHTTPPaths.value.includes(health_check.path)) selectHTTPPaths.value.push(health_check.path)
      protocolChanges()
    })

    const opendialogdeletedload = ref(false)
    const editMode = ref(false)
    const selectpath = ref(["/", "/public", "/html"]);
    const selectprotocol = ref(["HTTPS", "FTP", "HTTP"]);

    const newrules = () => {
      forwardingrules.value.push({
        protocol: '',
        port: null,
        instance_protocol: '',
        instance_port: null,
        editMode: true,
      })
    }

    const cancelUpdate = () => {
      editMode.value = false
      forwardingrules.value = forwardingrules.value.filter((x) => !x.editMode)
      algorithm.value = props.loadBalancer.algorithm;
      stickysession.value = props.loadBalancer.stickysession;

      health_check.protocol = props.loadBalancer.health_check ? props.loadBalancer.health_check.protocol : null
      health_check.port = props.loadBalancer.health_check ? props.loadBalancer.health_check.port : null
      health_check.path = props.loadBalancer.health_check ? props.loadBalancer.health_check.path : null
      health_check.interval = props.loadBalancer.health_check ? props.loadBalancer.health_check.interval : null
      health_check.timeout = props.loadBalancer.health_check ? props.loadBalancer.health_check.timeout : null
      health_check.max_unhealthy = props.loadBalancer.health_check ? props.loadBalancer.health_check.max_unhealthy : null
      health_check.max_healthy = props.loadBalancer.health_check ? props.loadBalancer.health_check.max_healthy : null

      certificate.value = props.loadBalancer.certificate_id ? props.loadBalancer.certificate : null
      selectedCertificate.value = props.loadBalancer.certificate_id ? props.loadBalancer.certificate_id : null
      ssl.value = props.loadBalancer.certificate_id ? true : false
      
      customPath.value = health_check.path
      if (!selectHTTPPaths.value.includes(health_check.path)) selectHTTPPaths.value.push(health_check.path)
      protocolChanges()
    }

    const deleteRule = (rule) => {
      forwardingrules.value = forwardingrules.value.filter((x) => x.id !== rule.id)
    }

    const doUpdate = async () => {
      let payload = {}
      payload.id = props.loadBalancer.id
      payload.name = props.loadBalancer.name
      payload.algorithm = algorithm.value
      payload.sticky_session = stickysession.value
      payload.health_check = health_check
      payload.rules = forwardingrules.value.map((x) => {
        return {
          protocol: x.protocol,
          port: parseInt(x.port),
          instance_protocol: x.instance_protocol,
          instance_port: parseInt(x.instance_port),
        }
      })

      payload.instance_ids = props.loadBalancer.instance_ids
      payload.certificate_id = selectedCertificate.value

      const response = await updateLoadBalancer(payload)
      if (response.status == 200) editMode.value = false
    }


    const disabledField = ref(false);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Storage", "editor"]).then((res) => {
      disabledField.value = res;
    });



    return {
      isObjectEmpty: (obj) => Object.keys(obj).length ? true : false,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      deleteRule,
      certificates,
      doUpdate,
      opendialogdeletedload,
      selectedCertificate,
      cancelUpdate,
      editMode,
      newrules,
      selectprotocol,
      selectpath,
      algorithm,
      stickysession,
      ssl,
      certificate,
      proxy,
      proxyedit,
      forwardingrules, 
      keepalive, 
      keepaliveedit,
      health_check,
      isLoading,
      customPath,
      customPathInput,
      selectHTTPPaths,
      isHTTPSExists,
      protocolChanges,
    };
  },
});
</script>
<style lang="scss" scoped>
.fw-600 {
  font-weight: 600;
}
.labelinside {
  ::v-deep legend {
    width: 0px !important;
  }
  ::v-deep label {
    top: 30px;
    font-weight: 700;
    color: #a5b3bf;
  }
  ::v-deep input {
    position: relative;
    top: 5px;
  }
  ::v-deep .v-select__selection {
    position: relative;
    top: 5px;
  }
  ::v-deep .v-text-field__details {
    position: inherit;
  }
}
tr td {
  border-bottom: 1px solid #e0e0e0;
}
input[type="radio"] {
  color: red;
}
</style>