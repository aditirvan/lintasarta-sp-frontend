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
              v-model="value.general.name"
                placeholder="Insert Name"
                single-line
                outlined
                dense
                :error-messages="$v.rule.general.name.$errors.length ? $v.rule.general.name.$errors[0].$message : ''"
                ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3" sm="12" class="pb-0">
              <!-- <v-card-text> -->
              <p class="font-weight-bold">Description</p>
            </v-col>
            <v-col md="6" sm="12">
              <v-textarea
              v-model="value.general.description"
              placeholder="Description"
              flat
              outlined
              dense
              ></v-textarea>
              <!-- </v-card-text> -->
            </v-col>
          </v-row>
          <v-divider v-if="step"></v-divider>

          <v-row v-if="!step">
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Connected</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.general.connected"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">
                Disconnecting an Edge Gateway will physically disconnect the Gateway's uplink from the external network.
                The external network will still remain logically attached to the uplink but no traffic will flow through that link.
              </p>
           
            </v-col>
          </v-row>

          <v-row v-if="!step">
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Allow Non-Distributed Routing</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.general.nonDistributedRouting"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">
                Non-Distributed routing will allow tenants the option of connecting Org Vdc networks to the Service Router.
                This would force all VM traffic through the service router for that network.
              </p>
           
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="12" class="">
              <p class="font-weight-bold">Dedicate Tier-O Gateway</p>
            </v-col>
            <v-col md="9" sm="12">
              <v-switch
              v-model="value.general.enabledDedicateTier"
              class="pt-0 mt-0"
              inset
              hide-details
              >
              </v-switch>
              <p class="mt-2">Dedicating the Tier-O Gateway will enable the Route Advertisement for this Edge Gateway.</p>
           
            </v-col>
          </v-row>

        </div>

        <div v-if="step"  class="d-flex mt-auto align-self-end">
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

export default {
  props: ["value", "step"],
  setup(props, context) {

    const $v = useVuelidate(
      {
        rule: { 
          general:{
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
      $v
    }
  },
}
</script>