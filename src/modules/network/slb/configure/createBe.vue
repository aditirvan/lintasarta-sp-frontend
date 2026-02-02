<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7" id="container">
            <v-row>
              <v-col cols="7">
                <div class="be-title d-flex align-items-center">
                  {{ headline }} Backend
                </div>
                <div class="balance-content pt-4">

                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field
                :disabled="headline == 'Edit'"
                maxlength="50"
                placeholder="Insert Name"
                outlined
                v-model="name"
                :error-messages="
                  $v.name.$errors.length
                    ? $v.name.$errors[0].$message
                    : ''
                "
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Load Balance Method</p>
                <v-select
                  placeholder="Method"
                  append-icon="mdi-chevron-down"
                  :items="methodItems"
                  v-model="method"
                  outlined
                  single-line
                  :error-messages="$v.method.$errors.length?$v.method.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Mode</p>
                <v-select
                  placeholder="Mode"
                  append-icon="mdi-chevron-down"
                  :items="modeItems"
                  :disabled="headline == 'Edit'"
                  v-model="mode"
                  outlined
                  single-line
                  :error-messages="$v.mode.$errors.length?$v.mode.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

          <!-- Show when HTTP -->
            <!-- <v-row v-if="mode == 'http'">
              <p class="mt-3 mx-3">Forward for Mode?</p>
              <v-col cols="12" md="6">
                <v-radio-group
                row
                class="my-0 py-0"
                v-model="forwardMode"
                >
                  <v-radio
                    label="Enabled"
                    value="enabled"
                  ></v-radio>
                  <v-radio
                    label="Disabled"
                    value="disabled"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row> -->
            <!-- End Show when HTTP -->

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Advance Check</p>
                <v-select
                  placeholder="Advance Check"
                  append-icon="mdi-chevron-down"
                  :items="advItems"
                  v-model="adv_check"
                  outlined
                  single-line
                  :error-messages="$v.adv_check.$errors.length?$v.adv_check.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row v-if="mode == 'http'">
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Http Check Method</p>
                <v-select
                  placeholder="Method"
                  append-icon="mdi-chevron-down"
                  :items="httpmethodItems"
                  v-model="http_method"
                  outlined
                  single-line
                  :error-messages="$v.http_method.$errors.length?$v.http_method.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row v-if="mode == 'http'">
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Http Check URI</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert URI"
                  single-line
                  outlined
                  prefix="/"
                  v-model="httpUri"
                  :error-messages="$v.httpUri.$errors.length?$v.httpUri.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Port</p>
                <v-text-field
                  maxlength="50"
                  placeholder="Insert Port"
                  single-line
                  outlined
                  v-model="port"
                  :error-messages="$v.port.$errors.length?$v.port.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row> -->

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Servers
                </p>
                <v-spacer />
                <v-btn depressed color="success" width="125" @click="addAlghoritm()"
                  >Add Servers
                </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table >
                <thead>
                  <tr>
                    <th colspan="2" style="text-align: center;">Server Name</th>
                    <th colspan="" style="text-align: center;">Server Port</th>
                    <th colspan="" style="text-align: center;">Max Connection</th>
                    <th colspan="" style="text-align: center;">Weight</th>
                    <th style="text-align: center;" v-if="servers.length > 1">Action</th>
                  </tr>
                </thead>
                <tbody class="noborder">
                  <servers v-for="(server, i) in servers" :key="server.id"
                  ref="rulesref"
                  :rule="server"
                  :index="i"
                  :lengthData="servers.length"
                  :instances="instanceDisabled"
                  :totalWeight="totalWeight"
                  :equalWeight="sumWeight"
                  @serverChanges="serverValue"
                  @delete="()=>{
                    deleteAlghoritm(i)
                  }"
                  />
                  <!-- <tr>
                    <td class="py-0"></td>
                    <td class="py-0"></td>
                    <td class="py-0"></td>
                    <td class="py-0"></td>
                    <td colspan="" class="py-0">
                      <v-btn
                        height="50"
                        color="red"
                        outlined
                        block
                        depressed
                        dense
                        @click="equalWeight"
                        >Equal Weight</v-btn
                      >
                    </td>
                  </tr> -->
                </tbody>
              </v-simple-table>
            </div>
            <v-row class="d-flex justify-end">
              <v-col cols="12" md="6">
                <v-btn
                  :disabled="isLoadingBtn"
                  block
                  class="accent fz-14"
                  @click="$router.go(-1)"
                >
                  <span>Cancel</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  :loading="isLoadingBtn"
                  :disabled="isLoadingBtn"
                  block
                  class="secondary fz-14"
                  @click="createBackend"
                >
                  <span>{{ headline == 'Edit' ? 'Update' : headline }} Backend</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, watch, ref, onMounted, onUnmounted } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required, requiredIf, minLength } from '@vuelidate/validators'
