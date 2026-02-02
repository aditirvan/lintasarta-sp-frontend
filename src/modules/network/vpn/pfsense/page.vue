<template>
	<div>
		<div class="px-3">
			<v-row>
				<v-col cols="12" class="pl-0">
					<v-card class="rounded-0 rounded-t-lg" flat>
						<v-container fluid class="pa-7 pb-0">
							<!-- <div class="d-flex">
								<span class="page-title pb-5">Configuration VPN</span>
								<v-spacer></v-spacer>
								<v-btn
								v-if="path != '' && getTotalRowsOpenvpn > 1"
								width="150"
								height="50"
								class="secondary fz-14"
								depressed
								:to="path"
								>
										Create {{ $route.path == '/network/vpn/config/openvpn' ? 'OpenVPN' : '' }}
								</v-btn>
							</div> -->
							<v-tabs class="pt-2">
								<v-tab to="/network/vpn/config/ipsec"><span>IPsec</span></v-tab>
								<v-tab to="/network/vpn/config/openvpn"><span>OpenVPN</span></v-tab>
								<v-tab v-if="user_role=='Superadmin'" to="/network/vpn/config/restartservice"><span>Settings</span></v-tab>
								<!-- <v-tab to="/network/vpn/config/export"><span>Client Export</span></v-tab> -->
							</v-tabs>
						</v-container>
					</v-card>
					<v-divider />

					<v-tabs-items v-model="$route.path" style="background: transparent">
						<v-tab-item value="/network/vpn/config/ipsec">
							<router-view></router-view>
						</v-tab-item>
						<v-tab-item value="/network/vpn/config/openvpn">
							<router-view></router-view>
						</v-tab-item>
						<v-tab-item value="/network/vpn/config/restartservice">
							<router-view></router-view>
						</v-tab-item>
						<!-- <v-tab-item value="/network/vpn/config/export">
							<router-view></router-view>
						</v-tab-item> -->
					</v-tabs-items>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { VPN } from '../namespace'
import localstorage from "@/lib/localstorage";

export default {
	setup(props, context) {
		const { fetchOpenVpn,  } = useNamespacedActions(VPN, ["fetchOpenVpn",])
		const { getTotalRowsOpenvpn } = useNamespacedGetters(VPN, [ "getTotalRowsOpenvpn",])
		let currentProj = JSON.parse(localStorage.getItem('currentProj'))
		let currentVpn = JSON.parse(localStorage.getItem('vpn'))
		const user_role = localstorage.getItem("role");
		
		const options = ref({
			page: 1,
			itemsPerPage: 10,
			sortBy: [],
			sortDesc: [],
			projek: currentProj.openstack_project_id,
			instance_name: currentVpn.instance_name
		})

		const path = ref('')
		watch(() => context.root.$route.path, (newVal) => {
		if(newVal == '/network/vpn/config/openvpn'){
			path.value = '/network/vpn/config/openvpn/create'
		}else{
			path.value = ''
		}
		})

		onMounted(async() => {
			await fetchOpenVpn(options.value)
			if(context.root.$route.path == '/network/vpn/config/openvpn'){
				path.value = 'network/vpn/config/openvpn/create'
			}else{
				path.value = ''
			}
		})

		return {
			path,
			getTotalRowsOpenvpn,
			user_role
		}
	},
}
</script>

<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>
