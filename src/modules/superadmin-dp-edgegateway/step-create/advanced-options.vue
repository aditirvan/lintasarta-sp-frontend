<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Advanced Options</p> </v-col>
          </v-row>
        </div>
        
        <div class="d-flex flex-column">
          <v-row>
            <v-col md="12">
              <p class=" font-weight-bold font-italic">Enabled the following settings for additional configuration</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">IP Settings</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.ipSettings"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">Configure the IP settings for external networks on the new edge gateway.</p>
           
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Sub-Allocate IP Pools</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.subIpPool"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">Sub-allocate into multiple static IP pools the IP pools that the external networks on the edge gateway provide.</p>
           
            </v-col>
          </v-row>

          <!-- <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Rate Limits</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.rateLimits"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">Configure the inbound and outbound rate limits for each external network on the edge gateway.
              Rate limits apply only to external networks backed by distributed port groups with static binding.</p>
           
            </v-col>
          </v-row> -->

        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-16 mr-2" depressed height="40"> Cancel </v-btn></router-link>
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
export default {
  props: ["value", "step"],
  setup(props, context) {

    const next = () => {
      // $v.value.$touch();
      // if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    
    return{
      prev,
      next
    }
  },
}
</script>