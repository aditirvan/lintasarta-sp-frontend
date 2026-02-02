<template>
  <v-dialog persistent v-model="dialog" max-width="550">
    <v-card class="overflow-x-hidden" id="container">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>{{ title }} IP Set</h2>
          </v-card-text>
        </v-col>
        <v-col class="pt-0">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <span class="cursor-pointer" @click="dialog = false"><v-icon color="red">mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-text>
        <p class="font-weight-bold">Name</p>
        <v-text-field
        v-model="name"
        placeholder="Input Name"
        flat
        outlined
        :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">Description</p>
        <v-textarea
        v-model="description"
        placeholder="Input Description"
        flat
        outlined
        ></v-textarea>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">IP Address</p>
        <v-row>
          <v-col cols="" class="d-flex">
            <v-text-field
            v-model="ipAddress"
            placeholder="Input IP Address"
            flat
            outlined
            class="mr-2"
            :error-messages="$v.ipAddress.$errors.length ? $v.ipAddress.$errors[0].$message : ''"
            ></v-text-field>
          <!-- </v-col>
          <v-col class="mt-2 d-flex justify-end"> -->
            <span v-if="ipAddress.length" class="cursor-pointer mt-3"
            @click="addIp">
              <v-icon large color="secondary">mdi-plus-circle</v-icon>
            </span>
            <span v-else class="mt-3">
              <v-icon large color="grey">mdi-plus-circle</v-icon>
            </span>
          </v-col>
        </v-row>
        <v-card
        v-if="ipAddresses.length"
        class="bs scroll"
        elevation="1">
          <!-- <div v-if="!dataSelectedApp || !dataSelectedApp.length" class="d-flex align-center" style="height: 100%">-</div> -->
          <div>
            <v-list dense  class="pb-0">
              <v-list-item-group>
                <v-list-item v-for="(item, i) in ipAddresses" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item" class="fz-14-i"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small color="red" @click="deleteIp(i)">mdi-close</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
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
            @click="save"
            > {{ title == 'Add' ? 'Create' : 'Save' }} </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { DPSECURITY } from '../../namespace';
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf} from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props:["value", "title", "rowSelected"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { createIpsetNsxt, fetchIpsetById, updateIpsetNsxt } = useNamespacedActions(DPSECURITY, ["createIpsetNsxt", "fetchIpsetById", "updateIpsetNsxt"])
    const { isLoadingBtn, listIpsetById } = useNamespacedGetters(DPSECURITY, ["isLoadingBtn", "listIpsetById"])
    const id = context.root.$route.params.idEdge;
    
    const name = ref('')
    const description = ref('')
    const ipAddress = ref('')
    const ipAddresses = ref([])
    const save = async() => {
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      
      let payload = {}
      if(props.title == 'Add'){
        payload = {
          description: description.value,
          id: "",
          ipAddresses: ipAddresses.value,
          name: name.value,
          ownerRef: {
            id: `urn:vcloud:gateway:${id}`
          },
          typeValue: "IP_SET"
        }
        await createIpsetNsxt({idEdge: id, params: payload})
      }else if(props.title == 'Edit'){
        let idIpset = props.rowSelected.id.replace("urn:vcloud:firewallGroup:", "")
        payload = {
          ...props.rowSelected,
          name: name.value,
          description: description.value,
          ipAddresses: ipAddresses.value
        }
        await updateIpsetNsxt({idEdge: id, ipsetId: idIpset, params: payload})
      }
      // console.log(payload)
      
      dialog.value = false
      context.emit('refreshTab')
    }
    const addIp = () => {
      ipAddresses.value.push(ipAddress.value)
      ipAddress.value = ''
    }
    const deleteIp = (index) => {
      ipAddresses.value.splice(index, 1);
    }

    const $v = useVuelidate(
      {
        name: { required },
        ipAddress: {
          $autoDirty: true,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              let splitCidr = val.split('/')
              let splitRange = val.split('-')
              let regex = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/
              if(val.length == 0){
                return true
              }
              // if(splitCidr.length > 1){
              //   let cekIp = regex.test(splitCidr[0].trim()) 
              //   let cekCidr = typeof(cekCidr)
              //   return cekIp && cekCidr == 'number'
              // }
              if (splitRange.length > 1) {
                let cekIp1 = regex.test(splitRange[0].trim()) 
                let cekIp2 = regex.test(splitRange[1].trim()) 

                return cekIp1 && cekIp2
              } else {
                return regex.test(splitRange[0].trim()) 
              }
            },
          }
        }
      },{
        name,
        ipAddress
      })

    onMounted(async() => {
      if(props.title == 'Edit'){
        let idIpset = props.rowSelected.id.replace("urn:vcloud:firewallGroup:", "")
        await fetchIpsetById({idEdge: id, ipsetId: idIpset})
        name.value = listIpsetById.value.name
        description.value = listIpsetById.value.description
        ipAddresses.value = listIpsetById.value.ipAddresses ? listIpsetById.value.ipAddresses : [] 
        // console.log(listIpsetById.value)
      }
    })
    return {
      dialog,
      name,
      description,
      ipAddress,
      ipAddresses,
      isLoadingBtn,
      $v,
      save,
      addIp,
      deleteIp
    }
  },
}
</script>

<style lang="scss" scoped>
.bs {
  box-shadow: none !important;
  border: 1px solid rgb(2 0 0 / 12%);
}
.scroll {
  height: 150px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>