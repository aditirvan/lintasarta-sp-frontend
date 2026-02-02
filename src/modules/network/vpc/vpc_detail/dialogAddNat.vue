<template>
  <v-dialog max-width="620" v-model="dialog">
    <v-card ref="form" class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Create NAT</div>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Type</p>
        <v-select
        placeholder="Choose a Type"
        append-icon="mdi-chevron-down"
        :items="types"
        v-model="type"
        outlined
        single-line
        :error-messages="$v.type.$errors.length ? $v.type.$errors[0].$message : ''"
        >
        </v-select>
      </v-card-text>
      <v-card-text v-if="type == 'many'">
        <v-row>
          <v-col class="py-0">
            <p class="font-weight-bold">Protocol</p>
          </v-col>
          <v-col class="py-0">
            <p class="font-weight-bold">Translation Port</p>
          </v-col>
          <v-col class="py-0">
            <p class="font-weight-bold">Destination Port</p>
          </v-col>
        </v-row>
          
        <v-row>
          <v-col class="py-0">
            <v-select
            placeholder="Choose a Protocol"
            append-icon="mdi-chevron-down"
            :items="protocols"
            v-model="protocol"
            outlined
            single-line
            :error-messages="$v.protocol.$errors.length ? $v.protocol.$errors[0].$message : ''"
            >
            </v-select>
          </v-col>

          <v-col class="py-0">
            <v-text-field
            maxlength="100"
            placeholder="Translation Port"
            flat
            outlined
            v-model="t_port"
            :error-messages="$v.t_port.$errors.length ? $v.t_port.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
          <v-col class="py-0">
            <v-text-field
            maxlength="100"
            placeholder="Destination Port"
            flat
            outlined
            v-model="d_port"
            :error-messages="$v.d_port.$errors.length ? $v.d_port.$errors[0].$message : ''"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
        <!-- <v-card-text>
          <p class="font-weight-bold">Router</p>
          <v-select
          placeholder="Choose a Router"
          append-icon="mdi-chevron-down"
          item-text="name"
          item-value="name"
          :items="routers"
          outlined
          single-line
          return-object
          >
          </v-select>
      </v-card-text> -->
        <!-- <v-card-text>
          <p class="font-weight-bold">Interface</p>
          <v-select
          placeholder="Choose a Interface"
          append-icon="mdi-chevron-down"
          :items="['eth0', 'eth1']"
          outlined
          single-line
          >
          </v-select>
        </v-card-text> -->
        <v-card-text>
          <p class="font-weight-bold">Destination Address</p>
          <v-select
          placeholder="Destination Address"
          append-icon="mdi-chevron-down"
          :items="interfaces"
          v-model="destination_address"
          :item-text="(val) => {
            return val.ip_public
          }"
          item-value="ip_public"
          outlined
          single-line
          :error-messages="$v.destination_address.$errors.length ? $v.destination_address.$errors[0].$message : ''"
          >
          </v-select>
        </v-card-text>
        <v-card-text >
          <p class="font-weight-bold">Translation Address</p>
          <v-select
          placeholder="Translation Address"
          append-icon="mdi-chevron-down"
          :items="address_chooices"
          v-model="translation_address"
          :item-text="(val) => {
            return val.name + ' - ' + val.ip_address_internal
          }"
          item-value="ip_address_internal"
          return-object
          outlined
          single-line
          :error-messages="$v.translation_address.$errors.length ? $v.translation_address.$errors[0].$message : ''"
          >
          </v-select>
      </v-card-text>
        <!-- <v-card-text>
          <p class="font-weight-bold">Rule Number</p>
          <v-row>
            <v-col class="py-0">
              <v-text-field
              maxlength="100"
              placeholder="Rule Number"
              flat
              outlined
              v-model="rule_number"
              :error-messages="$v.rule_number.$errors.length ? $v.rule_number.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text> -->
        <v-card-text>
          <p class="font-weight-bold">Description</p>
          <v-row>
            <v-col class="py-0">
              <v-text-field
              maxlength="100"
              placeholder="Description"
              flat
              outlined
              v-model="rule_desc"
              :error-messages="$v.rule_desc.$errors.length ? $v.rule_desc.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
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
              :disabled="isLoadingBtn"
              :loading="isLoadingBtn"
              class="secondary"
              @click="create"
              >Create</v-btn>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { required, numeric, maxValue, requiredIf, minValue } from '@vuelidate/validators'
