<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text">Detail User</div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <p>
              <b>Name:</b><br />
              {{ user.fullname }}
            </p>
          </v-col>
          <v-col>
            <p>
              <b>Phone Number:
                </b><br />
              {{ user.phone_number }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p>
              <b>Email:</b><br />
              {{ user.email }}
            </p>
          </v-col>
          <v-col>
            <p>
              <b>Join Date:
                </b><br />
              {{ $moment(new Date(user.created_at)).locale('id-ID').format('DD/MM/YYYY') }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p>
              <b>Organization:</b><br />
              {{ user.organization ? user.organization.name : '' }}
            </p>
          </v-col>
          <v-col>
            <p>
              <b>Role:</b><br />
              <i v-if="userrole != 'Superadmin'">{{ user.role_name }}</i>
              <i v-else>{{  user.role.name  }}</i>
            </p>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="d-flex flex-row">
              <p>
              <b>Status:</b><br />
              {{ user.status == 'active' ? 'Active':'Inactive' }}
            </p>
            </div>
          </v-col>
          <v-col>
            <div class="d-flex flex-row">
              <p>
              <b>Verification:</b><br />
              <span class="primary--text" v-if="user.is_identity_verified === true" >Verified</span>
              <span class="red--text" v-if="user.is_identity_verified === false">Unverified</span>
              <span class="grey--text" v-if="user.is_identity_verified === null">Waiting</span>
            </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="d-flex flex-row">
              <p>
              <b>Email Verification</b><br />
              <span class="primary--text" v-if="user.verified_at" >Verified</span>
              <span class="red--text" v-else>Unverified</span>
            </p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Project List
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-data-table
          :headers="[{ text: 'Project name', value: 'project.name' }]"
          hide-default-footer
          :items="[...user.userproject || [], ...user.user_project || []]"
        ></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  useNamespacedState,
} from "vuex-composition-helpers";
import {useDialog} from '@/composable/usedialog'
export default {
  props: ["value", "user"],
  setup(props, context){
    const {dialog} = useDialog(props, context)
    const { userrole } = useNamespacedState("ROLEPERMISSION", ["userrole"]);
    return {
      dialog,
      userrole,
    }
  }
};
</script>
<style lang="scss" scoped>
.v-input--selection-controls {
  margin-top: 0;
}
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--is-readonly {
  ::v-deep input {
    cursor: auto;
  }
}
</style>