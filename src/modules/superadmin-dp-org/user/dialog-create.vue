<template>
  <v-dialog max-width="850" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ !item ? 'Create' : 'Edit' }} User</div>
      </v-card-text>
      <v-card-text>
        <span class="font-weight-bold">Credentials</span>
        <div class="d-flex">
          <v-row>
            <v-col md="3" sm="12">
              <p class="font-weight-bold">User Name</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-text-field
              :disabled="item?true:false"
              placeholder="Username"
              flat
              outlined
              v-model="username"
              :error-messages="$v.username.$errors.length ? $v.username.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-row class="d-flex">
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Password</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            placeholder="password"
            flat
            outlined
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            :error-messages="$v.password.$errors.length ? $v.password.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="d-flex">
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Confirm Password</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            placeholder="Confirm Password"
            flat
            outlined
            v-model="confirmPassword"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            :error-messages="$v.confirmPassword.$errors.length ? $v.confirmPassword.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="d-flex">
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Enable</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-checkbox
            class="mt-0"
            v-model="enableCheck"
            hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row class="d-flex">
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Configure user's quota</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-switch
            v-model="configureQuota"
            class="pt-0 mt-0"
            inset
            hide-details
            >
            </v-switch>
            <p>Upon successful user's data save. redirect to user's quota section</p>
          </v-col>
        </v-row>

        <span class="font-weight-bold">Role</span>
        <v-row class="d-flex">
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Available Roles</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-autocomplete
            v-model="role"
            placeholder="Select a role"
            :items="roles"
            outlined
            single-line
            item-text="name"
            item-value="name"
            return-object
            :error-messages="$v.role.$errors.length ? $v.role.$errors[0].$message : ''"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <span class="font-weight-bold">Contact Info</span>
        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Full Name</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            v-model="fullName"
            placeholder="Full Name"
            flat
            outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Email Address</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            v-model="email"
            placeholder="Email Address"
            flat
            outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Phone Number</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            v-model="phoneNumber"
            type="number"
            placeholder="Phone Number"
            flat
            outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">IM</p>
          </v-col>
          <v-col md="9" sm="12">
            <v-text-field
            v-model="im"
            placeholder="IM"
            flat
            outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <span class="fonrt-weight-bold">Quotas</span>
        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">All VMs Quota</p>
          </v-col>
          <v-col md="7" sm="10">
            <v-text-field
            v-model="quotaAll"
            :disabled="unlimitedAll"
            type="number"
            placeholder="All VMs Quota"
            flat
            outlined
            :error-messages="$v.quotaAll.$errors.length ? $v.quotaAll.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2">
            <v-checkbox
            v-model="unlimitedAll"
            @change="unlimitedAll == true ? quotaAll = null : ''"
            label="Unlimited"
            class="mt-0"
            hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3" sm="12">
            <p class="font-weight-bold">Running VMs Quota</p>
          </v-col>
          <v-col md="7" sm="10">
            <v-text-field
            v-model="quotaRun"
            :disabled="unlimitedRun"
            type="number"
            placeholder="Running VMs Quota"
            flat
            outlined
            :error-messages="$v.quotaRun.$errors.length ? $v.quotaRun.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
          <v-col md="2" sm="2">
            <v-checkbox
            v-model="unlimitedRun"
            @change="unlimitedRun == true ? quotaRun = null : ''"
            label="Unlimited"
            class="mt-0"
            hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="45"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            :loading="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="secondary"
            @click="() => { create() }"
            >
            {{ !item ? 'Create' : 'Save' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers, requiredIf, minValue  } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGDP } from '../namespace';

