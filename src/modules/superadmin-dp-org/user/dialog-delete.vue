<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Delete User</div>
      </v-card-text>

      <v-card-text>
        Are you sure you want to delete the user "{{ item.name }}"?

        <!-- Delete User <span class="font-weight-bold"> {{ item.name }} </span>? -->
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
import { ORGDP } from '../namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { deleteUser } = useNamespacedActions(ORGDP, ["deleteUser"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGDP, ["isLoadingBtn",])

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const setData = async() => {
      // let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
      let detailOrg = JSON.parse(localStorage.getItem('orgDP'))
      let payload = {
          idOrg: splitIOrgId(detailOrg.id),
          idUser: splitIOrgId(props.item.id),
        }
        console.log(payload)
        await deleteUser(payload)
        dialog.value = false
        context.root.$router.replace(`/organization-detail/${context.root.$route.params.organizationid}`);
    }

    return{
      dialog,
      isLoadingBtn,
      setData
    }
  },
}
</script>