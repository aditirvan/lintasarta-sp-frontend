<template>
  <tr class="noborder">
    <td class="py-0 pl-0" v-if="phase == 1">
      <v-select
        append-icon="mdi-chevron-down"
        :placeholder="$v.rule.name.$errors.length ? '' : 'Name'"
        outlined
        single-line
        :items="name_alghoritms"
        v-model="rule.name"
        @change="() => {
          $emit('dataIpChange', {name: rule.name, index: index, phase: phase})
          $v.rule.name.$touch()
        }"
        :error-messages="$v.rule.name.$errors.length?$v.rule.name.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0" v-if="phase == 1">
      <v-select
      v-if="rule.name == 'aes' || rule.name == 'blowfish'"
      :items="keyLengths"
      class="labelinside"
      append-icon="mdi-chevron-down"
      :placeholder="$v.rule.key_length.$errors.length ? '' : 'Key length'"
      :disabled="rule.name == 'cast128' || rule.name == '3des'"
      outlined
      @change="() => {
        $emit('dataIpChange', {key_length: rule.key_length, index: index, phase: phase})
        $v.rule.name.$touch()
      }"
      v-model="rule.key_length"
      :error-messages="$v.rule.key_length.$errors.length?$v.rule.key_length.$errors[0].$message:''"
      ></v-select>
      <v-select
      v-else
      :items="keyLengths2"
      class="labelinside"
      append-icon="mdi-chevron-down"
      :placeholder="$v.rule.key_length.$errors.length ? '' : 'Key length'"
      :disabled="rule.name == 'cast128' || rule.name == '3des'"
      outlined
      @change="() => {
        $emit('dataIpChange', {key_length: rule.key_length, index: index, phase: phase})
        $v.rule.name.$touch()
      }"
      v-model="rule.key_length"
      :error-messages="$v.rule.key_length.$errors.length?$v.rule.key_length.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0" v-if="phase == 1">
      <v-select
      class="labelinside"
      append-icon="mdi-chevron-down"
      :placeholder="$v.rule.hash.$errors.length ? '' : 'Hash'"
      :items="hashs"
      outlined
      @change="() => {
        $emit('dataIpChange', {hash: rule.hash, index: index, phase: phase})
        $v.rule.name.$touch()
      }"
      v-model="rule.hash"
      :error-messages="$v.rule.hash.$errors.length?$v.rule.hash.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0" v-if="phase == 1">
      <v-autocomplete
      :items="psfItems"
      :placeholder="$v.rule.dh_group.$errors.length ? '' : 'DH Group'"
      single-line
      outlined
      @change="() => {
        $emit('dataIpChange', {dh_group: rule.dh_group, index: index, phase: phase})
        $v.rule.name.$touch()
      }"
      v-model="rule.dh_group"
      :error-messages="$v.rule.dh_group.$errors.length?$v.rule.dh_group.$errors[0].$message:''"
      ></v-autocomplete>
    </td>
    <td class="py-0 pl-0" v-if="phase == 2">
      <v-select
        append-icon="mdi-chevron-down"
        placeholder="Name"
        outlined
        single-line
        readonly
        :items="choiceName"
        v-model="rule.name"
        @change="() => {
          $emit('dataIpChange', {name: rule.name, index: index, phase: phase})
          $v.rule.name.$touch()
        }"
        :error-messages="$v.rule.name.$errors.length?$v.rule.name.$errors[0].$message:''"
      ></v-select>
    </td>
    <td class="py-0" v-if="phase == 2">
      <v-select
      :items="rule.name == 'aes' || rule.name == 'blowfish' ? keyLengths : keyLengths2"
      :disabled="rule.name == '3des' && rule.name == 'cast128'"
      class="labelinside"
      append-icon="mdi-chevron-down"
      placeholder="Key length"
      outlined
      readonly
      @change="() => {
        $emit('dataIpChange', {key_length: rule.key_length, index: index, phase: phase})
        $v.rule.key_length.$touch()
      }"
      v-model="rule.key_length"
      :error-messages="$v.rule.key_length.$errors.length?$v.rule.key_length.$errors[0].$message:''"
      ></v-select>
    </td>
    <td  class="pr-0 py-0 justify-start d-flex" v-if="lengthRow > 1 && phase == 1">
      <div style="width: 125px" class="text-right">
        <v-btn
          height="50"
          color="error"
          block
          depressed
          @click="()=>{$emit('delete')}"
          >Delete</v-btn
        >
      </div>
    </td>
  </tr>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'

export default {
  props: ["rule", "index", "phase", "choiceName", "lengthRow"],
  setup(props, context) {
    const keyLengths = ref([128, 192, 256])
    const keyLengths2 = ref([128, 96, 64])
    const name_alghoritms = ref([
      {text: "AES", value: 'aes' },
      {text: "AES128-GCM", value: 'aes128gcm'},
      {text: "AES192-GCM", value: 'aes192gcm' },
      {text: "AES256-GCM", value: 'aes256gcm' },
      // {text: "Blowfish", value: 'blowfish' },
      // {text: "3DES", value: '3des' },
      // {text: "CAST128", value: 'cast128'},
    ])
    const hashs = ref([
      {text: "MD5", value: 'md5' },
      {text: "SHA1", value: 'sha1'},
      {text: "SHA256", value: 'sha256'},
      {text: "SHA384", value: 'sha384'},
      {text: "SHA512", value: 'sha512'},
      {text: "AES-XCBC", value: 'aesxcbx'}
    ])
    const psfItems = ref([
      {value: "1", text: "1 (768 bit)"}, { value: "2", text: "2 (1024 bit)" }, {value: "5", text: "5 (1536 bit)" }, {value:"14", text:"14 (2048 bit)" }, {value:"15", text:"15 (3072 bit)"}, {value:"16", text:"16 (4096 bit)"}, 
      {value:"17", text:"17 (6144 bit)"}, {value:"18", text:"18 (8192 bit)"}, {value:"19", text:"19 (nist ecp256)"}, {value:"20", text:"20 (nist ecp384)"}, {value:"21", text:"21 (nist ecp521)"}, {value:"22", text:"22 (1024(sub 160) bit)"}, 
      {value:"23", text:"23 (2048(sub 224) bit)"}, {value:"24", text:"24 (2048(sub 256) bit)"}, {value:"25", text:"25 (nist ecp192)"}, {value:"26", text:"26 (nist ecp224)"}, {value:"27", text:"27 (brainpool ecp224)"}, {value:"28", text:"28 (brainpool ecp256)"},
      {value:"29", text:"29 (brainpool ecp384)"}, {value:"30", text:"30 (brainpool ecp512)"}, {value:"31", text:"31 (Elliptic Curve 25519, 256 bit)"}, {value:"32", text:"32 (Elliptic Curve 448, 448 bit)"}
    ])
    const $v = useVuelidate({
      rule: {
        name:{
           required 
        },
        key_length: { required: requiredIf(() => { return props.rule.name != '3des' && props.rule.name != 'cast128'}) },
        hash: { required: requiredIf( () => { return props.phase == 1}) },
        dh_group: { required: requiredIf( () => { return props.phase == 1}) },
      }
    },
    {
      rule: props.rule
    })

    onMounted(() => {
      // console.log(props.rule)
    })

    return{
      $v,
      keyLengths,
      keyLengths2,
      name_alghoritms,
      hashs,
      psfItems
    }
  },
}
</script>

<style scoped>
tr.noborder td {
  border-bottom: 0 !important;
}
</style>
