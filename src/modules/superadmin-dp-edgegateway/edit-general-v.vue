<template>
  <v-dialog max-width="800" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit General Settings</div>
      </v-card-text>

      <v-card-text>
        <General 
        v-model="generalVar"
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
import General from './step-create/general.vue'
import { onMounted, ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core'

export default {
  components: {
    General
  },
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { updateEdgeGatewayV } = useNamespacedActions(EDGEGATEWAY, ["updateEdgeGatewayV"])
    const { isLoadingBtn, } = useNamespacedGetters(EDGEGATEWAY, ["isLoadingBtn"])

    onMounted(() => {
      // console.log(props)
      generalVar.value.name = props.item?.name
      generalVar.value.description = props.item?.description
      generalVar.value.fipsMode = props.item?.configuration?.fipsModeEnabled
      generalVar.value.ha = props.item?.configuration?.haEnabled
      generalVar.value.config = props.item?.configuration?.gatewayBackingConfig
    })

    const generalVar = ref({
      name: '',
      description: '',
      // distributedRouted: false,
      fipsMode: false,
      ha: false,
      config: 'compact'
    })
    const $v = useVuelidate()

    const splitIOrgId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }

    const update = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      let payload ={
        id: splitIOrgId(props.item.href),
        value: {
          ...props.item,
          name: generalVar.value.name,
          description: generalVar.value.description,
          configuration: {
            ...props.item.configuration,
            fipsModeEnabled: generalVar.value.fipsMode,
            haEnabled: generalVar.value.ha,
            gatewayBackingConfig: generalVar.value.config

          }
        }
      }
      console.log(payload)
      let resp = await updateEdgeGatewayV(payload)
      if(resp.status){
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}/project/${context.root.$route.params.project}`);
      }
    }
    
    return{
      generalVar,
      isLoadingBtn,
      dialog,
      update
    }
  },
}
</script>