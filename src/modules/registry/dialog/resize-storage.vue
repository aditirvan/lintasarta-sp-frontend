<template>
  <v-dialog v-model="dialog" max-width="650">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-2">
          Resize Storage
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row>
          <v-col class="ma-0">
            <span class="font-weight-bold">Storage Size</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="" class="pt-0">
            <!-- <p class="font-weight-bold">Storage</p> -->
            <v-text-field
              outlined
              placeholder="Storage Size"
              single-line
              v-model="size_storage"
              type="number"
              :error-messages="$v.size_storage.$errors.length ? $v.size_storage.$errors[0].$message : ''"
            />
            <p class="font-italic">Your available storage is : <span class="font-weight-bold">{{ sisaKuota }}</span></p>
          </v-col>
          <v-col cols="6" class="pt-0">
            <v-select
            v-model="storageUnit"
            :items="itemsUnit"
            placeholder="Size"
            outlined
            autocomplete="off"
            item-title="text"
            item-value="value"
          ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
            :disabled="isLoadingBtn"
            color="accent"
            block
            depressed
            height="50"
            @click="
              () => {
                dialog = false
              }
            "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
            :loading="isLoadingBtn"
            :disabled="isLoadingBtn"
            color="primary"
            block
            height="50"
            depressed
            @click="doResize"
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
import { useDialog } from '@/composable/usedialog'
import { computed, onMounted, ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { REGISTRY } from '../namespace';
import { formatSize } from "@/lib/formatSize"
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue, helpers } from "@vuelidate/validators";

export default {
  props: ["value", "storageVal"],
  setup(props, context) {
    const { getdetailquota, updateStorage } = useNamespacedActions(REGISTRY, ["getdetailquota", "updateStorage"]);
    const { isLoadingBtn, detailquotalimits } = useNamespacedGetters(REGISTRY, ["isLoadingBtn", "detailquotalimits"]);

    const { dialog } = useDialog(props, context)
    const sisaKuota = computed(() => {
      // let sisa = formatSize(props.storageVal.summary.quota.hard.storage + detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used)
      let sisa = formatSize(detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used)
      return sisa
    })
    
    const size_storage = ref()
    const storageUnit=ref(1048576)
    const itemsUnit = ref([
      { text: "MiB", value:1048576 },
      { text: "GiB", value: 1073741824 },
      { text: "TiB", value: 1099511627776 },
    ])

    const $v = useVuelidate(
      {
        size_storage: { 
          required,
          $autoDirty: true,
          minmaxValue: helpers.withMessage( 
            ({ $model }) => { 
              let inputVal = $model*storageUnit.value
              let sisa = props.storageVal.summary.quota.hard.storage + detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used
              let minimum = props.storageVal.summary.quota.hard.storage

              if(inputVal > sisa){
                return `Maximum resize allowed is ${sisaKuota.value}`
              }else if(inputVal < minimum){
                return `Can't resize less than your current storage`
              }
            },
            val => { 
              let valid = true
              let inputVal = val*storageUnit.value
              let sisa = props.storageVal.summary.quota.hard.storage + detailquotalimits.value?.Limit_storage?.limit - detailquotalimits.value?.Limit_storage?.used
              let minimum = props.storageVal.summary.quota.hard.storage

              if(inputVal > sisa){
                valid = false
              }else if(inputVal < minimum){
                valid = false
              }else{
                valid = true
              }
              return valid
            }
          ),
        },
      },
      {
        size_storage
      })

    const doResize = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let payload = {
        body: {
          storage: size_storage.value*storageUnit.value
        },
        quota_id: props.storageVal.quota[0].id,
        projectId_reg: props.storageVal.Project_id_hb
      }
      // console.log(payload)
      await updateStorage(payload)
      
      dialog.value = false
      context.emit('refreshList')
    }

    onMounted(() => {
      getdetailquota()
      let formatStorage = formatSize(props.storageVal.summary.quota.hard.storage)
      let splitStorage = formatStorage.split(" ")
      size_storage.value = splitStorage[0]
      // console.log(size_storage.value)

      if(splitStorage[1] == 'MB'){
        storageUnit.value = 1048576
      }else if(splitStorage[1] == 'GB'){
        storageUnit.value = 1073741824
      }else if(splitStorage[1] == 'TB'){
        storageUnit.value = 1099511627776
      }
    })

    return{
      dialog,
      size_storage,
      storageUnit,
      itemsUnit,
      sisaKuota,
      isLoadingBtn,
      doResize,
      $v,
    }
  },
}
</script>