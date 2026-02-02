<template>
  <div>
    <v-card class="rounded-lg" flat>
      <div class="d-flex justify-center" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-container fluid v-else class="px-7 py-0">
        <br />
        <v-card class="rounded-lg " flat>
          <div class="d-flex">
            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogEdit">
              EDIT
            </span>

            <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="dialogDisable">
              {{ userById.isEnabled ? 'DISABLE' : 'ENABLE' }}
            </span>

            <span v-if="!userById.isEnabled" class="red--text fz-16 ml-4" style="cursor: pointer" @click="dialogDelete">
              DELETE
            </span>
          </div>
          <div class="d-flex flex-column">
            <v-row>
              <v-col>
                <!-- <p class="font-weight-bold mb-0">General</p> -->
                <div class="bor-table d-flex flex-column">
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">Name</v-col>
                    <v-col class="grey lighten-4">{{ userById.name }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">State</v-col>
                    <v-col class="grey lighten-4">{{ userById.isEnabled ? 'Enabled' : 'Disabled' }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">Role</v-col>
                    <v-col class="grey lighten-4">{{ userById.role && userById.role.name }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">Full Name</v-col>
                    <v-col class="grey lighten-4">{{ userById.fullName ? userById.fullName : '-' }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">Email Address</v-col>
                    <v-col class="grey lighten-4">{{ userById.emailAddress ? userById.emailAddress : '-' }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">Phone Number</v-col>
                    <v-col class="grey lighten-4">{{ userById.telephone ? userById.telephone : '-' }}</v-col>
                  </v-row>
                  <v-row class="ma-0 bor-table">
                    <v-col class="font-weight-bold grey lighten-4">IM</v-col>
                    <v-col class="grey lighten-4">{{ userById.im ? userById.im : '-' }}</v-col>
                  </v-row>
                  <!-- <v-divider></v-divider> -->
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <DialogEdit
        v-if="openDialogEdit"
        v-model="openDialogEdit"
        :item="itemEdit"
        @refreshPage="refreshPage"
        />

        <DialogDisable
        v-if="openDialogDisable"
        v-model="openDialogDisable"
        :item="itemEdit"
        @refreshPage="refreshPage"
        />

        <DialogDelete
        v-if="openDialogDelete"
        v-model="openDialogDelete"
        :item="itemEdit"
        />

      </v-container>
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGDP } from '../namespace';
import DialogDisable from './dialog-disable.vue'
import DialogEdit from './dialog-create.vue'
import DialogDelete from './dialog-delete.vue'

export default {
  components: {
    DialogDisable,
    DialogEdit,
    DialogDelete
  },
  setup(props, context) {
    const { fetchUserById, updateUser } = useNamespacedActions(ORGDP, ["fetchUserById", "updateUser"])
    const { isLoading, userById  } = useNamespacedGetters(ORGDP, ["isLoading", "userById"])
    
    onMounted(async() => {
      detailUser.value = JSON.parse(localStorage.getItem('detailUserDP'))
      detailOrg.value = JSON.parse(localStorage.getItem('orgDP'))
       
      await fetchUserById({ idOrg: detailOrg.value.id, idUser: detailUser.value.id})
    })

    const detailUser = ref()
    const detailOrg = ref()
    const openDialogDisable = ref(false)
    const openDialogEdit = ref(false)
    const openDialogDelete = ref(false)
    const itemEdit = ref()
    const panel = ref(0);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    })

    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const dialogDisable = async() => {
      if(userById.value.isEnabled){
        itemEdit.value = userById.value
        openDialogDisable.value = true
      }else{
        console.log('enabled')
        let payload = {
          idOrg: splitIOrgId(detailOrg.value.id),
          idUser: detailUser.value.id,
          value: {
            ...userById.value,
            isEnabled: !userById.value.isEnabled 
          }
        }
        await updateUser(payload)
        await fetchUserById({ idOrg: detailOrg.value.id, idUser: detailUser.value.id})
      }
    }

    const dialogEdit = async() => {
      itemEdit.value = userById.value
      openDialogEdit.value = true
    }

    const dialogDelete = async() => {
      itemEdit.value = userById.value
      openDialogDelete.value = true
    }

    const refreshPage = async() => {
      await fetchUserById({ idOrg: detailOrg.value.id, idUser: detailUser.value.id})
    }

    return{
      panel,
      hide,
      isLoading,
      userById,
      openDialogDisable,
      dialogDisable,
      itemEdit,
      dialogEdit,
      openDialogEdit,
      dialogDelete,
      openDialogDelete,
      refreshPage
    }
  },
}
</script>

<style lang="scss" scoped>
.bor-table {
  border: 1px solid rgb(2 0 0 / 12%);
}
</style>