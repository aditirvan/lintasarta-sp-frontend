<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7" id="container">
            <v-row>
              <v-col cols="7">
                <div class="fe-title d-flex align-items-center">
                  {{ headline }} Frontend
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
                placeholder="Frontend Name"
                single-line
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
                <p class="font-weight-bold">Default Backend</p>
                <v-select
                  placeholder="Default Backend"
                  append-icon="mdi-chevron-down"
                  :items="getListBe"
                  item-value="backend_name"
                  :item-text="(val) => {
                    return val.backend_name + ' - ' + val.mode.toUpperCase()
                  }"
                  outlined
                  single-line
                  v-model="default_be"
                  :error-messages="$v.default_be.$errors.length?$v.default_be.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex flex-row align-center">
                <p class="fz-18 mb-0" style="font-weight: 600">
                  Additional Backend
                </p>
                <v-spacer />
                <v-btn large color="success" @click="addBe()">Add Backend
                </v-btn>
              </v-col>
            </v-row>
            <div class="balance-table">
              <v-simple-table >
                <thead>
                  <tr>
                    <th colspan="" style="text-align: center;">Backend Name</th>
                    <th colspan="" style="text-align: center;">Acl Name</th>
                    <th colspan="" style="text-align: center;">
                      Criteria
                      <v-tooltip class="" right max-width="45%">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <p class="white--text my-1">
                      A source of information which allows ACLs to get a piece of information to work with.<br />
                      a. req.hdr(host): returns the value of a given HTTP request header <br />
                      b. path_beg: prefix match <br />
                      c. path_end: suffix match <br />
                      <b>Notes : </b>Path is typically used to match exact file names (e.g. "/login.php"), or directory parts using the derivative forms
                      </p>
                    </v-tooltip>
                    </th>
                    <th colspan="" style="text-align: center;">Value</th>
                    <th colspan="" style="text-align: center;">Condition</th>
                    <th style="text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody class="noborder" v-if="addingFe.length">
                  <additionBe v-for="(data, i) in addingFe" :key="data.id"
                  ref="rulesref"
                  :rule="data"
                  :index="i"
                  @beChanges="beValue"
                  @delete="()=>{
                    deleteBe(i)
                  }"
                  />
                </tbody>
              </v-simple-table>
            </div>
            <br />

            <v-row>
              <v-col cols="12" md="6">
                <p class="font-weight-bold">Bind Address</p>
                <v-select
                  placeholder="Bind Address"
                  append-icon="mdi-chevron-down"
                  :items="itemAddress"
                  outlined
                  single-line
                  v-model="bind_address"
                  :error-messages="$v.bind_address.$errors.length?$v.bind_address.$errors[0].$message:''"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex">
                  <p class="font-weight-bold">Mode</p>
                  <v-spacer></v-spacer>
                  <p>
                    <v-tooltip class="pt-0" right max-width="25%">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <span>
                        1. HTTPS mode using method redirect from HTTP(80) to HTTPS <br />
                        2. Uploading your own security file is required to enable HTTPS mode. The extension must be: <br />
                        a. Certificate file <br />
                        b. Private key file</span>
                    </v-tooltip>
                  </p>
                </div>
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
                <p v-if="mode == 'https'" class="ml-1 mb-0 fz-12 font-italic">
                  *Redirect to HTTPS
                </p>
              </v-col>
              <!-- <v-col cols="12" md="6" class="d-flex align-end" v-if="mode == 'http'">
                <v-checkbox
                  class=""
                  v-model="is_redirect_https"
                ></v-checkbox>
                <p class="font-weight-bold mr-3 pb-2">Enabling Https</p>
                <p>
                  <v-tooltip class="pt-0" right max-width="25%">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>to enable https mode you may use your own ssl certificate by upload file .pem with contain</span>
                  </v-tooltip>
                </p>
              </v-col> -->
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex">
                  <p class="font-weight-bold">Bind Port</p>
                  <v-spacer></v-spacer>
                  <p>
                    <v-tooltip class="pt-0" right max-width="25%">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="grey"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-information
                        </v-icon>
                      </template>
                      <span v-if="mode == 'https'">Allowed ports to this Frontend Configuration are 443, 1024 or more.</span>
                      <span v-else>Allowed ports to this Frontend Configuration are 80, 443, 1024 or more.</span>
                    </v-tooltip>
                  </p>
                </div>
                <v-text-field
                  maxlength="50"
                  placeholder="Port"
                  single-line
                  outlined
                  v-model="bind_port"
                  :error-messages="$v.bind_port.$errors.length?$v.bind_port.$errors[0].$message:''"
                ></v-text-field>
              </v-col>
            </v-row>
           
            <v-row class="my-0 py-0" v-if="mode == 'https'">
              <v-col cols="12" md="6" class="my-0" v-if="headline == 'Create'">
                <p class="font-weight-bold">Certificate File</p>
                <v-file-input
                accept=".cer"
                class="my-0"
                outlined
                prepend-icon=""
                placeholder="Choose your file"
                v-model="ssl_file"
                :error-messages="$v.ssl_file.$errors.length?$v.ssl_file.$errors[0].$message:''"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6" class="my-0" v-else>
                <p class="font-weight-bold">Your Security File</p>
                <v-text-field
                  maxlength="50"
                  single-line
                  outlined
                  disabled
                  v-model="ssl_file"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="my-0 py-0" v-if="mode == 'https'">
              <v-col cols="12" md="6" class="my-0" v-if="headline == 'Create'">
                <p class="font-weight-bold">Key File</p>
                <v-file-input
                accept=".key"
                class="my-0"
                outlined
                prepend-icon=""
                placeholder="Choose your file"
                v-model="key_file"
                :error-messages="$v.key_file.$errors.length?$v.key_file.$errors[0].$message:''"
                ></v-file-input>
              </v-col>
            </v-row>

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
                  @click="createFrontend"
                >
                  <span>{{ headline == 'Edit' ? 'Update' : headline }} Frontend</span>
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
import { onMounted, onUnmounted, ref, watch } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required, numeric, requiredIf, minLength, helpers } from '@vuelidate/validators'
import servers from './servers.vue'
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { SLB } from "../../../network/slb/namespace"
import additionBe from './additionBe.vue'