import servers from './servers.vue'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { SLB } from "../namespace"

export default {
  components: {
    servers
  },
  setup(props,context) {
    
    const name = ref('')
    const method = ref('')
    const methodItems = ref([
      {
        text: 'Roundrobin',
        value: 'roundrobin'
      },
      {
        text: 'Least Connection',
        value: 'leastconn'
      },
      {
        text: 'Source',
        value: 'source'
      },
    ])

    const mode = ref('')
    const modeItems = ref([
      {
        text: "HTTP",
        value: "http"
      }, 
      {
        text: "TCP",
        value: "tcp"
      }
    ])

    const adv_check = ref('')
    const advHttpItems = ref(["httpchk"])
    const advTcpItems = ref([
      {
        value: "ssl-hello-chk",
        text: "SSL Hello Check"
      }, 
      {
        value: "tcp-check",
        text: "TCP Check"
      }
      // "ssl-hello-chk","tcp-check"
      ])
    const advItems = ref([])
    const httpmethodItems = ref(["GET", "POST"])
    const http_method = ref('')
    const httpUri = ref('')
    const port = ref()
    // const forwardMode = ref('disabled')
    const servers = ref([])
    const headline = ref('')
    const sumWeight = ref()

    const { createBe, updateBe, fetchInstance } = useNamespacedActions(SLB, ["createBe", "updateBe", "fetchInstance"])
    const { isLoadingBtn, instanceSlb} = useNamespacedState(SLB, ["isLoadingBtn", "instanceSlb"])


    const instancesValue = ref([])

    const $v = useVuelidate(
      {
        name: { 
          required,
          $autoDirty: true,
          conditional: {
            $message: "Can only contains alphabet and underscore",
            $validator: (val) => {
                return /^[a-zA-Z_]+$/g.test(val);
            },
          },
        },
        method: {required},
        mode: { required },
        adv_check: { required },
        // port: { required },
        http_method: { required: requiredIf( () => { return mode.value == 'http'})},
        httpUri: { required: requiredIf( () => { return mode.value == 'http'})}
      },
      {
        name,
        method,
        mode,
        adv_check,
        port,
        http_method,
        httpUri
      }
    )

    const createBackend = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let proj = JSON.parse(localStorage.getItem('currentProj'))
      let payload = {
        user_id: JSON.parse(localStorage.getItem('userId')),
        slb_id: localStorage.getItem('slb_id'),
        backend_name: name.value,
        balance_algorithm: method.value,
        mode: mode.value,
        port: 1,
        http_check: adv_check.value == 'httpchk' ? true : false,
        adv_check: adv_check.value,
        organization_id: proj.organization_id,
        project_id: proj.id,
        forward_for_mode: 'enabled',
        server: []
      }
      // mode.value == 'http' ? payload.forward_for_mode = 'enabled' : ''
      if(payload.http_check == true){
        payload.http_check_method = http_method.value
        payload.http_check_uri = '/' + httpUri.value
      }
      if(servers.value.length > 0){
        // payload.server = servers.value
        if(headline.value == 'Edit'){
          payload.server = servers.value.map((x, i) => {
            let old_name = {}
            let slb_id = {}
            if(x.old_server_name){
              old_name = {
                old_server_name: x.old_server_name,
              }
            }
            if(x.slb_config_backend_server_id){
              slb_id = {
                slb_config_backend_server_id: x.slb_config_backend_server_id,
              }
            }
            return{
              ...old_name,
              ...slb_id,
              server_name : x.server_name === 'other' ? x.server_name_custom : x.server_name,
              server_port: x.server_port,
              server_max_conn: x.server_max_conn,
              server_weight: x.server_weight,
              server_address: x.server_name === 'other' ? x.server_address_custom : x.server_address,
              is_custom : x.server_name === 'other' ? true : false
            }
          })
        }else{
          payload.server = servers.value.map((x) => {
            return{
              server_name : x.server_name === 'other' ? x.server_name_custom : x.server_name,
              server_port: x.server_port,
              server_max_conn: x.server_max_conn,
              server_weight: x.server_weight,
              server_address: x.server_name === 'other' ? x.server_address_custom : x.server_address,
              is_custom : x.server_name === 'other' ? true : false
            }
          })
        }
      }
      if(headline.value == 'Create'){
        let resp = await createBe(payload)
        if(resp.status == 200){
          context.root.$router.replace("/network/slb/config/backend");
        }else{
          console.log(resp)
        }
      }else{
        let resp = await updateBe(payload)
        if(resp.status == 200){
          context.root.$router.replace("/network/slb/config/backend");
        }else{
          console.log(resp)
        }
      }
    }

    //tangkap value dari Servers(child)
    function serverValue(payload){
      if(payload.name){
        if (payload.name.value === 'other') {
          servers.value[payload.index].server_name = payload.name.value
        } else {
          servers.value[payload.index].server_name = payload.name.instanceName
          servers.value[payload.index].server_address = payload.name.ipv4
        }
      }
      if(payload.customName){
        servers.value[payload.index].server_name_custom = payload.customName
        servers.value[payload.index].server_address_custom = payload.customAddress
      }
      if(payload.port){
        servers.value[payload.index].server_port = parseInt(payload.port)
      }
      if(payload.max_conn){
        servers.value[payload.index].server_max_conn = parseInt(payload.max_conn)
      }
      if(payload.weight){
        servers.value[payload.index].server_weight = parseInt(payload.weight)
      }
    }

    //filter server/instance yg udah dipilih di servers(child)
    const instanceDisabled = computed(()=>{
      if(instanceSlb.value.server_name != 'other'){
        return instanceSlb.value.map(item =>{
          return {
            ...item,
            disabled: servers.value.some(server => server.server_name == item.instanceName)
          }
        })  
      }
    })
    //sum weight di servers(child)
    const totalWeight = computed(() =>{
      return servers.value.reduce((a, b) => parseInt(a) + parseInt(b.server_weight),0)
    })

    const equalWeight = () => {
      let rowWeight = servers.value.length
      sumWeight.value = Math.floor(100/rowWeight)
    }

    function addAlghoritm() {
      servers.value.push({
          server_name : '',
          server_port: null,
          server_max_conn: null,
          server_weight: null,
          server_address: '',
          id: Math.random(),
          server_name_custom : '',
          server_address_custom : '',
      })
    }
    function deleteAlghoritm(index){
      servers.value.splice(index,1)
    }

    watch(mode, (newVal) => {
      if(newVal== "http"){
        advItems.value = advHttpItems.value
      }else if(newVal== "tcp"){
        advItems.value = advTcpItems.value
      }
    })
    watch(advItems, (newVal) => {
      if(mode.value == 'http'){
        if(!newVal.includes(adv_check.value)){
          adv_check.value = ''
        }
      }
    })

    onMounted( async () => {
      await fetchInstance()
      // untuk penambahan other di pilih server ketika tier glb
      if (JSON.parse(localStorage.getItem('slb')).tier === 'glb') {
        instanceSlb.value.push({text: 'Other', value: 'other'})
      }
      let edit = JSON.parse(localStorage.getItem('be'))
      if(edit){
        let serverItem = []
        if(edit.servers != null && edit.servers.length){
          serverItem = edit.servers.map((x) => {
            return{
              server_name : x.is_custom ? 'other' : x.server_name,
              server_port: x.server_port,
              server_max_conn: x.server_max_conn,
              server_weight: x.server_weight,
              server_address: x.server_address,
              old_server_name: x.server_name,
              slb_config_backend_server_id: x.slb_config_backend_id,
              id: Math.random(),
              server_name_custom : x.is_custom ? x.server_name : '',
              server_address_custom :  x.is_custom ? x.server_address : '',
            }
          })
        }
        headline.value = "Edit"
        name.value = edit.backend_name
        method.value = edit.balance_algorithm
        mode.value = edit.mode
        adv_check.value = edit.adv_check
        servers.value = serverItem
        httpUri.value = edit.http_check_uri.slice(1)
        http_method.value = edit.http_check_mode
      }else{
        servers.value.push({
          server_name : '',
          server_port: null,
          server_max_conn: null,
          server_weight: null,
          server_address: '',
          id: Math.random(),
          server_name_custom : '',
          server_address_custom : '',
      })
        headline.value = "Create"
      }
    })

    onUnmounted(() => {
      localStorage.removeItem('be')
    })

    return {
      name,
      method,
      methodItems,
      mode,
      // forwardMode,
      port,
      modeItems,
      adv_check,
      advItems,
      http_method,
      httpUri,
      httpmethodItems,
      servers,
      headline,
      addAlghoritm,
      deleteAlghoritm,
      serverValue,
      createBackend,
      isLoadingBtn,
      $v,
      instancesValue,
      instanceDisabled,
      totalWeight,
      sumWeight,
      equalWeight,
      instanceSlb
    }
  },
  beforeRouteEnter(to, from, next) {
    const dataBe = localStorage.getItem('be')
    if (to.name == "editbe") {
      if (dataBe) {
        next();
      } else {
        next("/network/slb/config/backend");
      }
    } else {
      next();
    }
  },
}
</script>

<style lang="scss" scoped>
.be-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
.v-input--is-disabled{
  ::v-deep .v-input__slot{
    background: #F2F2F2
  }
}
</style>