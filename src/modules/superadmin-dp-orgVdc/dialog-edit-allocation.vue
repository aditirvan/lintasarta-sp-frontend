<template>
  <v-dialog max-width="800" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit Allocation</div>
      </v-card-text>
      <v-card-text>
        <allocation-pool 
        v-model="allocationPoolValue"
        :model="item.allocationModel"
        />
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
import AllocationPool from './step-create/allocation-pool.vue'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from './namespace';
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';

export default {
  props: ["value", "item"],
  components: {
    AllocationPool
  },
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { updateOrgVdc } = useNamespacedActions(ORGVDC, ["updateOrgVdc"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGVDC, ["isLoadingBtn"])

    onMounted(() => {
      console.log(props.item)
      allocationPoolValue.value.cpu_allocation = (props.item?.computeCapacity?.cpu?.allocated/1000)
      allocationPoolValue.value.cpu_resource = (props.item.resourceGuaranteedCpu*100)
      allocationPoolValue.value.cpu_speed = (props.item.vCpuInMhz/1000)
      allocationPoolValue.value.memory_allocation = (props.item?.computeCapacity?.memory?.allocated)
      allocationPoolValue.value.memory_type = 1
      allocationPoolValue.value.memory_resource = (props.item.resourceGuaranteedMemory*100)
      allocationPoolValue.value.customMaxNumber = props.item.vmQuota 
    })

    const allocationPoolValue = ref({
      cpu_allocation : 50,
      cpu_resource : 50,
      cpu_speed : 1,
      memory_allocation : 2000,
      memory_type : 1,
      memory_resource : 50,
      max_number : 'Custom',
      customMaxNumber : 100,
    })

    const $v = useVuelidate()

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
          computeCapacity: {
            ...props.item.computeCapacity,
              cpu: {
                ...props.item.computeCapacity.cpu,
                allocated: (allocationPoolValue.value.cpu_allocation*1000),
              },
              memory: {
                ...props.item.computeCapacity.memory,
                allocated: (allocationPoolValue.value.memory_allocation*allocationPoolValue.value.memory_type),
              }
          },
          vCpuInMhz: (allocationPoolValue.value.cpu_speed*1000),
          resourceGuaranteedCpu: (allocationPoolValue.value.cpu_resource/100),
          resourceGuaranteedMemory: (allocationPoolValue.value.memory_resource/100),
          vmQuota: allocationPoolValue.value.max_number == 'Custom' ? allocationPoolValue.value.customMaxNumber : 0,
        }
      }

      console.log(payload)
      let resp = await updateOrgVdc(payload)
      dialog.value = false
      context.root.$router.replace("/manage-orgvdc");
    }
    
    return{
      dialog,
      isLoadingBtn,
      update,
      allocationPoolValue
    }
  },
}
</script>