import { NETWORKVPC } from "../namespace.ts";
import useVuelidate from '@vuelidate/core';

export default {
  props: ["value"],
  setup(props, context) {

    const { vpc, isLoadingBtn, detailVyos: vyos, interfaces } = useNamespacedState(NETWORKVPC, ["vpc", "isLoadingBtn", "detailVyos", "interfaces"]);
    const { createNatGateway, DETAIL_VPC2, DETAIL_VYOS, fetchInterfaces } = useNamespacedActions(NETWORKVPC, [
      "createNatGateway",
      "DETAIL_VPC2",
      "DETAIL_VYOS",
      "fetchInterfaces"
    ]);
    
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
            context.emit('clearItem', {})
        }
        context.emit("input", val);
      },
    });

    const { vpcid, vyosid } = context.root._route.params;
    const type = ref('')
    const port = ref('')
    const protocol = ref('')
    const translation_address = ref('')
    const rule_number = ref('')
    const rule_desc = ref('')
    const routers = ref([])
    const address_chooices = ref([])
    const destination_address = ref([])
    const d_port = ref('')
    const t_port = ref('')
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))

    const $v = useVuelidate(
      {
        type: { required },
        // port: { required: requiredIf(() => type.value == 'many') },
        protocol: { required: requiredIf(() => type.value == 'many') },
        destination_address: { required },
        translation_address: { 
          required,
          // regex: {
          //   $message: "Invalid translation address value",
          //   $validator: (val) => {
          //     return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
          //       val
          //     );
          //   },
          // },
        },
        // rule_number: { required, numeric, $autoDirty: true },
        d_port: { required: requiredIf(() => type.value == 'many'), numeric, $autoDirty: true  },
        t_port: { required: requiredIf(() => type.value == 'many'), numeric, $autoDirty: true  },
        rule_desc: { 
          required,
          $autoDirty: true,
          conditional: {
            $message: "Special character is not allowed",
            $validator: (val) => {
              return /^[A-Za-z0-9\s\-_]+$/g.test(val);
            },
          }, 
        },
      },
      {
        type,
        // port,
        protocol,
        destination_address,
        translation_address,
        // rule_number,
        d_port,
        t_port,
        rule_desc,
      }
    )

    const types = ref([
      { text: 'SNAT', value: 'one'},
      { text: 'DNAT', value: 'many'},
    ])
    const protocols = ref([
      { text: 'TCP', value: 'tcp'},
      { text: 'UDP', value: 'udp'},
    ])

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      
      let payload = {
        instance_id: vyos.value.instance_id,
        rule_desc: rule_desc.value,
        // rule_number: rule_number.value,
        translation_address: translation_address.value.ip_address_internal,
        translation_name: translation_address.value.name,
        type: type.value,
        destination_address: destination_address.value
      }
      if(type.value == 'many'){
        payload.translation_port =  parseInt(t_port.value)
        payload.protocol =  protocol.value
        payload.destination_port = parseInt(d_port.value)
      }
      // console.log(payload)
      let resp = await createNatGateway(payload)
      if(resp.status == 200){
        dialog.value = false
        context.emit('refreshTab')
      }else{
        console.log(resp)
      }
    }

    onMounted(async () => {
      await DETAIL_VYOS({vyosid: vyosid})
      await DETAIL_VPC2({ id : vyos.value.vpc_id})
      await fetchInterfaces({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        instance_id: vyos.value.instance_id
      })
      routers.value = vpc.value.vyos[0] //gakepake
      address_chooices.value = vpc.value.instance
    })

    return{
      dialog,
      type,
      types,
      $v,
      port,
      protocol,
      translation_address,
      rule_number,
      rule_desc,
      create,
      isLoadingBtn,
      routers,
      protocols,
      d_port,
      t_port,
      address_chooices,
      destination_address,
      interfaces
    }
  },
}
</script>