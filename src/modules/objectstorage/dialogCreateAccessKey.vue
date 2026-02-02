<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card>
      <v-card-title class="pb-7" > 
        <div class="headline font-weight-bold font--text">Create New Access Key</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Access Key Name</p>
        <v-text-field
          v-model="name"
          outlined
          placeholder="Give your access key a name"
          :error-messages="createErrorMessage('name')"
        />
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Select User</p>
        <v-autocomplete
          :search-input.sync="searchUser"
          v-model="user"
          :items="listMembers"
          outlined
          autocomplete="off"
          item-text="fullname"
          item-value="id"
          placeholder="Select User"
          clearable
          hide-details
          @focus="  
            () => {
              if (role == 'Superadmin') superadminFetchMembers({ search: searchUser, page:1, itemsPerPage:999 })
              else fetchMembers({ search: searchUser, page:1, itemsPerPage:999 });
            }
          "
          :error-messages="createErrorMessage('user')"
        >
          <template v-slot:append-outer>
            <div id="filterUser"></div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="accent"
              block
              @click="
                () => {
                  $emit('close')
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="create"
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

import { useObjectStorage } from './composableapi/useobjectstorage'
import { ref, watch } from '@vue/composition-api'
import { useMember } from "../organization/usemember";
const { required } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

export default {
  props: ['value', 'objectStorageID'],
  setup(props, context){
    const Composable = {
      ...useObjectStorage()
    }

    const {
      createAccessKey
    } = Composable
    
    const name = ref('')
    const searchUser = ref('')
    const user = ref(null)

    const $v = useVuelidate({
      user: { required },
      name: { required },
    }, {
      user,
      name
    })

    // watch(searchUser, val => {
    //   fetchMembers({ search: searchUser.value })
    // })

    const create = async () => {
      $v.value.$touch()
      if($v.value.$invalid) return
      
      const payload = {
        user_id: user.value,
        name: name.value,
        object_storage_id: props.objectStorageID,
      }

      const response = await createAccessKey(payload)
      if(response.status == 200) {
        context.emit('show', response.data.data)
      }

    }

    const createErrorMessage = (element) => {
      return ($v.value[element].$errors.length) ? $v.value[element].$errors[0].$message : ''
    }

    const role = localStorage.getItem('role')

    return {
      role,
      ...Composable,
      searchUser,
      name,
      user,
      create,
      createErrorMessage,
    }
  },
  created(){
    if (this.role == 'Superadmin') this.superadminFetchMembers({ page:1, itemsPerPage:999 })
    else this.fetchMembers({ page:1, itemsPerPage:999 })
  },
  computed:{
    dialog:{
      get:function(){
        return this.value
      },
      set:function(val){
        this.$emit('close',val)
      }
    }
  }
};
</script>
<style scoped lang="scss">
button{
  ::v-deep .v-btn__content{
  font-size: 14px;
}
}

</style>