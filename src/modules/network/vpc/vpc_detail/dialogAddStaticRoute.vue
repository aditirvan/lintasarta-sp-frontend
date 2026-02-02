<template>
  <v-dialog max-width="600" v-model="dialog">
    <v-card ref="form" class="pt-7">
        <v-card-text>
            <div class="headline font-weight-bold font--text">Create Static Route</div>
        </v-card-text>
        <!-- <v-card-text>
            <p class="font-weight-bold">Router</p>
            <v-select
            placeholder="Choose a Router"
            append-icon="mdi-chevron-down"
            :items="routers"
            item-text="name"
            item-value="name"
            v-model="router_vyos"
            outlined
            single-line
            return-object
            :error-messages="$v.router_vyos.$errors.length ? $v.router_vyos.$errors[0].$message : ''">
            </v-select>
        </v-card-text> -->
        <v-card-text>
          <p class="font-weight-bold">Destination CIDR</p>
          <v-row>
            <v-col md="8" class="py-0">
              <v-text-field
              maxlength="100"
              v-model="ip"
              placeholder="Destination CIDR"
              flat
              outlined
              :error-messages="$v.ip.$errors.length ? $v.ip.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
            <v-col md="4" class="py-0">
              <v-text-field
              maxlength="100"
              v-model="network_size"
              placeholder="Network Size"
              flat
              outlined
              prefix="/"
              :error-messages="$v.network_size.$errors.length ? $v.network_size.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-text>
          <p class="font-weight-bold">Network Size</p>
          <v-text-field
          maxlength="100"
          v-model="network_size"
          placeholder="Network Size"
          flat
          outlined
          :error-messages="$v.network_size.$errors.length ? $v.network_size.$errors[0].$message : ''"
          ></v-text-field>
        </v-card-text> -->
        <v-card-text>
          <p class="font-weight-bold">Nexthop</p>
          <v-text-field
          maxlength="100"
          v-model="nexthop"
          placeholder="Nexthop"
          flat
          outlined
          :error-messages="$v.nexthop.$errors.length ? $v.nexthop.$errors[0].$message : ''"
          ></v-text-field>
        </v-card-text>
        <v-card-text>
            <p class="font-weight-bold">Description</p>
            <v-textarea
            maxlength="100"
            v-model="description"
            placeholder="Add static route to the router.
Next Hop IP must be a part of one of the subnets to which the router interfaces are connected."
            flat
            outlined
            :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
          ></v-textarea>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn
              depressed
              height="45"
              block
              class="accent"
              :disabled="isLoadingBtn"
              @click="
                () => {
                  dialog = false
                  $emit('input', false);
                }
              "
              >Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              :loading="isLoadingBtn"
              :disabled="isLoadingBtn"
              @click="createSR"
              >Create</v-btn>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, onMounted, ref, watch } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, numeric, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from "../namespace.ts";

export default {
  props: ["value", "vyos"],
  setup(props, context){

    const { vpc, isLoadingBtn } = useNamespacedState(NETWORKVPC, ["vpc", "isLoadingBtn",]);
    const { DETAIL_VPC2, createStaticRouting } = useNamespacedActions(NETWORKVPC, [
      "DETAIL_VPC2",
      "createStaticRouting"
    ]);

    const currentProj = JSON.parse(localStorage.getItem('currentProj'))

    const ip = ref('')
    const network_size = ref('')
    const nexthop = ref('')
    const description = ref('')

    const { vpcid } = context.root._route.params;
    const router_vyos = ref(null)
    const routers = ref([])

    // watch(router_vyos, (newVal) => {
    // 	console.log(newVal)
    // })

    const $v = useVuelidate(
      {
        // router_vyos: { required },
        ip: { 
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        },
        network_size: { 
          required,
          numeric
        },
        nexthop: { 
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          },
        },
        description: { required },
      },
      {
        // router_vyos,
        ip,
        network_size,
        nexthop,
        description
      })

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
            context.emit('clearItem', {})
        }
        context.emit("input", val);
          
      },
    });

    const createSR = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      let os_project_id = currentProj.openstack_project_id
      let project_id = currentProj.id
      let org_id = currentProj.organization_id
      let user_id = JSON.parse(localStorage.getItem('userId'))
      let payload = {
        description: description.value,
        // instance_id: vpc.value.vyos.instance_id,
        // instance_name: vpc.value.vyos.name,
        instance_id: props.vyos.instance_id,
        instance_name: props.vyos.name,
        ip: ip.value,
        network_size: parseInt(network_size.value),
        nexthop: nexthop.value,
        openstack_project_id: os_project_id,
        organization_id: org_id,
        project_id: project_id,
        user_id: user_id
      }
      let resp = await createStaticRouting(payload)
      if(resp.status == 200){
        dialog.value = false
        context.emit('refreshTab')
      }else{
        console.log(resp)
      }
    }

    onMounted( async() => {
      // await DETAIL_VPC2({ id: props.vyos.vpc_id })
      console.log(props.vyos)
      // routers.value = vpc.value.vyos
    })

    return{
      $v,
      dialog,
      ip,
      network_size,
      nexthop,
      description,
      router_vyos,
      routers,
      isLoadingBtn,
      createSR
    }
  }
}
</script>