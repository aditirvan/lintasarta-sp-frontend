<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col cols="7">
                <div class="balance-title d-flex align-items-center">
                  Create Load Balancer
                  <div class="ml-1" style="transform:translateY(-3px)">
                    <span
                      class="px-2 py-1 rounded-pill primary white--text"
                      style="font-weight:500;font-size:12px;"
                    >Beta</span>
                  </div>
                </div>
                <div class="balance-content pt-4">
                  Load balancers distribute traffic between Instances within the
                  same datacenter. Create a load balancer, then add Instances by
                  name or by tag.
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert Name"
                  single-line
                  outlined
                  v-model="name"
                  :error-messages="$v.name.$errors.length?$v.name.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Choose Region</p>
                <v-select
                  v-model="regionidselected"
                  append-icon="mdi-chevron-down"
                  :items="selectregions"
                  placeholder="Choose a Region"
                  outlined
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" md="6" class="py-0">
              <p><b>Billing Type</b></p>
              <v-select
                id="billingType"
                placeholder="Choose Instance Billing Type"
                v-model="selectedBillingType"
                :items="billingTypes"
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" class=""
              v-if="selectedBillingType == 'Trial'"
            >
              <p><b>Trial Voucher</b></p>
              <v-select
                id="trialVoucher"
                placeholder="Choose trial voucher to use"
                v-model="selectedTrialVoucher"
                :error-messages="
                  $v.selectedTrialVoucher.$errors.length
                    ? $v.selectedTrialVoucher.$errors[0].$message
                    : ''
                "
                :items="vouchers"
                item-value="id"
                outlined
              >
                <template v-slot:selection="{ item }">
                {{item.name}} - {{item.code}}
                </template>
                <template v-slot:item="{ item }">
                {{item.name}} - {{item.code}}
                </template>
              </v-select>
            </v-col>
          </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">VPC Network</p>
                <v-select
                  placeholder="VPC A"
                  append-icon="mdi-chevron-down"
                  :items="vpcs"
                  item-text="name"
                  item-value="id"
                  v-model="vpcselected"
                  :error-messages="$v.vpcselected.$errors.length?$v.vpcselected.$errors[0].$message:''"
                  outlined
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Add Instance</p>
                <v-select
                  placeholder="Choose Instances"
                  append-icon="mdi-chevron-down"
                  :disabled="!vpcselected"
                  :items="selectInstances"
                  v-model="instanceselected"
                  outlined
                  single-line
                  multiple
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Forwarding Rules
                </p>
                <v-spacer />
                <v-btn depressed color="success" width="125" @click="addRule()"
                  >New Rule
                </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table style="min-height: 230px">
                <thead>
                  <tr>
                    <th colspan="3">Load Balancer</th>
                    <th colspan="3">Instance</th>
                  </tr>
                </thead>
                  <balance v-for="(rule, i) in rules" :key="i"
                  ref="rulesref"
                  :rule="rule" :selectInstanceProtocols="selectInstanceProtocols"
                  @protocolChanges="protocolChanges()"
                  @delete="()=>{
                    deleteRule(i)
                  }"
                   />
              </v-simple-table>
            </div>
            <v-divider />
            <br />

            <p class="fz-18" style="font-weight: 600">Advance Settings</p>

            <v-card v-if="!editadvanceSettings" outlined flat class="rounded-lg">
              <v-container class="pa-4">
                <v-row>
                  <v-col class="py-0">
                    <p class="accent--text mb-0">
                      The most commonly used settings are selected by default.
                      You can change them at any time by clicking “Edit Advanced
                      Settings”.
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      @click="
                        () => {
                          editadvanceSettings = true;
                        }
                      "
                      block
                      class="secondary fz-14"
                      depressed
                    >
                      Edit Advance Settings
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="4">
                    <p class="font-weight-bold fz-16 mb-0">Algorithm</p>
                    <p class="accent--text fz-16" style="text-transform:capitalize;">{{ advanceSettings.algorithm.replace('_', ' ').toLowerCase() }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p class="font-weight-bold fz-16 mb-0">Sticky sessions</p>
                    <p class="accent--text fz-16" style="text-transform:capitalize;">{{ advanceSettings.stickysession }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p class="font-weight-bold fz-16 mb-0">Health checks</p>
                    <p class="accent--text fz-16 text-lowercase">{{advanceSettings.healthcheck.target.protocol}}://0.0.0.0:{{advanceSettings.healthcheck.target.port}}{{advanceSettings.healthcheck.target.path}}</p>
                  </v-col>
                </v-row>

                <!-- <v-row>
                  <v-col cols="4">
                    <p class="font-weight-bold fz-16 mb-0">SSL</p>
                    <p class="accent--text fz-16">{{ advanceSettings.ssl ? 'Redirect' : 'No redirect'}}</p>
                  </v-col>
                </v-row> -->
              </v-container>
            </v-card>
            <v-card v-if="editadvanceSettings" outlined flat class="rounded-lg">
              <v-container class="pa-4">
                <v-row>
                  <v-col class="py-0">
                    <p class="accent--text mb-0">
                      Click “Hide Settings Options” to show selected values
                      only.
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-btn
                      outlined
                      class="secondary--text fz-14"
                      @click="
                        () => {
                          if($v.advanceSettings.$errors.length < 1){
                          editadvanceSettings = false;
                          }
                        }
                      "
                      block
                      depressed
                    >
                      Hide Setting Options
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="5">
                    <p class="font-weight-bold fz-16 mb-0">Algorithm</p>
                    <v-radio-group row v-model="advanceSettings.algorithm">
                      <div style="min-width: 145px">
                        <v-radio
                          value="ROUND_ROBIN"
                          label="Round Robin"
                        ></v-radio>
                      </div>
                      <div>
                        <v-radio
                          value="LEAST_CONNECTIONS"
                          label="Least Connections"
                        ></v-radio>
                      </div>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="5">
                    <p class="font-weight-bold fz-16 mb-0">Sticky sessions</p>
                    <v-radio-group row v-model="advanceSettings.stickysession">
                      <div style="min-width: 145px">
                        <v-radio
                          value="none"
                          label="None"
                        ></v-radio>
                      </div>
                      <div>
                        <v-radio
                          value="HTTP_COOKIE"
                          label="HTTP Cookie"
                        ></v-radio>
                      </div>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <p class="font-weight-bold fz-16 mb-0">Health checks</p>
                    <p class="accent--text fz-16 mb-0">
                      Set how often the Load Balancer checks if Droplets are
                      responding. It will automatically stop sending traffic to
                      unresponsive Instance.
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" class="py-0">
                    <v-row class="d-flex align-baseline flex-row">
                      <v-col>
                        <v-select
                          class="labelinside"
                          label="Protocol"
                          append-icon="mdi-chevron-down"
                          v-model="advanceSettings.healthcheck.target.protocol"
                          :items="selectHealthCheckProtocols"
                          placeholder="HTTP"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="labelinside"
                          label="Port"
                          placeholder="80"
                          outlined
                          type="number"
                          :error-messages="$v.advanceSettings.healthcheck.target.port.$errors.length?$v.advanceSettings.healthcheck.target.port.$errors[0].$message:''"
                          @change="$v.advanceSettings.healthcheck.target.port.$touch()"
                          v-model.number="advanceSettings.healthcheck.target.port"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-autocomplete
                          v-if="['HTTP', 'HTTPS'].includes(advanceSettings.healthcheck.target.protocol)"
                          class="labelinside"
                          label="Path"
                          append-icon="mdi-chevron-down"
                          :items="selectHTTPPaths"
                          placeholder="HTTP Path"
                          outlined
                          v-model="advanceSettings.healthcheck.target.path"
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
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="py-0">
                    <p class="mb-0" style="font-weight: 600">
                      ADDITIONAL SETTINGS
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="8" class="py-0">
                    <v-row>
                      <v-col>
                        <v-text-field
                          class="labelinside"
                          label="Check interval (in s)"
                          placeholder="80"
                          type="number"
                          outlined
                          v-model="advanceSettings.healthcheck.additionalsettings.checkinterval"
                          :error-messages="$v.advanceSettings.healthcheck.additionalsettings.checkinterval.$errors.length ? $v.advanceSettings.healthcheck.additionalsettings.checkinterval.$errors[0].$message : ''"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="labelinside"
                          label="Response Timeout (in s)"
                          placeholder="80"
                          outlined
                          type="number"
                          v-model="advanceSettings.healthcheck.additionalsettings.responsetimeout"
                          :error-messages="$v.advanceSettings.healthcheck.additionalsettings.responsetimeout.$errors.length ? $v.advanceSettings.healthcheck.additionalsettings.responsetimeout.$errors[0].$message : ''"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="labelinside"
                          label="Unhealthy Threshold"
                          outlined
                          placeholder="1 - 9"
                          min="1"
                          max="10"
                          type="number"
                          v-model="advanceSettings.healthcheck.additionalsettings.unhealtythreshold"
                          :error-messages="$v.advanceSettings.healthcheck.additionalsettings.unhealtythreshold.$errors.length ? $v.advanceSettings.healthcheck.additionalsettings.unhealtythreshold.$errors[0].$message : ''"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="labelinside"
                          label="Healthy Threshold"
                          placeholder="1 - 9"
                          min="1"
                          max="10"
                          outlined
                          type="number"
                          :error-messages="$v.advanceSettings.healthcheck.additionalsettings.healtythreshold.$errors.length ? $v.advanceSettings.healthcheck.additionalsettings.healtythreshold.$errors[0].$message : ''"
                          v-model="advanceSettings.healthcheck.additionalsettings.healtythreshold"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-if="isHTTPSExists">
                  <v-col>
                      <div class="d-flex"><p class="font-weight-bold fz-16 mb-0">SSL</p></div>
                      <div class="d-flex"><v-checkbox v-model="advanceSettings.ssl" label="Redirect HTTP to HTTPS"></v-checkbox></div>
                  </v-col>
                </v-row>
                <v-row v-if="advanceSettings.ssl">
                  <v-col cols="12" md="6">
                    <p class="font-weight-bold">SSL Certificate</p>
                    <div class="d-flex">
                      <v-select
                        placeholder="Choose a cerficate"
                        append-icon="mdi-chevron-down"
                        :items="certificates"
                        item-text="name"
                        item-value="id"
                        v-model="selectedCertificate"
                        outlined
                        single-line
                        :error-messages="$v.selectedCertificate.$errors.length ? $v.selectedCertificate.$errors[0].$message : ''"
                      ></v-select>
                      <v-btn
                        depressed
                        solo
                        class="ml-4"
                        color="secondary"
                        @click="() => openDialogCreateCertificate = true"
                      >Add New Certificate</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

            <br />
            <v-row>
              <v-col cols="12">
                <v-btn
                  v-if="user.role.toLowerCase() !== 'superadmin'"
                  block
                  class="secondary fz-14"
                  depressed
                  @click="createLB()"
                >
                  Create Load Balancer
                </v-btn>
                <v-btn
                  v-else
                  block
                  class="secondary fz-14"
                  depressed
                  @click="createLB()"
                >
                  Create Load Balancer
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogCreateCertificate v-model="openDialogCreateCertificate" :isOpen="openDialogCreateCertificate" @close="() => openDialogCreateCertificate = false" />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "@vue/composition-api";
import network from "../NetworkComposition";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from '@/modules/network/vpc/namespace'
import { INSTANCE } from '@/modules/instance/namespace'
import { useLoadBalancer } from './useLoadBalancer'
import balance from './balance'
import { NETWORKLOADBALANCER } from './namespace'
import { useCreatedInstance } from '@/modules/instance/compositionapi/usecreatedinstance';
import { useCertificate } from './useCertificate'
import dialogCreateCertificate from './dialogCreateCertificate.vue'
import libProject from '@/lib/project'
import { useVoucher } from '@/modules/voucher/useVoucher'
import api from "@/lib/api";
import { mapGetters } from "vuex";
import localstorage from '@/lib/localstorage';

export default {
  components: {
    balance,
    dialogCreateCertificate,
  },
  data: () => ({
    tnc: false,
    dataTnc: {},
    region: ["Indonesia"],
    vpc: ["VPC A", "VPC-B", "VPC-C"],
    intance: ["INSTANCE-A", "INSTANCE-B", "INSTANCE-C"],
  }),

  setup(props, context) {
    const loadbalance = ref({
      name: "",
    })

    const customPath = ref(null)
    const customPathInput = ref(null)

    const rules = ref([
      {
        source: {
          protocol: 'HTTP',
          port: ''
        },
        target: {
          protocol: 'HTTP',
          port: ''
        }
      }
    ]);

    function addRule() {
      rules.value.push({
        source:{
            protocol: 'HTTP',
            port: ''
          },
          target:{
            protocol: 'HTTP',
            port: ''
          }
      })
    }

    function deleteRule(index){
      rules.value.splice(index,1)
    }

    const { vouchers, fetchVouchers } = useVoucher()
    const defaultBillingTypes = [
      {
        text: "Pay Per Use (PPU)",
        value: "PPU",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ]

    const fixedPostpaid = [
      {
        text: "Fixed",
        value: "Fixed",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ]

    const agree2 = false

    const projJson = localstorage.getItem('currentProj')
    const projObj = projJson && projJson !== 'undefined' ? JSON.parse(projJson) : {}
    const postpaid_type = projObj.postpaid_type

    const userRole = localstorage.getItem('role')
    const projectIDLocalStorage = localstorage.getItem('projectid')

    // const billingTypes = ref(postpaid_type && postpaid_type === 'fixed' ? fixedPostpaid : defaultBillingTypes)
    const billingTypes = ref([])

    const selectedBillingType = ref('')
    const selectedTrialVoucher = ref(null)

    onMounted(async () => {
      if (postpaid_type && postpaid_type === 'fixed') {
        billingTypes.value = fixedPostpaid
        selectedBillingType.value = ''
      } else {
        billingTypes.value = defaultBillingTypes
        selectedBillingType.value = ''
      }

      await fetchVouchers()
    })

    const Composable = {
      ...useRegion(),
      ...useCreatedInstance(),
      ...useLoadBalancer(),
      ...useCertificate(),
    }

    const {
      selectregions,
      fetchregions,
      regionidselected,
      instanceSelect,
      openDialogCreateCertificate,
      selectedCertificate,
      createLoadBalancer,
      selectHTTPPaths,
    } = Composable;

    const name = ref('')
    const { fetchvpcs } = useNamespacedActions(NETWORKVPC, ['fetchvpcs'])
    const { vpcs } = useNamespacedState(NETWORKVPC, ['vpcs'])
    const { fetchinstances } = useNamespacedActions(INSTANCE, ['fetchinstances'])
    const { instances } = useNamespacedState(INSTANCE, ['instances'])

    function getVpcs() {
      let params = {trial: false};
      if (selectedBillingType.value == "Trial"){
        params = {active_trial: true, trial: true}
      }
      fetchvpcs(params);
    }

    watch(selectedBillingType, (val) => {
      getVpcs()
    });

    onMounted(()=>{
      getVpcs()
      fetchinstances()
    })

    const isHTTPSExists = ref(false)

    const protocolChanges = () => {
      isHTTPSExists.value = rules.value.some(x => x.source.protocol == 'HTTPS')
    }

    const vpcselected = ref(null)
    const instanceselected = ref([])
    const selectInstances = ref([])

    watch(vpcselected, val => {
      let instances = vpcs.value.filter(vpc => vpc.id == val)[0].instances
      instanceselected.value = []
      selectInstances.value = instances.filter(instance => instance.openstack_vm_uuid).map(x => {
        return {
          text: x.name,
          value: x.id
        }
      })
    })
    // vpcs.filter(vpc => vpc.id == vpcselected)[0].instances

    const advanceSettings = reactive({
      algorithm:'ROUND_ROBIN',
      stickysession: 'none',
      healthcheck:{
        target: {
          protocol: 'HTTP',
          port: 80,
          path:'/'
        },
        additionalsettings: {
          checkinterval: 10,
          responsetimeout: 60,
          unhealtythreshold: 2,
          healtythreshold: 2,
        }
      },
      ssl: false,
      proxy: false,
      keepalive: false
    })

    const selectHTTPPathsLength = selectHTTPPaths.value.length
    watch(customPath, (val) => {
      if (customPath.value) {
        if (selectHTTPPaths.value.length == selectHTTPPathsLength) {
          selectHTTPPaths.value.push(val)
          advanceSettings.healthcheck.target.path = val
        }
        else if (selectHTTPPaths.value.length == selectHTTPPathsLength + 1) {
          selectHTTPPaths.value.pop()
          selectHTTPPaths.value.push(val)
          advanceSettings.healthcheck.target.path = val
        }
        setTimeout(() => {
          customPathInput.value.focus()
        }, 50);
      }
      else {
        selectHTTPPaths.value.pop()
        advanceSettings.healthcheck.target.path = '/'
      }
    })

    const $v = useVuelidate(
      {
        selectedBillingType: { required },
        name: {
          required,
          minLength: minLength(5),
        },
        vpcselected: { required, minLength: minLength(1) },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value == "Trial";
          }),
        },
        advanceSettings: {
          healthcheck: {
            target: {
              protocol: { required },
              port: { required, maxValue: maxValue(65535) },
              path: {
                required: requiredIf(() => ['HTTP', 'HTTPS'].includes(advanceSettings.healthcheck.target.protocol) && !customPath.value)
              },
            },
            additionalsettings: {
              healtythreshold: {
                required,
                minValue: minValue(1),
                maxValue: maxValue(9),
              },
              unhealtythreshold: {
                required,
                minValue: minValue(1),
                maxValue: maxValue(9),
              },
              checkinterval: { required },
              responsetimeout: { required },
            },
          }
        },
        selectedCertificate: {
          required: requiredIf((val) => {
            return advanceSettings.ssl
          })
        },
        customPath: {
          required: requiredIf((val) => {
            return ['HTTP', 'HTTPS'].includes(advanceSettings.healthcheck.target.protocol) && !advanceSettings.healthcheck.target.path
          })
        },
      },
      {
        name,
        customPath,
        vpcselected,
        advanceSettings,
        selectedCertificate,
        selectedTrialVoucher,
        selectedBillingType,
      }
    )

    const createLB = async () => {
      $v.value.$touch()

      context.refs.rulesref.forEach(vm=>{
        vm.Touch()
      })

      const ruleserrors = context.refs.rulesref.reduce((t,v)=>{
        return t.concat(v.$v.$errors)
      },[])

      if($v.value.$invalid || ruleserrors.length) return

      const projectID = await libProject.getActiveProjectID()
      const { protocol, path, port } = advanceSettings.healthcheck.target
      const { algorithm, stickysession, ssl } = advanceSettings
      const { checkinterval, responsetimeout, healtythreshold, unhealtythreshold } = advanceSettings.healthcheck.additionalsettings

      const payload = {
        billing_type: selectedBillingType.value,
        name: name.value,
        project_id: projectID,
        region: regionidselected.value.name,
        instance_ids: instanceselected.value,
        vpc_id: vpcselected.value,
        algorithm: algorithm,
        sticky_session: stickysession == 'none' ? '' : stickysession,
        certificate_id: ssl && selectedCertificate.value ? selectedCertificate.value : null,
        health_check: {
          protocol: protocol,
          port: port,
          path: path,
          interval: parseInt(checkinterval),
          timeout: parseInt(responsetimeout),
          max_healthy: parseInt(healtythreshold),
          max_unhealthy: parseInt(unhealtythreshold),
        },
        rules: rules.value.map(rule => {
          return {
            protocol: rule.source.protocol,
            port: rule.source.port,
            instance_protocol: rule.target.protocol,
            instance_port: rule.target.port,
          }
        }),
      }

      if (selectedBillingType.value == "Trial") payload.voucher_id =  selectedTrialVoucher.value
      const response = await createLoadBalancer(payload)
      if (response.status === 200) {
        context.root.$router.push("/network/loadbalancer");
      }
    }

    return {
      ...Composable,
      isHTTPSExists,
      protocolChanges,
      openDialogCreateCertificate,
      instanceSelect,
      loadbalance,
      createLB,
      addRule,
      rules,
      selectregions,
      fetchregions,
      regionidselected,
      editadvanceSettings: ref(false),
      name, vpcs, instances,
      deleteRule, vpcselected, instanceselected,
      advanceSettings,
      $v,
      selectInstances,
      vouchers,
      selectedBillingType,
      selectedTrialVoucher,
      billingTypes,
      customPath,
      customPathInput,
      selectHTTPPaths,
      agree2,
    };
  },
  created() {
    this.fetchregions()
    this.fetchCertificates()
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser"
    })
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
h4 {
  padding-bottom: 10px;
  padding-top: 20px;
}
.v-btn {
  height: 50px !important;
}

.balance-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.balance-content {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 140%;
  color: #a5b3bf;
}

.row {
  align-items: center;
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
  ::v-deep .v-text-field__details{
    position: inherit;
  }
}
td {
  border: none !important;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
.v-radio {
  ::v-deep label {
    white-space: nowrap;
  }
}
</style>

<style>
.balance-table .v-data-table > .v-data-table__wrapper > table {
  border-spacing: 0 16px !important;
}
</style>