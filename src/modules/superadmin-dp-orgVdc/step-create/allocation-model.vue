<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Allocation Model</p> </v-col>
          </v-row>
        </div>

        <v-row>
          <v-col sm="12" md="12" class="pt-0 pb-0">
            <!-- <p class="font-weight-bold">Select the type of network that you are about to create</p> -->
            <v-radio-group v-model="model" class="mb-6">
              <v-radio label="Allocation pool" value="AllocationPool" class="mb-0"></v-radio>
              <span class="ml-9 mb-4 fz-12">
                Only a percentage of the resources you allocate are committed to the Organization VDC. The 
                system administrator controls overcommitment of capacity on the following pages. 
                When backed by a Provider VDC that has multiple resource pools, compute resources are Elastic.
              </span>
              <!-- <v-radio label="Isolated" value="ISOLATED" class="mb-0"></v-radio
              ><span class="ml-9 fz-12"
                >This type of network provides a fully isolated enviroment, which is accessible only by this organization VDC or VDC Group</span
              > -->
            </v-radio-group>
          </v-col>
        </v-row>

        <div class="d-flex mt-auto align-self-end">
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
import { ref } from '@vue/composition-api'

export default {
  props: ["step"],
  setup(props, context) {
    
    const model = ref('AllocationPool')

    const next = () => {
			// getEdgeConnection(detailInstance.value.Name);
      context.emit('allocationModelVal', { allocationModel: model.value })
			context.emit("update:step", props.step + 1);
		};
		const prev = () => {
			context.emit("update:step", props.step - 1);
		};

    return{
      model,
      next,
      prev,

    }
  },
}
</script>