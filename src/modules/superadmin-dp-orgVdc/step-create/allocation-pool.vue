<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div v-if="step" class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Allocation Pool</p> </v-col>
          </v-row>
        </div>
        
        <div class="d-flex flex-column">
          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">Allocation Model</p>
              <v-text-field
              :value="model == 'AllocationPool' ? 'Allocation pool' : model"
              maxlength="50"
              placeholder="Allocation Pool"
              single-line
              outlined
              dense
              readonly
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>
          
          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">CPU allocation</p>
              <v-text-field
              v-model="value.cpu_allocation"
              maxlength="50"
              type="number"
              placeholder="CPU allocationl"
              single-line
              outlined
              suffix="GHz"
              dense
              :error-messages="$v.rule.cpu_allocation.$errors.length ? $v.rule.cpu_allocation.$errors[0].$message : ''"
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">CPU resources guaranteed</p>
              <v-text-field
              v-model="value.cpu_resource"
              maxlength="50"
              type="number"
              placeholder="CPU resources guaranteed"
              single-line
              outlined
              suffix="%"
              dense
              :error-messages="$v.rule.cpu_resource.$errors.length ? $v.rule.cpu_resource.$errors[0].$message : ''"
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">vCPU speed</p>
              <v-text-field
              v-model="value.cpu_speed"
              maxlength="50"
              type="number"
              placeholder="vCPU speed"
              single-line
              outlined
              suffix="GHz"
              dense
              :error-messages="$v.rule.cpu_speed.$errors.length ? $v.rule.cpu_speed.$errors[0].$message : ''"
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12" md="6">
              <p class="font-weight-bold">Memory allocation</p>
              <v-text-field
              v-model="value.memory_allocation"
              maxlength="50"
              type="number"
              placeholder="Memory allocation"
              single-line
              outlined
              dense
              :error-messages="$v.rule.memory_allocation.$errors.length ? $v.rule.memory_allocation.$errors[0].$message : ''"
              >
              </v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
            <v-col md="2">
              <v-select
              v-model="value.memory_type"
              class="mt-9"
              :items="[{text: 'MB', value: 1}, { text:'GB', value: 1024}]"
              outlined
              dense
              :error-messages="$v.rule.memory_type.$errors.length ? $v.rule.memory_type.$errors[0].$message : ''"
              ></v-select>
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12" md="8">
              <p class="font-weight-bold">Memory resource guaranteed</p>
              <v-text-field
              v-model="value.memory_resource"
              maxlength="50"
              type="number"
              placeholder="Memory resource guarantee"
              single-line
              outlined
              suffix="%"
              dense
              :error-messages="$v.rule.memory_resource.$errors.length ? $v.rule.memory_resource.$errors[0].$message : ''"
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12" :md="max_number == 'Custom' ? 5 : 8">
              <p class="font-weight-bold">Maximum number of VMs</p>
              <v-select
              v-model="value.max_number"
              :items="['Custom', 'Unlimited']"
              placeholder="Maximum Number of VMs"
              single-line
              outlined
              dense
              :error-messages="$v.rule.max_number.$errors.length ? $v.rule.max_number.$errors[0].$message : ''"
              ></v-select>
            </v-col>
            <v-col md="3" class="pt-8 mt-4">
              <v-text-field
              v-if="value.max_number == 'Custom'"
              v-model="value.customMaxNumber"
              maxlength="50"
              type="number"
              placeholder="Custom VMs"
              single-line
              outlined
              dense
              :error-messages="$v.rule.customMaxNumber.$errors.length ? $v.rule.customMaxNumber.$errors[0].$message : ''"
              ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>
        </div>

        <div v-if="step" class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-16 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-16 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-16" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, minValue, requiredIf, maxValue } from '@vuelidate/validators'
import { onMounted, ref } from '@vue/composition-api';

export default {
  props: ["value", "step", "model"],
  setup(props, context) {
    onMounted(() => {
      console.log(props)
    })

    const pool = ref()
    const cpu_allocation = ref(50)
    const cpu_resource = ref(50)
    const cpu_speed = ref(1)
    const memory_allocation = ref(2000)
    const memory_type = ref(1)
    const memory_resource = ref(50)
    const max_number = ref('Custom')
    const customMaxNumber = ref(100)

    const $v = useVuelidate(
      {
        rule: {
          cpu_allocation: { required, minValue: minValue(1) },
          cpu_resource: { required, minValue: minValue(0), maxValue: maxValue(100) },
          cpu_speed: { required, minValue: minValue(1), maxValue: maxValue(8) },
          memory_allocation: { required, minValue: minValue(1) },
          memory_type: { required },
          memory_resource: { required, minValue: minValue(0), maxValue: maxValue(100) },
          max_number: { required, },
          customMaxNumber: { required: requiredIf(() => props.value.max_number == 'Custom'), minValue: minValue(1)},
        }
        // pool: { required, minValue: minValue(1) },
      },
      {
        // pool,
        rule: props.value
        // cpu_allocation,
        // cpu_resource,
        // cpu_speed,
        // memory_allocation,
        // memory_type,
        // memory_resource,
        // max_number,
        // customMaxNumber,
      })
    
    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      let allocation_pool = {
        computeCapacity: { // Allocation Pool field
          cpu: {
              units: "MHz",
              limit: 0,
              allocated: (cpu_allocation.value*1000), // Transform GHz to MHz(x1000)
              // reserved: 37.15 
          },
          memory: {
              units: "MB",
              limit: 0,
              allocated: (memory_allocation.value*memory_type.value),
              // reserved: 154394.5
          }
        },
        vCpuInMhz: (cpu_speed.value*1000), // Allocation Pool field "vCPU SPEED" 
        resourceGuaranteedCpu: (cpu_resource.value/100), // Allocation Pool field "CPU RESOURCE" 
        resourceGuaranteedMemory: (memory_resource.value/100), // Allocation Pool field "MEMORY RESOURCE"
        vmQuota: max_number.value == 'Custom' ? customMaxNumber.value : 0, // Allocation Pool field "MAXIMUM NUMBER"

      }

      // console.log(allocation_pool)
      // context.emit('poolVal', allocation_pool)
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      next,
      prev,
      pool,
      cpu_allocation,
      cpu_resource,
      cpu_speed,
      memory_allocation,
      memory_type,
      memory_resource,
      max_number,
      customMaxNumber,
      $v,

    }
  },
}
</script>