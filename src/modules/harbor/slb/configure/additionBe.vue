<template>
  <tr class="noborder py-0 ">
    <td class="py-0 ">
      <v-select
      style="width:230px"
      :placeholder="$v.rule.backend_name.$errors.length ? '' : 'Backend Name'"
      append-icon="mdi-chevron-down"
      :items="getListBe"
      item-value="backend_name"
      :item-text="(val) => {
        return val.backend_name + ' - ' + val.mode.toUpperCase()
      }"
      outlined
      single-line
      v-model="rule.backend_name"
      @change="() => {
        $emit('beChanges', {backend_name: rule.backend_name, index: index})
        $v.rule.backend_name.$touch()
      }"
      :error-messages="$v.rule.backend_name.$errors.length?$v.rule.backend_name.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0 ">
       <v-text-field
        maxlength="50"
        style="width:230px"
        :placeholder="$v.rule.name.$errors.length ? '' : 'Acl Name'"
        single-line
        v-model="rule.name"
        @change="() => {
          $emit('beChanges', {name: rule.name, index: index})
          $v.rule.name.$touch()
          }"
        :error-messages="$v.rule.name.$errors.length?$v.rule.name.$errors[0].$message:''"
        outlined></v-text-field>
    </td>
    <td class="py-0 ">
      <v-select
      style="width:150px"
      :placeholder="$v.rule.criterion.$errors.length ? '' : 'Criteria'"
      append-icon="mdi-chevron-down"
      :items="criterions"
      outlined
      single-line
      v-model="rule.criterion"
      @change="() => {
        $emit('beChanges', {criterion: rule.criterion, index: index})
          $v.rule.criterion.$touch()
      }"
      :error-messages="$v.rule.criterion.$errors.length?$v.rule.criterion.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0 ">
      <v-text-field
      style="width:350px"
        maxlength="50"
        :prefix="rule.criterion == 'path_beg' ? '/' : ''"
        :placeholder="$v.rule.value.$errors.length ? '' : rule.criterion == 'req.hdr(Host)' ? 'www.example.com' : rule.criterion == 'path_beg' ? 'example.php' : rule.criterion == 'path_end' ? '.php' : 'Value'"
        single-line
        outlined
        v-model="rule.value"
        @change="() => {
          $emit('beChanges', {value: rule.value, index: index})
          $v.rule.value.$touch()
        }"
        :error-messages="$v.rule.value.$errors.length?$v.rule.value.$errors[0].$message:''"
      ></v-text-field>
    </td>
    <td class="py-0 ">
      <v-select
      style="width:150px"
      :placeholder="$v.rule.cond.$errors.length ? '' : 'Condition'"
      append-icon="mdi-chevron-down"
      :items="condItems"
      v-model="rule.cond"
      outlined
      single-line
      @change="() => {
        $emit('beChanges', {cond: rule.cond, index: index})
        $v.rule.cond.$touch()
      }"
      :error-messages="$v.rule.cond.$errors.length?$v.rule.cond.$errors[0].$message:''"
      ></v-select>
    </td>

    <td class="pr-0 justify-start d-flex py-1">
      <div style="width: 125px" class="text-right">
        <v-btn
          height="50"
          color="error"
          block
          depressed
          dense
          @click="()=>{   
            $emit('delete', index)
          }"
          >Delete</v-btn
        >
      </div>
    </td>
  </tr>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import {required, maxValue} from '@vuelidate/validators'
import { onMounted, ref } from '@vue/composition-api';
import { SLB } from "../../../network/slb/namespace"
import { useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props: ['rule', 'index'],
  setup(props) {
    const condItems = ref([
      {
        text: 'Equal',
        value: 'if'
      },
      {
        text: 'Not Equal',
        value: 'unless'
      }
    ])
    const criterions = ref(["req.hdr(Host)", "path_beg", "path_end"])

    const { getListBe, getTotalRowsBe } = useNamespacedGetters(SLB, ["getListBe", "getTotalRowsBe",])
    const slb_id = localStorage.getItem('slb_id')

    const $v = useVuelidate({
      rule: {
        name:{
           required,
           $autoDirty: true,
           conditional: {
            $message: "Can only contains alphabet and underscore",
            $validator: (val) => {
                return /^[a-zA-Z_]+$/g.test(val);
            },
          },
        },
        criterion:{
          required
        },
        backend_name: { required },
        value: { 
          required,
          $autoDirty: true,
          conditional: {
            $message: "Can only contains alphabet, numeric, underscore, dot and slash",
            $validator: (val) => {
                return /^[a-zA-Z_.0-9/]+$/g.test(val);
            },
          },
        },
        cond: { required },
      }
    },
    {
      rule: props.rule
    })

    onMounted(() => {
    })

    return {
      $v,
      condItems,
      getListBe,
      criterions
    }
  },
}
</script>

<style scoped>
tr.noborder td {
  border-bottom: 0 !important;
}
</style>