<template>
  <tr class="noborder">
    <td class="pl-0 py-0">
        <v-select
        :placeholder="$v.rule.server_name.$errors.length ? '' : 'Server Name'"
        append-icon="mdi-chevron-down"
        :items="instances"
        item-value="instanceName"
        :item-text="(val) => {
          return val.instanceName + ' - ' + val.ipv4
        }"
        return-object
        v-model="rule.server_name"
        outlined
        clearable
        single-line
        @change="() => {
          $emit('serverChanges', {name: rule.server_name, index: index})
          $v.rule.server_name.$touch()
        }"
        :error-messages="$v.rule.server_name.$errors.length?$v.rule.server_name.$errors[0].$message:''"
        ></v-select>
    </td>
    <td class="py-0">
      <v-text-field
        maxlength="50"
        :placeholder="$v.rule.server_port.$errors.length ? '' : 'Port'"
        single-line
        outlined
        v-model="rule.server_port"
        @change="() => {
          $emit('serverChanges', {port: rule.server_port, index: index})
          $v.rule.server_port.$touch()
        }"
        :error-messages="$v.rule.server_port.$errors.length?$v.rule.server_port.$errors[0].$message:''"
      ></v-text-field>
    </td>
    <td class="py-0">
      <v-text-field
        maxlength="50"
        :placeholder="$v.rule.server_max_conn.$errors.length ? '' : 'Max Connection'"
        single-line
        outlined
        v-model="rule.server_max_conn"
        @change="() => {
          $emit('serverChanges', {max_conn: rule.server_max_conn, index: index})
          $v.rule.server_max_conn.$touch()
        }"
        :error-messages="$v.rule.server_max_conn.$errors.length?$v.rule.server_max_conn.$errors[0].$message:''"
      ></v-text-field>
    </td>
    <td class="py-0">
      <v-text-field
        maxlength="50"
        :placeholder="$v.rule.server_weight.$errors.length ? '' : 'Weight'"
        single-line
        outlined
        v-model="rule.server_weight"
        suffix="%"
        @change="() => {
          $emit('serverChanges', {weight: rule.server_weight, index: index})
          $v.rule.server_weight.$touch()
        }"
        :error-messages="$v.rule.server_weight.$errors.length?$v.rule.server_weight.$errors[0].$message:''"
      ></v-text-field>
    </td>
    <td class="pr-0 justify-start d-flex py-1">
      <div style="width: 125px" class="text-right" v-if="lengthData>1">
        <v-btn
          height="50"
          color="error"
          block
          depressed
          dense
          @click="()=>{$emit('delete')}"
          >Delete</v-btn
        >
      </div>
    </td>
  </tr>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import {required, numeric, minValue, maxValue, helpers} from '@vuelidate/validators'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { computed, onMounted } from '@vue/composition-api';

export default {
  props: ['rule', 'index', 'instances', 'totalWeight', 'equalWeight', 'lengthData'],
  setup(props, {emit}) {
    const $v = useVuelidate({
      rule: {
        server_name:{
           required 
        },
        server_port: { required, numeric, $autoDirty: true, minValue: minValue(1) },
        server_max_conn: { required, numeric, $autoDirty: true, minValue: minValue(1) },
        server_weight: { required, numeric, minValue: minValue(1), maxWeight: helpers.withMessage(
            "maximum total Weight is 100%",
            val => { 
              let valid = true
              if(props.totalWeight > 100){
                valid = false
              } 
              return valid
            }
          )}
      }
    },
    {
      rule: props.rule
    })
    onMounted(() => {
    })

    return {
      $v,
    }
  },
}
</script>

<style scoped>
tr.noborder td {
  border-bottom: 0 !important;
}
</style>