<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
        <v-card-text>
          <div class="headline font-weight-bold font--text">{{ isEdit ? 'Edit General Organization Settings' : 'New Organization' }}</div>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Organization Name</p>
          <v-text-field
            :readonly="item?true:false"
            placeholder="Name"
            flat
            outlined
            v-model="name"
            :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
            ></v-text-field>
            <p v-if="isEdit"
            class="fz-12 mx-1 mb-0"
            style="text-align: justify;">
              The unique identifier in the full URL with which users log in to this organization. You can only use alphanumeric characters or one of the following: - _ . ( ) , $
            </p>
        </v-card-text>

        <v-card-text>
          <p class="font-weight-bold">Organization Full Name</p>
          <v-text-field
          placeholder="Full Name"
          flat
          outlined
          v-model="fullName"
          :error-messages="$v.fullName.$errors.length ? $v.fullName.$errors[0].$message : ''"
          ></v-text-field>
          <p v-if="isEdit"
            class="fz-12 mx-1 mb-0"
            style="text-align: justify;">
              Appears in the Cloud application as a human-readable name of the organization.
            </p>
        </v-card-text>

        <v-card-text>
          <p class="font-weight-bold">Description</p>
          <v-textarea
            placeholder="description"
            flat
            outlined
            v-model="description"
            ></v-textarea>
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
              @click="() => { isEdit ? update() : create() }"
              >
              {{ isEdit ? 'Save' : 'Create' }}
              </v-btn>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGDP } from './namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { createOrg, updateOrg } = useNamespacedActions(ORGDP, ["createOrg", "updateOrg"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGDP, ["isLoadingBtn",])
    const { dialog } = useDialog(props, context)

    onMounted(() => {
      console.log(props)
      if(props.item){
        isEdit.value = true
        name.value = props.item.name
        fullName.value = props.item.displayName
        description.value = props.item.description
      }
    })
    
    const name = ref('')
    const fullName = ref('')
    const description = ref('')
    const isEdit = ref(false)

    const $v = useVuelidate(
      {
        name: { 
          required,
          $autoDirty: true,
          conditional: {
            $message: "The special character or spaces are not allowed",
            $validator: (val) => {
              return /^[A-Za-z0-9//g\-_(),$.]+$/g.test(val);
            },
          },
        },
        fullName: { required },
        // description: { required },
      },
      {
        name,
        fullName,
        // description
      })

      const create = async() => {
        $v.value.$touch();
        if ($v.value.$errors.length) {
          let container = document.getElementById("container");
          container.scrollIntoView({behavior: "smooth"})
          return;
        }

        let payload = {
          description: description.value,
          fullName: fullName.value.trim(),
          isEnabled: true,
          name: name.value.trim(),
          settings: {}
        }
        console.log(payload)
        let resp = await createOrg(payload)
        dialog.value = false
        context.emit('refreshTable')
      }

      const update = async() => {
        $v.value.$touch();
        if ($v.value.$errors.length) {
          let container = document.getElementById("container");
          container.scrollIntoView({behavior: "smooth"})
          return;
        }

        let payload = {
          orgId: props.item.id,
          value: {
            canPublish: props.item.canPublish,
            catalogCount: props.item.catalogCount,
            description: description.value,
            diskCount: props.item.diskCount,
            displayName: fullName.value.trim(),
            id: props.item.id,
            isEnabled: props.item.isEnabled,
            name: name.value.trim(),
            orgVdcCount: props.item.orgVdcCount,
            runningVMCount: props.item.runningVMCount,
            userCount: props.item.userCount,
            vappCount: props.item.vappCount,
          }
        }
        // console.log(payload)
        let resp = await updateOrg(payload)
        dialog.value = false
        context.root.$router.replace("/manage-orgdp");
      }

    return{
      dialog,
      $v,
      name,
      fullName,
      description,
      create,
      isLoadingBtn,
      isEdit,
      update
    }
  },
}
</script>