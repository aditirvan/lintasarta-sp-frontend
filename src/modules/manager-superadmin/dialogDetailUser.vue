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
              <b>Organization:</b>
              {{ user.organization ? user.organization.name : '' }}
            </p>
          </v-col>
          <v-col>
            <p>
              <b>Role:</b>
              <span v-if="user.organization_role">
                {{ user.organization_role.name }}
              </span>
              <span v-else-if="user.super_admin_role_name">
                {{ user.super_admin_role_name }}
              </span>
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
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Project List
        </div>
      </v-card-title> -->
      <!-- <v-card-text class="pb-0">
        <v-data-table
          :headers="[{ text: 'Project name', value: 'project.name' }]"
          hide-default-footer
          :items="[...user.userproject || [], ...user.user_project || []]"
        ></v-data-table>
      </v-card-text> -->
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
import {useDialog} from '@/composable/usedialog'
export default {
  props: ["value", "user"],
  setup(props, context){
    console.log(props)
    const {dialog} = useDialog(props, context)
    return {
      dialog
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