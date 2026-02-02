<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Confirm Restore Role
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="titletext">Type the Name of Organization "{{ orgNameProp }}"</p>
        <v-text-field
          maxlength="50"
          v-model="nameoforg"
          placeholder="Enter Name of Organization"
          flat
          outlined
          :error-messages="nameoforgError"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                    dialog = false;
                    nameoforg = '';
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="restore"
            >
              Restore Role
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent, computed, ref } from '@vue/composition-api';
import { async } from 'rxjs';
import Vue from 'vue';
import { useNamespacedActions, useNamespacedState, useActions } from 'vuex-composition-helpers'
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";

export default defineComponent({
props: ["value", "organization"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const { restoreroleweblabel } = useNamespacedActions(
      SUPERADMINMANAGEORG,
      ["restoreroleweblabel"]
    );
    
    const orgNameProp = props.organization.name;
    const nameoforg = ref("");
    const nameoforgError = ref("")

    async function restore() {
        if (nameoforg.value.toLowerCase() != orgNameProp.toLowerCase() && nameoforg.value.length != 0) {
            nameoforgError.value = "Please enter the name of the organization correctly"
        } else if (nameoforg.value.length == 0) {
            nameoforgError.value = "Can not be null"
        } else {
            nameoforgError.value = ""
            await this.restoreroleweblabel(props.organization);
            this.$root.$emit('load_new_list_permission')
            dialog.value = false;
            nameoforg.value = '';
        }
    }

    return {
      dialog,
      nameoforg,
      restore,
      nameoforgError,
      orgNameProp,
      restoreroleweblabel,
    }
  },
});
</script>