export default {
  props: ['value', 'item'],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { fetchRoles, createUser, updateUser } = useNamespacedActions(ORGDP, ["fetchRoles", "createUser", "updateUser"])
    const { roles, isLoadingBtn } = useNamespacedGetters(ORGDP, ["roles", "isLoadingBtn"])

    onMounted(() => {
      // console.log(props.item)
      detailOrg.value = JSON.parse(localStorage.getItem('orgDP'))
      if(props.item) {
        username.value = props.item.name
        enableCheck.value = props.item.isEnabled
        role.value = props.item.role
        fullName.value = props.item.fullName ? props.item.fullName : null
        email.value = props.item.emailAddress ? props.item.emailAddress : null
        phoneNumber.value = props.item.telephone ? props.item.telephone : null
        im.value = props.item.im ? props.item.im : null
        unlimitedAll.value = props.item.storedVmQuota == 0 ? true : false
        unlimitedRun.value = props.item.deployedVmQuota == 0 ? true : false
        quotaAll.value = props.item.storedVmQuota == 0 ? null : props.item.storedVmQuota
        quotaRun.value = props.item.deployedVmQuota == 0 ? null : props.item.deployedVmQuota
      }
      fetchRoles({page: 1, itemsPerPage: 10, idOrg: detailOrg.value.id })
    })
    
    const detailOrg = ref()
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const enableCheck = ref(true)
    const configureQuota = ref(true)
    const role = ref('')
    const fullName = ref('')
    const email = ref(null)
    const phoneNumber = ref(null)
    const im = ref(null)
    const quotaAll = ref()
    const quotaRun = ref()
    const unlimitedRun = ref(true)
    const unlimitedAll = ref(true)

    const $v = useVuelidate(
      {
        username: { required },
        password: {
          required: requiredIf(() => !props.item),
          $autoDirty: true,
          minLength: minLength(8),
        },
        confirmPassword: {
          $autoDirty: true,
          required: requiredIf(() => !props.item),
          confirm: helpers.withMessage(
            "The value must be the same as the password",
            val => { 
              let valid = true
              if(val != password.value){
                valid = false
              }
              return valid
            }
          ) 
        },
        role: { required },
        // fullName: { required },
        // email: { required },
        // phoneNumber: { required },
        // im: { required },
        quotaAll: { 
          // required: requiredIf(() => unlimitedAll.value == false)
          rules: helpers.withMessage(
          ({$model})  => {
            if(!$model){
              return 'value is required'
            }else{
              return 'The Running VMs Quota must be less than the Total VMs Quota'
            }
          },
            val => { 
              if(!unlimitedAll.value){ // kalo ALL GA DICEKLIS
                if(!unlimitedRun.value){ // kalo RUN GA DICEKLIS
                  if(!val){
                    return false
                  }else{
                    if(parseInt(val) < parseInt(quotaRun.value)){
                      // console.log('all lebih kecil dari run')
                      return false
                    }else{
                      return true
                    } 
                  }
                }else{
                  // console.log('unlimited')
                  return false
                }
              }else{
                return true
              }
            }
          )
        },
        quotaRun: {
          minValue: minValue(1),
          required: requiredIf(() => unlimitedRun.value == false)
        },
      },
      {
        username,
        password,
        confirmPassword,
        role,
        // fullName,
        // email,
        // phoneNumber,
        // im,
        quotaAll,
        quotaRun
      })

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const create = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      // console.log(role.value)
      // let detailOrg = JSON.parse(localStorage.getItem('orgDP'))
      let payload =  {
        idOrg: splitIOrgId(detailOrg.value.id),
        value: {
          name: username.value,
          password: password.value,
          isEnabled: enableCheck.value,
          role: role.value,
          // {
          //   vCloudExtension: null,
          //   href: role.value.href,
          //   type: "application/vnd.vmware.admin.role+xml",
          //   link: null
          // },
          fullName: fullName.value,
          emailAddress: email.value,
          telephone: phoneNumber.value,
          im: im.value,
          storedVmQuota: !unlimitedAll.value ? parseInt(quotaAll.value) : 0,
          deployedVmQuota: !unlimitedRun.value ? parseInt(quotaRun.value) : 0,
        }
      }
      // console.log(payload)
      let resp
      if(!props.item){
        resp = await createUser(payload)
      }else{
        payload.idUser = splitIOrgId(props.item.id)
        resp = await updateUser(payload)
      }
      if(resp.status){
        dialog.value = false
        context.emit('refreshPage')
      }
    }

    return {
      dialog,
      show: ref(false),
      show1: ref(false),
      username,
      password,
      confirmPassword,
      enableCheck,
      unlimitedRun,
      unlimitedAll,
      configureQuota,
      role,
      fullName,
      email,
      phoneNumber,
      im,
      quotaAll,
      quotaRun,
      $v,
      create,
      roles,
      isLoadingBtn
    }
  },
}
</script>