<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-text class="pt-6">
        <h2>Edit {{ title == 'exp' ? 'Expiration Date' : title == 'password' ? 'Password' : title }}</h2>
      </v-card-text>
      <v-card-text class="">
        <v-row>
          <v-col cols="12" md="12">
            <p class="font-weight-bold">Username</p>
            <v-text-field
            maxlength="50"
            placeholder="Username"
            single-line
            outlined
            v-model="username"
            readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="title == 'password'">
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Password</p>
            <v-text-field
            maxlength="50"
            placeholder="Password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            single-line
            outlined
            v-model="pass"
            :error-messages="$v.pass.$errors.length?$v.pass.$errors[0].$message:''"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <p class="font-weight-bold">Confirm Password</p>
            <v-text-field
            maxlength="50"
            placeholder="Password"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
            single-line
            outlined
            v-model="confirmPass"
            :error-messages="$v.confirmPass.$errors.length?$v.confirmPass.$errors[0].$message:''"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="title == 'exp'">
          <v-col cols="12" md="12">
            <p class="font-weight-bold">Expiration date</p>
            <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
              <v-text-field
              v-model="dateFormatted"
              label="Choose a Date"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              :error-messages="$v.expires.$errors.length?$v.expires.$errors[0].$message:''"
              ></v-text-field>
              </template>
              <v-date-picker
              :min="min_date"
              :show-current="min_date"
              v-model="expires"
              @change="menu2 = !menu2"
              color="primary"
              ></v-date-picker>
            </v-menu>
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
            :loading="isLoadingBtn"
            :disabled="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="secondary"
            @click="updateAct"
            >Update</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { computed, onMounted, ref } from '@vue/composition-api';
import moment from 'moment';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf, helpers, minLength } from '@vuelidate/validators'
import { VPN } from '../../namespace';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props: ["value", "itemSelected", "title"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { updateUserOpenVpn, updateUserOpenVpnNew } = useNamespacedActions(VPN, ["updateUserOpenVpn", "updateUserOpenVpnNew"])
    const { getListOpenVpn, isLoading, isLoadingBtn } = useNamespacedGetters(VPN, 
    ["getListOpenVpn", "isLoading", "isLoadingBtn"])

    const username = ref()
    const min_date = ref()
    const expires = ref()
    const pass = ref('')
    const confirmPass = ref('')
    const formatDate = (date) => {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    const dateFormatted = computed(() => {
      return formatDate(expires.value)
    })

    const $v = useVuelidate({
      expires:{ required },
      pass: {
        required: requiredIf(() => props.title == 'password'),
        $autoDirty: true,
        minLength: minLength(8),
        // uppercase: {
        //   $message: "Must contains at least one uppercase character",
        //   $validator: (val) => {
        //     if(props.title != 'password'){
        //       return true
        //     }else{
        //       return /^(?=.*[A-Z])/g.test(val);
        //     }
        //   },
        // },
        // lowercase: {
        //   $message: "Must contains at least one lowercase character",
        //   $validator: (val) => {
        //     if(props.title != 'password'){
        //       return true
        //     }else{
        //       return /^(?=.*[a-z])/g.test(val);
        //     }
        //   },
        // },
        // numeric: {
        //   $message: "Must contains at least one numeric character",
        //   $validator: (val) => {
        //     if(props.title != 'password'){
        //       return true
        //     }else{
        //       return /^(?=.*[0-9])/g.test(val);
        //     }
        //   },
        // },
        // symbol: {
        //   $message: "Must contains at least one symbol (!@#$%^&*)",
        //   $validator: (val) => {
        //     if(props.title != 'password'){
        //       return true
        //     }else{
        //       return /^(?=.*[!@#$%^&*])/g.test(val);
        //     }
        //   },
        // },
      },
      confirmPass:{
          $autoDirty: true,
          required: requiredIf(() => props.title == 'password'),
          confirmPass: helpers.withMessage(
            "The value must be the same as the password",
            val => { 
              let valid = true
              if(val != pass.value){
                valid = false
              }
              return valid
            }
          ) 
        },
      },
      {
        expires,
        pass,
        confirmPass
      })
    
    const updateAct = async() => {
      $v.value.$touch()
      // console.log($v.value)
      if ($v.value.$errors.length) return
      
      let [tahun, bulan, tgl] = expires.value.split('-')
      let payload = {
        username: username.value,
        password: props.title == 'exp' ? props.itemSelected.password : pass.value,
        expires:  props.title == 'exp' ? `${bulan}/${tgl}/${tahun}` : props.itemSelected.expires,
        id_user: props.itemSelected.id
      }
      // console.log(payload)
      let resp = await updateUserOpenVpnNew(payload)
      dialog.value = false
      // console.log(resp)
      if(resp.status == 200){
        context.emit('refreshTable')
      }else{
        console.log(resp)
      }
      // if(props.title == 'exp'){
      //   payload.expires = expires.value
      //   payload.descr = props.itemSelected.descr
      //   payload.open_vpn_id = getListOpenVpn.value[0].id
      //   payload.id = ''
      //   payload.password = ''
      //   payload.disabled = false
      // }else if(props.title == 'password'){
      //   payload.password = pass.value
      // }

    }
    onMounted(() =>{
      // console.log(props)
      username.value = props.itemSelected.username
      expires.value = moment(props.itemSelected.expires).format('YYYY-MM-DD')
      min_date.value = moment(props.itemSelected.expires).format('YYYY-MM-DD')
    })
    return{
      dialog,
      menu2: ref(false),
      dateFormatted,
      min_date,
      username,
      expires,
      $v,
      show1: ref(false),
      show2: ref(false),
      pass,
      confirmPass,
      updateAct,
      isLoadingBtn
    }
  },
}
</script>