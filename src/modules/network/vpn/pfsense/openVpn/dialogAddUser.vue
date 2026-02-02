<template>
  <v-dialog v-model="dialog" max-width="1000">
    <v-card>
      <v-card-text class="pt-6">
        <create-user
        v-model="create_user"
        />
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
            @click="createUserOVPN"
            >Create</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { ref } from '@vue/composition-api';
import CreateUser from './createUser.vue'
import useVuelidate from '@vuelidate/core';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from '../../namespace';

export default {
  components: {
    CreateUser
  },
  props: ["value"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { addUserOpenVpn, } = useNamespacedActions(VPN, ["addUserOpenVpn", ])
    const { isLoadingBtn } = useNamespacedGetters(VPN, ["isLoadingBtn"])

    let currentVpn = JSON.parse(localStorage.getItem('vpn'))

    const create_user = ref({
      username: '',
      password: '',
      confirm_password: '',
      expires: '',
      // descr: ''
    })
    
    const $v = useVuelidate({})
    const createUserOVPN = async() => {
      $v.value.$touch()
      if ($v.value.$errors.length) return
      let [tahun, bulan, tgl] = create_user.value.expires.split('-')
      let payload = {
        username: create_user.value.username,
        password: create_user.value.password,
        expires: `${bulan}/${tgl}/${tahun}`,
        instance_vpn: currentVpn.instance_name
      }
      let resp = await addUserOpenVpn(payload)
      // console.log(resp)
      dialog.value = false
      if(resp.status == 200){
        context.emit('refreshTable')
      }else{
        console.log(resp)
      }
    }

    return{
      dialog,
      create_user,
      $v,
      createUserOVPN,
      isLoadingBtn
    }
  },
}
</script>