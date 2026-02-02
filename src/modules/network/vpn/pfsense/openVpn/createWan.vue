<template>
	<div>
		<v-row>
			<v-col cols="12" class="d-flex flex-row align-center">
				<p class="fz-18 mb-0" style="font-weight: 600">
					Create WAN
				</p>
				<v-spacer />
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" md="6">
				<p class="font-weight-bold">Destination IP</p>
				<div class="d-flex">
					<v-text-field
					v-model="rule.dst"
					maxlength="50"
					placeholder="Destination IP"
					single-line
					outlined
					@change="() => {
						$emit('dataRule', { name: 'create_wan', dst: rule.dst })
					}"
					:error-messages="$v.rule.dst.$errors.length?$v.rule.dst.$errors[0].$message:''"
					></v-text-field>
					<v-select
						class="ml-2"
						placeholder="Choose Network Size"
						v-model="rule.prefix_cwan"
						:items="prefixes"
						outlined
						prefix="/"
						single-line
						@change="() => {
							$emit('dataRule', { name: 'create_wan', prefix_cwan: rule.prefix_cwan})
						}"
						:error-messages="$v.rule.prefix_cwan.$errors.length?$v.rule.prefix_cwan.$errors[0].$message:''"
						></v-select>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, requiredIf, maxValue} from '@vuelidate/validators'
import { ref } from '@vue/composition-api'

export default {
	props: ['rule'],
	setup(props) {
		const prefixes = ref([8, 16, 24, 30])
		const $v = useVuelidate({
      rule: {
				dst: { required },
				prefix_cwan: { required }
      }
    },
    {
      rule: props.rule
    })

		return{
			$v,
			prefixes
		}
	},
}
</script>