export default {
  components:{
    additionBe
  },
  setup(props, context) {
    const { harborid } = context.root._route.params;
    const name = ref('')
    const is_redirect_https = ref(false)
    const bind_port = ref('')
    const bind_address = ref('')
    const default_be = ref('')
    const ssl_file = ref(null)
    const key_file = ref(null)

    const mode = ref('')
    const modeItems = ref([
      {
        text: "HTTPS",
        value: "https"
      }, 
      {
        text: "HTTP",
        value: "http"
      }, 
      {
        text: "TCP",
        value: "tcp"
      }
    ])

    watch(mode, (newVal) => {
      if(headline.value == 'Create'){
        if(newVal){
          if(mode.value == 'https'){
            bind_port.value = 443
          }else if(mode.value == 'http'){
            bind_port.value = 80
          }else{
            bind_port.value = ''
          }
        }
      }
    })
    const itemAddress = ref(["Internal", "Internet"])

    const addingFe = ref([])
    const headline = ref('')

    const { fetchBe, createFe, updateFe } = useNamespacedActions(SLB, ["fetchBe", "createFe", "updateFe"])
    const { getListBe, getTotalRowsBe } = useNamespacedGetters(SLB, ["getListBe", "getTotalRowsBe",])
    const { isLoadingBtn } = useNamespacedState(SLB, ["isLoadingBtn"])
    
    const slb_id = localStorage.getItem('slb_id')

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
        bind_port: { required, numeric, $autoDirty: true, portRules: helpers.withMessage(
          ()  => {
            if(mode.value == 'https'){
              return `Allowed ports to this Frontend Configuration are 443, 1024 or more.`;
            }else{
              return `Allowed ports to this Frontend Configuration are 80, 443, 1024 or more.`;
            }
          },
            val => { 
              let valid = true
              if(val.length <= 2){
                if(val != 80){
                  valid = false
                } else if (mode.value == 'https' && val == 80) {
                  valid = false
                }
              }
              else if(val.length == 3){
                if(val != 443){
                  valid = false
                } 
              }
              else if(val.length == 4){
                if(val < 1025){
                  valid = false
                }
              }
              return valid
            }
          )
        },
        default_be: { required},
        bind_address: { required },
        mode: { required},
        ssl_file: {
          $autoDirty: true,
          required: requiredIf(() => {return mode.value == 'https' }) ,

          fileType: helpers.withMessage(
            "File format is not supported",
            val => { 
              let valid = true
              let lengthName = val?.name?.length
              if(lengthName){
                let splitName = val?.name.split('.')
                // if(splitName.length == 2){
                  if(splitName[splitName.length-1] != 'cer'){
                    valid = false
                  }
                // }
                // let type = val?.name.substr(lengthName -4)
                // if(type != '.pem'){
                //   valid = false
                // }
              }
              return valid
            }
          ),
        },
        key_file:{
          $autoDirty: true,
          required: requiredIf(() => {return mode.value == 'https' && headline.value != 'Edit' }) ,
          fileType: helpers.withMessage(
            "File format is not supported",
            val => { 
              let valid = true
              let lengthName = val?.name?.length
              if(lengthName){
                let splitName = val?.name.split('.')
                // if(splitName.length == 2){
                  if(splitName[splitName.length-1] != 'key'){
                    valid = false
                  }
                // }
                // let type = val?.name.substr(lengthName -4)
                // if(type != '.pem'){
                //   valid = false
                // }
              }
              return valid
            }
          ),
        }
      },
      {
        name,
        default_be,
        bind_port,
        bind_address,
        mode,
        ssl_file,
        key_file
      }
    )

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
          resolve(reader.result);
        };

        reader.onerror = function (error) {
          reject(error);
        };
      });
    }

    const old_frontend_name = ref('')

    const createFrontend = async () => {
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
        frontend_name: name.value,
        default_backend: default_be.value,
        mode: mode.value == 'https' ? 'http' : mode.value,
        bind_port: bind_port.value ? parseInt(bind_port.value) : 0,
        // bind_port: mode.value == 'https' ? 80 : parseInt(bind_port.value),
        bind_addr: bind_address.value,
        loging_mode: mode.value == 'https' ? 'http' : mode.value == 'http' ? 'http' : 'tcplog',
        is_ssl: mode.value == 'https' ? true : false,
        is_redirect_https: mode.value == 'https' ? true : false,
        organization_id: proj.organization_id,
        project_id: proj.id,
        rules: []
      }
      if(addingFe.value.length > 0){
        // payload.rules = addingFe.value
        if(headline.value == 'Edit'){
          payload.rules = addingFe.value.map((data, index) => {
            let old_name = {}
            if(data.old_name){
              old_name = { 
                old_name: data.old_name
              }
            }
            return {
              ...old_name,
              name : data.name,
              backend_name : data.backend_name,
              value: data.criterion == 'path_beg' ? '/'+ data.value : data.value,
              criterion: data.criterion,
              cond: data.cond,
              acl_id: data.acl_id ? data.acl_id : index,
              switcingrule_id: data.acl_id ? data.acl_id : index,
            }
          })
        }else{
          payload.rules = addingFe.value.map((data) => {
            return{
              name : data.name,
              backend_name : data.backend_name,
              value: data.criterion == 'path_beg' ? '/'+ data.value : data.value,
              criterion: data.criterion,
              cond: data.cond,
            }
          })
        }
      }
      if(headline.value == 'Edit'){
        payload.old_frontend_name = old_frontend_name.value
        payload.ssl_pem_name = ssl_file.value
      }else{
        if(mode.value == 'https'){
          let lengthName = ssl_file.value.name.length
          let cert_name = ssl_file.value.name.slice(0, lengthName -4)
          let cert_extension = ssl_file.value.name.substr(ssl_file.value.name.length -4)
          let doc_cert = await getBase64(ssl_file.value)
          let split_doc = doc_cert.split(',')
          payload.ssl_cer_file = {
            cer_name: cert_name,
            cer_extension: cert_extension,
            cer_base64: split_doc[1],
          }
          let lengthNameKey = key_file.value.name.length
          let key_name = key_file.value.name.slice(0, lengthNameKey -4)
          let key_extension = key_file.value.name.substr(key_file.value.name.length -4)
          let doc_key = await getBase64(key_file.value)
          let split_key = doc_key.split(',')
          payload.ssl_key_file = {
            key_name: key_name,
            key_extension: key_extension,
            key_base64: split_key[1],
          }
        }
      }
      if(headline.value == 'Create'){
        let resp = await createFe(payload)
        if(resp.status == 200){
          context.root.$router.replace(`/harbor/detail/${harborid}/loadbalancer/config/frontend`);
        }else{
          console.log(resp)
        }
      }else{
        let resp = await updateFe(payload)
        if(resp.status == 200){
          context.root.$router.replace(`/harbor/detail/${harborid}/loadbalancer/config/frontend`);
        }else{
          console.log(resp)
        }
      }
    }

    function beValue(payload){
      if(payload.name){
        addingFe.value[payload.index].name = payload.name
      }
      if(payload.criterion){
        addingFe.value[payload.index].criterion = payload.criterion
      }
      if(payload.value){
        addingFe.value[payload.index].value = payload.value
      }
      if(payload.backend_name){
        addingFe.value[payload.index].backend_name = payload.backend_name
      }
      if(payload.cond){
        addingFe.value[payload.index].cond = payload.cond
      }
    }
    function addBe() {
      addingFe.value.push({
          name : '',
          criterion: '',
          value: '',
          backend_name: '',
          cond: '',
          id: Math.random()
      })
    }
    function deleteBe(index){
      addingFe.value.splice(index,1)
    }

    onMounted(() => {
      let edit = JSON.parse(localStorage.getItem('fe'))
      if(edit){
        let rulesItem = []
        if(edit.rules != null){
          rulesItem = edit.rules.map((x) => {
            return{
              name : x.name,
              backend_name : x.backend_name,
              value: x.criterion == 'path_beg' ? x.acl_value.slice(1) : x.acl_value,
              criterion: x.criterion,
              cond: x.switching_rule_cond,
              old_name: x.name,
              acl_id: x.acl_id,
              switcingrule_id: x.acl_id,
              id: Math.random()
            }
          })
        }else{
          rulesItem = []
        }
        headline.value = "Edit"
        ssl_file.value = edit.cert_name
        old_frontend_name.value = edit.frontend_name
        name.value = edit.frontend_name
        default_be.value = edit.default_backend
        bind_address.value = edit.bind_address
        bind_port.value = edit.bind_port
        mode.value = edit.mode
        addingFe.value = rulesItem
      }else{
        headline.value = "Create"
      }
      let payload = {
        slb_id: slb_id,
        itemsPerPage: 100
      }
      headline.value == 'Edit' ? payload.mode = mode.value : payload.mode = 'all'
      fetchBe(payload)
    })

    onUnmounted(() => {
      localStorage.removeItem('fe')
    })

    return{
      name,
      mode,
      default_be,
      modeItems,
      bind_port,
      bind_address,
      is_redirect_https,
      addingFe,
      beValue,
      addBe,
      deleteBe,
      createFrontend,
      getListBe,
      headline,
      itemAddress,
      isLoadingBtn,
      ssl_file,
      key_file,
      $v
    }
  },
  beforeRouteEnter(to, from, next) {
    const dataFe = localStorage.getItem('fe')
    if (to.name == "editfe") {
      if (dataFe) {
        next();
      } else {
        next("/network/slb/config/frontend");
      }
    } else {
      next();
    }
  },
}
</script>

<style lang="scss" scoped>
.fe-title {
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