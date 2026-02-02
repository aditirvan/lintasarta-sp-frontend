<template>
  <tbody class="noborder">
    <tr>
      <td class="pl-0">
        <v-select
          class="labelinside"
          label="Protocol"
          append-icon="mdi-chevron-down"
          :items="selectInstanceProtocols"
          v-model="rule.source.protocol"
          @change="$emit('protocolChanges')"
          placeholder="HTTP"
          outlined
        ></v-select>
      </td>
      <td>
        <v-text-field
          maxlength="6"
          class="labelinside"
          label="Port"
          placeholder="80"
          v-model="rule.source.port"
          :value="getDefaultPort(rule.source.protocol, 'source')"
          outlined
        ></v-text-field>
      </td>
        <div>
        <v-icon class="mx-2" >mdi-arrow-right</v-icon>
        </div>
      <td>
        <v-select
          class="labelinside"
          label="Protocol"
          append-icon="mdi-chevron-down"
          :items="selectInstanceProtocols"
          v-model="rule.target.protocol"
          placeholder="HTTP"
          outlined
        ></v-select>
      </td>
      <td>
        <v-text-field
          maxlength="6"
          class="labelinside"
          label="Port"
          placeholder="80"
          type="number"
          v-model.number="rule.target.port"
          :value="getDefaultPort(rule.target.protocol, 'target')"
          outlined
          @change="() => {
            $v.rule.target.port.$touch()
            }"
          :error-messages="$v.rule.target.port.$errors.length?$v.rule.target.port.$errors[0].$message:''"
        ></v-text-field>
      </td>
      <td class="pr-0 justify-start d-flex">
        <div style="width: 125px" class="text-right">
          <v-btn
            @click="()=>{$emit('delete')}"
            height="50"
            color="error"
            block
            depressed
            >Delete</v-btn
          >
        </div>
      </td>
    </tr>
  </tbody>
</template>
<script>
import useVuelidate from '@vuelidate/core';
import {required, maxValue} from '@vuelidate/validators'
export default {
  props: ['rule', 'selectInstanceProtocols'],
  setup(props) {
      
      const portvalidator = {
        required, 
        maxValue: maxValue(65535)
      }
      
      const $v = useVuelidate({
          rule: {
              source:{
                  port: { required }
              },
              target:{
                  port: portvalidator
              }
          }
      },
      {
        rule: props.rule
      })
      
      const Touch = () => {
          $v.value.$touch()
      }

      const getDefaultPort = (protocol, sourceOrTarget) => {
        let val = ''
        switch (protocol) {
          case 'HTTP' : val = 80; break
          case 'HTTPS' : val = 443; break
          case 'FTP' : val = 21; break
          default: return
        }
        props.rule[sourceOrTarget].port = val
      }
      
      return {
          Touch,
          $v,
          getDefaultPort,
      }

  },
};
</script>
<style lang="scss" scoped>
.v-input{
  ::v-deep .v-text-field__details{
  position: inherit;
}
}

</style>