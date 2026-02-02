<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Delete Edge Gateway</div>
      </v-card-text>

      <v-card-text>
        All services configurations, such as NAT, Firewall, and Static Routing, will be permanently deleted.
        <br />
        <br />
        Delete Edge Gateway <span class="font-weight-bold"> {{ item.name }} </span>?
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
            class="error"
            @click="setData"
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from './namespace';
import { ref } from '@vue/composition-api';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { isLoadingBtn, } = useNamespacedGetters(EDGEGATEWAY, ["isLoadingBtn",])
    const { deleteEdgeGatewayV, deleteEdgeGatewayT } = useNamespacedActions(EDGEGATEWAY, ["deleteEdgeGatewayV", "deleteEdgeGatewayT"])
    
    const detailEdge = ref(JSON.parse(localStorage.getItem('detailEdge')))
    const splitIOrgId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }
    const setData = async() => {
      let payload
      // console.log(payload)
      let resp
      if(detailEdge.value.type == 'NSXV_BACKED'){
        payload = {
        id: splitIOrgId(props.item.href),
      }
        resp = await deleteEdgeGatewayV(payload)
      }else if(detailEdge.value.type == 'NSXT_BACKED'){
        payload = {
        id: props.item.id,
      }
        resp = await deleteEdgeGatewayT(payload)
      }
      dialog.value = false
       if(resp.status){
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}/project/${context.root.$route.params.project}`);
      }
    }

    return{
      dialog,
      isLoadingBtn,
      setData
    }
  },
}
</script>