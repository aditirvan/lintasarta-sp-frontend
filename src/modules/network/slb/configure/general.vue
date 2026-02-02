<template>
	<div>
		<v-card class="rounded-lg pa-3" flat>
				<v-row class="d-flex ml-1">
					<v-col
					cols="12"
					sm="12"
					md="8"
					lg="6">
						<v-card
						outlined
						class="rounded-lg fullheight"
						style="border-color: #2c94d2">
							<v-card-text>
								<div class="d-flex flex-column">
									<div class="d-flex align-center mb-2">
										<span class="font-weight-bold fz-18">{{ slbVal.slb_instance_name }}</span>
										<v-spacer></v-spacer>
										<v-chip
											class="ma-2"
											color="green"
											text-color="white"
										>
											{{ slbVal.status }}
										</v-chip>
									</div>
									<v-divider style="border: 0.5px dashed #2c94d2" />
									<!-- <div class="d-flex flex-row mt-3 mb-0" :class="{'mb-2': slbVal.instance && slbVal.instance.length>1}">
										<div class="d-flex align-center head">
											<p :class="{'my-0': slbVal.instance && slbVal.instance.length>1}">Floating IP</p>
										</div>
										<v-spacer></v-spacer>
										<div class="d-flex flex-column">
											<p v-for="instance in slbVal.instance" :key="instance.id" class="my-0" :class="{'mb-1': slbVal.instance && slbVal.instance.length>1}">{{ instance.floating_ip_id }}</p>
										</div>
									</div> -->
									<div class="d-flex flex-row head mt-3 mb-0">
										<p>Floating IP</p>
										<v-spacer></v-spacer>
										<!-- <p v-for="instance in slbVal.instance" :key="instance.id">{{ instance.floating_ip_id }}</p> -->
										<p>{{ slbVal.floating_ip_slb }}</p>
									</div>
									<div class="d-flex flex-row head py-0 my-0">
										<p>IP Internal</p>
										<v-spacer></v-spacer>
										<p>{{ slbVal.internal_ip_slb }}</p>
									</div>
									<div class="d-flex flex-row head py-0 my-0">
										<p>Flavor</p>
										<v-spacer></v-spacer>
										<p>{{ slbVal.flavor}}</p>
									</div>
									<div v-if="slbVal.tier" class="d-flex flex-row head py-0 my-0">
										<p>Tier</p>
										<v-spacer></v-spacer>
										<p>{{ slbVal.tier.toLowerCase() === 'slb' ? 'Server Load Balancer' : 'Global Load Balancer' }}</p>
									</div>
									<!-- <div class="d-flex flex-row head py-0 my-0">
										<p>High Availability</p>
										<v-spacer></v-spacer>
										<p>{{ slbVal.ha_count == 1 ? 'No' : 'Yes'}}</p>
									</div> -->
								</div>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
		</v-card>
	</div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'
export default {
	setup() {
		const slbItem = JSON.parse(localStorage.getItem('slb'))
		const slbVal = ref([])

		onMounted(() => {
			slbVal.value = slbItem
		})
		return{
			slbVal
		}
	},
}
</script>

<style lang="scss" scoped>
.head{
	p:first-child{
		font-weight: 700;
	}
}
</style>