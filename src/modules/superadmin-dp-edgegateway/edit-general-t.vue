<template>
  <v-dialog max-width="800" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit General Settings</div>
      </v-card-text>

      <v-card-text>
        <General 
        v-model="generalVarT"
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
            @click="update"
            >
            Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { EDGEGATEWAY } from './namespace'
import General from './step-create/type-T/general.vue'
import { onMounted, reactive, ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core'

export default {
  components: {
    General
  },
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { updateEdgeGatewayT } = useNamespacedActions(EDGEGATEWAY, ["updateEdgeGatewayT"])
    const { isLoadingBtn, } = useNamespacedGetters(EDGEGATEWAY, ["isLoadingBtn"])

    onMounted(() => {
      // console.log(props)
      generalVarT.general.name = props.item?.name
      generalVarT.general.description = props.item?.description
      generalVarT.general.enabledDedicateTier = props.item?.edgeGatewayUplinks[0]?.dedicated
      generalVarT.general.connected = props.item?.edgeGatewayUplinks[0]?.connected
      generalVarT.general.nonDistributedRouting = props.item?.nonDistributedRoutingEnabled
    })

    const generalVarT = reactive({
      general: {
        name: '',
        description: '',
        enabledDedicateTier: false,
        connected: false,
        nonDistributedRouting: false
      }
    })
    const $v = useVuelidate()

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const update = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let payload ={
        id: props.item.id,
        value: {
          ...props.item,
          name: generalVarT.general.name,
          description: generalVarT.general.description,
          nonDistributedRoutingEnabled: generalVarT.general.nonDistributedRouting,
          edgeGatewayUplinks:[{
            ...props.item.edgeGatewayUplinks[0],
            connected: generalVarT.general.connected,
            dedicated: generalVarT.general.enabledDedicateTier
          }]
        }
      }
      console.log(payload)
      let resp = await updateEdgeGatewayT(payload)
      if(resp.status){
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}/project/${context.root.$route.params.project}`);
      }
    }
    
    return{
      isLoadingBtn,
      dialog,
      update,
      generalVarT
    }
  },
}
</script>