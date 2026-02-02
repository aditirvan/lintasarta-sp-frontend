<template>
  <v-dialog v-model="dialog"  max-width="500">
    <v-card>
      <v-card-title class="pb-7" > 
        <div class="headline font-weight-bold font--text">Create New Access Key</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Access Key Name</p>
        <v-text-field
          outlined
          placeholder="Give your access key a name"
          :error-messages="createErrorMessage('name')"
        />
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Select User</p>
        <!-- <v-autocomplete
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
              if (role == 'Superadmin') superadminFetchMembers({ search: searchUser })
              else fetchMembers({ search: searchUser });
            }
          "
          :error-messages="createErrorMessage('user')"
        >
        </v-autocomplete> -->
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

import { ref, watch } from '@vue/composition-api'
const { required } = require("@vuelidate/validators");
const useVuelidate = require("@vuelidate/core").default;

export default {
  props: ['value', 'loadBalancer', 'instnace'],
  setup(props, context){
    const Composable = {
    }

    return {
    }
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
  button {
    ::v-deep .v-btn__content{
    font-size: 14px;
  }
}
</style>