<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ headerDelete }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="isLoadingBtn"
              @click="
                () => {
                  dialog = false
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              :disabled="isLoadingBtn"
              :loading="isLoadingBtn"
              @click="doDelete"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, requiredIf } from "@vuelidate/validators";
import { VPN } from "../namespace"

export default defineComponent({
  props: ['value', 'dataValue', 'headerDelete', ],
  setup(props, context) {

    const { deleteIpsec, deleteOpenvpn, deleteUserOpenvpn } = useNamespacedActions(VPN, [ "deleteIpsec", "deleteOpenvpn", "deleteUserOpenvpn"])
    const { isLoadingBtn } = useNamespacedGetters(VPN, ["isLoadingBtn"])
    let currentVpn = JSON.parse(localStorage.getItem('vpn'))

    const name = ref('')

    const textDel = ref('')
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          // textDel.value = ''
        }
        context.emit("close", false)
      }
    })
    const doDelete = async () => {
      // context.emit('delete')
      let payload = {
        id: props.dataValue.id
      }
      // console.log(payload)
      let resp;
      if(props.headerDelete == 'IPsec'){
        resp = await deleteIpsec(payload)
      }else if(props.headerDelete == 'User OpenVPN'){
        let payloadUserOVPN = {
          id_user: props.dataValue.id
        }
        resp = await deleteUserOpenvpn(payloadUserOVPN)
      }else if(props.headerDelete == 'OpenVPN'){
        resp = await deleteOpenvpn(payload)
        // context.root.$store.commit('VPN/setListUserOpenvpn', [])
      }
      dialog.value = false
      // console.log(resp)
      if(resp.status){
        context.emit('refreshTable')
      }else{
        console.log(resp)
      }
    }

    onMounted(() => {
      // console.log(props.dataValue)
      // name.value = props.dataValue.instance_name
    })

    return {
      doDelete,
      textDel,
      name,
      dialog,
      isLoadingBtn
    };
  },
});
</script>