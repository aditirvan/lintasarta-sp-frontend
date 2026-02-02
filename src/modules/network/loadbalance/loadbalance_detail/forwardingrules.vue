<template>
    <tr>
      <td>
        <v-select
          hide-details
          class="labelinside"
          label="Protocol"
          append-icon="mdi-chevron-down"
          :items="selectInstanceProtocols"
          v-model="rule.protocol"
          placeholder="HTTP"
          @change="$emit('protocolChanges')"
          :disabled="!editMode"
          outlined
        ></v-select>
      </td>
      <td>
        <v-text-field
          hide-details
          class="labelinside"
          label="Port"
          placeholder="80"
          outlined
          v-model="rule.port"
          :disabled="!editMode"
          type="number"
        ></v-text-field>
      </td>
      <td>
        <v-icon style="margin-bottom: 8px">mdi-arrow-right</v-icon>
      </td>
      <td>
        <v-select
          hide-details
          class="labelinside"
          label="Protocol"
          append-icon="mdi-chevron-down"
          :items="selectInstanceProtocols"
          :disabled="!editMode"
          v-model="rule.instance_protocol"
          placeholder="HTTP"
          outlined
        ></v-select>
      </td>
      <td>
        <v-text-field
          hide-details
          class="labelinside"
          :disabled="!editMode"
          label="Port"
          placeholder="80"
          outlined
          type="number"
          v-model="rule.instance_port"
        ></v-text-field>
      </td>
      <td>
        <v-btn
          :disabled="!editMode"
          depressed
          height="44"
          width="103"
          color="error"
          @click="$emit('delete', rule)"
        >
        Delete
        </v-btn>
      </td>
    </tr>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { useLoadBalancer } from './../useLoadBalancer'

export default defineComponent({
    props: ['value', 'editMode'],
    setup(props){
        const { selectInstanceProtocols } = useLoadBalancer()
        const rule = ref(props.value)
        return {
            selectInstanceProtocols,
            rule,
        }
    }
})
</script>