<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0" id="container">
        <div v-if="step" class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">General</p> </v-col>
          </v-row>
        </div>
        
        <div class="d-flex flex-column">
          <v-row >
            <v-col md="3" sm="12">
              <p class="font-weight-bold">Name</p>
            </v-col>
            <v-col md="6"  sm="12">
              <v-text-field
                maxlength="50"
                placeholder="Insert Name"
                single-line
                outlined
                v-model="value.name"
                dense
                :error-messages="$v.rule.name.$errors.length ? $v.rule.name.$errors[0].$message : ''"
                ></v-text-field>
                <!-- :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''" -->
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="pb-0">
              <!-- <v-card-text> -->
              <p class="font-weight-bold">Description</p>
            </v-col>
            <v-col md="6" sm="12">
              <v-textarea
                placeholder="Description"
                flat
                outlined
                v-model="value.description"
                dense
                ></v-textarea>
                <!-- :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''" -->
              <!-- </v-card-text> -->
            </v-col>
          </v-row>

          <v-row v-if="step">
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Distributed Routing</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              class="pt-0 mt-0"
              inset
              hide-details
              v-model="value.distributedRouted"
              >
              </v-switch>
              <p class="mt-2">Enabling Distributed Routing on the gateway enables the creation of more than one Organization VDC networks connected to this edge gateway.
              Traffic in those networks is optimized for VM-to-VM communication.</p>
           
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">FIPS Mode</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              class="pt-0 mt-0"
              inset
              hide-details
              v-model="value.fipsMode"
              >
              </v-switch>
              <p class="mt-2">FIPS mode turns on the cipher suites that comply with FIPS.
              All secure communications to and from the NSX Edge use cryptographic algorithms or protocols that are in compliance 
              with the United States Federal Information Processing Standards (FIPS).</p>
           
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">High Availability</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              class="pt-0 mt-0"
              inset
              hide-details
              v-model="value.ha"
              >
              </v-switch>
              <p class="mt-2">High availability enables automatic failover to a backup edge gateway.
              Requires less memory and compute resources.</p>
           
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Configuration</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-radio-group class="mt-0 pt-0" v-model="value.config" >
                <v-radio label="Compact" value="compact"></v-radio>
                <p class="ml-8">Requires less memory and compute resources</p>
                
                <v-radio label="Large" value="large"></v-radio>
                <p class="ml-8">Provides increased capacity and performance, compared with the Compact option.
                Large and X-Large configurations provide identical security functions.</p>

                <v-radio label="Quad Large" value="quadlarge"></v-radio>
                <p class="ml-8">Recommended for high throughput and requires a high connection rate.</p>

                <v-radio label="X-Large" value="xlarge"></v-radio>
                <p class="ml-8">Suited for environments that have a load balancer with a large number of concurrent sessions.</p>

              </v-radio-group>
              <p></p>
           
            </v-col>
          </v-row>
        </div>

        <div v-if="step" class="d-flex mt-auto align-self-end">
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
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'
import { onMounted } from '@vue/composition-api';

export default {
  props: ["value", "step"],
  setup(props, context) {
    onMounted(() => {
      // console.log(props)
    })

    const $v = useVuelidate(
      {
        rule: {
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
          // description: { required },
        }
      },
      {
        // name, description
        rule: props.value
      })

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    
    return{
      prev,
      next,
      $v,
    }
  },
}
</script>