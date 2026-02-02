<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card ref="form" class="pt-7">
        <v-card-text>
          <div class="headline font-weight-bold font--text">Create Floating IP</div>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Network</p>
            <v-select
            placeholder="Choose a Network"
            append-icon="mdi-chevron-down"
            :items="networks"
            item-text="name"
            item-value="instance_id"
            return-object
            v-model="network"
            outlined
            single-line
            :error-messages="$v.network.$errors.length ? $v.network.$errors[0].$message : ''"
            >
            </v-select>
        </v-card-text>
        <!-- <v-card-text>
          <p class="font-weight-bold">Port</p>
            <v-text-field
            maxlength="100"
            v-model="port"
            placeholder="Port"
            flat
            outlined
            :error-messages="$v.port.$errors.length ? $v.port.$errors[0].$message : ''"
            ></v-text-field>
        </v-card-text> -->
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn
              depressed
              height="45"
              block
              class="accent"
              :disabled="isLoadingBtn"
              @click="
                () => {
                  dialog = false
                }
              "
              >Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              :loading="isLoadingBtn"
              :disabled="isLoadingBtn"
              @click="create"
              >Create</v-btn>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { NETWORKVPC } from "../namespace.ts";
import { useDialog } from '@/composable/usedialog';
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core';
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';

export default {
  props:["value", "vyos"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { createInterface, DETAIL_VPC2 } = useNamespacedActions(NETWORKVPC, [
      "createInterface",
      "DETAIL_VPC2"
    ]);
    const { 
      isLoadingBtn,
      vpc
      } = useNamespacedState(NETWORKVPC, [
      "isLoadingBtn",
      "vpc"
    ]);

    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
    const port = ref('')
    const network = ref('')
    const networks = ref([])
    // watch(network, (newVal) => {
    //   console.log(newVal)
    // })

    const $v = useVuelidate(
      {
        // port: { required },
        network: { required }
      },
      {
        // port,
        network
      })
    const create = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let os_project_id = currentProj.openstack_project_id
      let project_id = currentProj.id
      let org_id = currentProj.organization_id
      let user_id = JSON.parse(localStorage.getItem('userId'))
      const payload = {
        instance_id: network.value.instance_id,
        instance_name: network.value.name,
        // instance_port: port.value,
        openstack_project_id: os_project_id,
        organization_id: org_id,
        project_id: project_id,
        user_id: user_id
      }
      // console.log(payload)
      let resp = await createInterface(payload)
      if(resp.status == 200){
        dialog.value = false
        context.emit('refreshTab')
      }else{
        console.log(resp)
      }
    }

    onMounted(async() =>{
      await DETAIL_VPC2({id: props.vyos.vpc_id})
      networks.value = [vpc.value.vyos]
    })

    return{
      dialog,
      create,
      $v,
      port,
      isLoadingBtn,
      network,
      networks
    }
  },
}
</script>