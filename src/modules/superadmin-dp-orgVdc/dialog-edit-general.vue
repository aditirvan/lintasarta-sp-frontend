<template>
  <v-dialog max-width="650" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
        <v-card-text>
          <div class="headline font-weight-bold font--text">Edit General Details for "{{ item.name }}"</div>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Name</p>
          <v-text-field
            placeholder="Name"
            flat
            outlined
            v-model="name"
            :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
            ></v-text-field>
        </v-card-text>

        <v-card-text>
          <p class="font-weight-bold">Description</p>
          <v-textarea
            placeholder="Description"
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
import { useDialog } from '@/composable/usedialog';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from './namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { updateOrgVdc } = useNamespacedActions(ORGVDC, ["updateOrgVdc"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGVDC, ["isLoadingBtn",])
    const { dialog } = useDialog(props, context)

    onMounted(() => {
      console.log(props)
      if(props.item){
        name.value = props.item.name
        description.value = props.item.description
      }
    })
    
    const name = ref('')
    const description = ref('')

    const $v = useVuelidate(
      {
        name: { required },
        // description: { required },
      },
      {
        name,
        // description
      })

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

        let payload = {
          orgVdcId: splitIOrgId(props.item.href),
          value: {
            ...props.item,
            name: name.value,
            description: description.value
          }
        }
        console.log(payload)
        let resp = await updateOrgVdc(payload)
        dialog.value = false
        context.root.$router.replace("/manage-orgvdc");
      }

    return{
      dialog,
      $v,
      name,
      description,
      isLoadingBtn,
      update
    }
  },
}
</script>