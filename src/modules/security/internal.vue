<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card class="rounded-lg" flat>
					<v-container fluid class="ps-7">
						<v-row>
							<v-col cols="12">
								<div class="font-weight-bold fz-21" style="margin-bottom:6px">{{ security.name }}</div>
								<div class="status">{{ security.description }}</div>
								<div class="status">{{ security && security.security_rules ? security.security_rules.length : 0 }} Rules / {{ security && security.instance_ids ? security.instance_ids.length : 0 }} Instance</div>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12">
				<v-card class="rounded-lg" flat>
					<v-tabs v-model="vtabs" height="64" slider-size="4">
						<v-tab class="px-8">Rules</v-tab>
						<v-tab class="px-8">Instance</v-tab>
						<v-tab class="px-8" v-if="!read_only">Destroy</v-tab>
						</v-tabs>
						<v-divider/>

						<v-tabs-items v-model="vtabs">
						<v-tab-item>
							<rules :security="security" />
						</v-tab-item>
						<v-tab-item>
							<v-container class="pa-7">
								<v-data-table
									:headers="instance.headers"
									:items="securityinstances"
									:items-per-page="10"
									class="elevation-0"
									hide-default-footer
									:no-data-text="`There is no instance attached to this firewall`"
								>
									<template v-slot:item.name="{ item }">
										<div class="d-flex instance-name">
											<!-- <div class="dotblue mt-2"></div> -->
											<v-tooltip top color="#333" transition="slide-y-reverse-transition">
												<template v-slot:activator="{ on, attrs }">
												<div v-on="on" v-bind="attrs">
													<!-- If vm is deleting -->
													<beat-loader
													v-if="item.is_deleting"
													:isLoading="true"
													:color="'#eb5757'"
													:size="'10px'"
													class="mr-2"
													></beat-loader>
													<!-- If vm has error message -->
													<v-icon
													v-else-if="item.error_message"
													class="mr-3"
													v-on="on"
													v-bind="attrs"
													color="error"
													>mdi-close-circle</v-icon
													>
													<!-- If vm status is on loading -->
													<Loading v-else-if="(item.state === 'loading')" :loading_model="'style-a'"/>
													<!-- If vm has been built and has state -->
													<v-icon
													v-else-if="(!item.error_message && item.openstack_vm_uuid) || item.state === 'NOT EXIST'"
													class="mr-3"
													v-on="on"
													v-bind="attrs"
													:color="getStatusColor(item)"
													>mdi-circle</v-icon
													>
													<!-- If vm is building -->
													<beat-loader
													v-else-if="!item.error_message && !item.openstack_vm_uuid"
													:isLoading="true"
													:color="'#1f60a8'"
													:size="'10px'"
													class="mr-2"
													></beat-loader>
												</div>
												</template>
												<!-- If vm is deleting -->
												<span v-if="item.is_deleting">Deleting</span>
												<!-- If vm has error message -->
												<span v-else-if="item.error_message">{{ item.error_message }}</span>
												<!-- If vm has been built and has state -->
												<span v-else-if="!item.error_message && item.openstack_vm_uuid">
												{{
													item.state
													? capitalizeFirstLetter(item.state.replaceAll("_", " "))
													: "N/A"
												}}</span
												>
												<!-- If vm is building -->
												<span v-else-if="!item.error_message && !item.openstack_vm_uuid"
												>Building</span
												>
											</v-tooltip>
											<div>
												<router-link :to="{ path: `/instance/${item.id}/` }"
													><span class="primary--text">{{
														item.instanceName
													}}</span></router-link
												>
												<p>
													{{ item.package.v_cpu }}vCPU / {{ item.package.ram }} RAM / {{ item.package.root_disk }} Root Disk
												</p>
											</div>
										</div>
									</template>
									<template v-slot:item.ip="{ item }">
										<!-- <table class="table-ip">
											<tr v-if="item.ipv4">
												<td style="padding-top: 0 !important;padding-bottom: 0 !important">Internal</td>
												<td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.ipv4 }}</td>
											</tr>
											<tr v-if="item.ip_gateway">
												<td style="padding-top: 0 !important;padding-bottom: 0 !important">Gateway</td>
												<td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.ip_gateway }}</td>
											</tr>
											<tr v-if="item.ipext">
												<td style="padding-top: 0 !important;padding-bottom: 0 !important">External</td>
												<td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ item.ipext }}</td>
											</tr>
										</table> -->
										<div 
										v-if="item.ins_vpc_port != null"
										>          
											<span class="primary--text"
												@click="
												() => {
													openIpAddressDialog = true;
													activemenuinstance = item;
												}
												"
											>
												See all IP Address
											</span>          
										</div>
										<div
										v-else
										>          
											<span>
												No IP Attached
											</span>          
										</div>
									</template>
									<template v-slot:item.created_at="{ item }">
										{{ $moment(new Date(item.created_at)).format('DD/MM/YYYY') }}
									</template>
									<template v-slot:item.region="{ item }">
										{{ item.region.city }}
									</template>
									<template v-slot:item.vpc_port="{ item }">
										{{ item.vpc_name }} ({{ item.ip_address
										}}{{ item.floating_ip ? ", " + item.floating_ip : "" }})
									</template>
								</v-data-table>
							</v-container>
						</v-tab-item>
						<v-tab-item v-if="!read_only">
							<v-container class="pa-7">
								<v-row>
									<v-col cols="8">
										<div class="title">Destroy</div>
										<div class="content pt-4">
											This is irreversible. Your Firewall will be destroyed, and
											any Instances will be dissociated from them.
										</div>
									</v-col>
									<v-col cols="4">
										<div class="pt-4 text-right">
											<v-btn
												@click="
												() => {
												validateprivilages([
													'Security',
													'editor',
												]).then(() => {
													deleteModal();
												});
												}
												"
												outlined
												color="error"
												width="150"
												height="45"
											>
												Destroy
											</v-btn>
										</div>
									</v-col>
								</v-row>
							</v-container>
						</v-tab-item>
						</v-tabs-items>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog width="713" v-model="isDelete">
			<v-card class="rounded-lg">
				<v-container class="pa-4">
					<div class="modal-title">Destroy Firewall</div>
					<div class="modal-content py-5">
						<p>
							This is irreversible. Your Firewall will be destroyed, and any
							Instance will be dissociated from them.
						</p>
						<p>
							Once this happens, the Instance will allow any type of inbound and
							outbound traffic, unless you've configured a software firewall in
							them.
						</p>
						<p>Do you want to permanently destroy this?</p>
					</div>
					<v-row>
						<v-col cols="6"
							><v-btn
								:disabled="isLoading"
								class="accent"
								depressed
								@click="() => { isDelete = false }"
								block
								>Cancel</v-btn
							></v-col
						>
						<v-col cols="6">
							<v-btn color="error" :disabled="isLoading" depressed 
							@click="
							() => {
							validateprivilages([
								'Security',
								'editor',
							]).then(() => {
								confirmDelete()
							});
							}
							"
							block>
								<beat-loader v-if="isLoading" :disabled="isLoading" :loading="isLoading" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
								<span v-else>Confirm</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
		</v-dialog>
		<dialogIpAddress v-if="openIpAddressDialog" v-model="openIpAddressDialog" :item="activemenuinstance" />
	</div>
</template>

<script>
import rules from "./rules";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import INSTANCE from "@/modules/instance/namespace";
import Loading from "@/components/Loading";
import dialogIpAddress from "@/modules/instance/dialogIpAddress";
import {
	useNamespacedState,
	useNamespacedActions,
} from "vuex-composition-helpers";

import { AccessControl } from "@/lib/middleware";

export default {
	components: { rules, Loading, dialogIpAddress },
	methods: {
		getStatusColor: function(instance){
			if (
				["RESIZE", "RESIZING", "VERIFY_RESIZE"].includes(instance.state) ||
				!["", null].includes(instance.revert_expired)
			)
				return "orange";
			else if (instance.state == "ACTIVE") return "primary";
			else if (instance.state == "SHUTOFF") return "error";
			else if (instance.state == "" || instance.state == "NOT EXIST") return "disabled";
			else return "error";
		},
		capitalizeFirstLetter: function(string){
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		}
	},
	setup(props, context) {
		const access_control = new AccessControl(context.root.$store);
		const read_only = ref(access_control.is_read_mode('Project Security'));
		const { id } = context.root._route.params

		const { 
			security,
			isLoading, 
		} = useNamespacedState('SECURITY', [
			'security',
			'isLoading',
		])

		const { FETCH_SECURITY_DETAIL, DELETE_SECURITY } = useNamespacedActions('SECURITY', [
			'FETCH_SECURITY_DETAIL',
			'DELETE_SECURITY',
		])

		const { instances, securityinstances } = useNamespacedState(INSTANCE, ["instances", "securityinstances"]);
		const { fetchinstances, fetchsecurityinstances } = useNamespacedActions(INSTANCE, ["fetchinstances", "fetchsecurityinstances"]);


		onMounted(async () => {
			await fetchsecurityinstances(id)
			await FETCH_SECURITY_DETAIL({ id })
		})

		const instance = reactive({
			headers: [
				{ text: "Name", value: "instance_name" },
				{ text: "VPC Port", value: "vpc_port" },
				// { text: "IP Address", value: "ip" },
				// { text: "Region", value: "region" },
				{ text: "Created Date", value: "created_at" },
			],
		});
		const isDelete = ref(false);

		function deleteModal() {
			isDelete.value = true;
		}

		async function confirmDelete() {
			const response = await DELETE_SECURITY({ id })
			if(response.status === 200) context.root.$router.replace('/security')
		}


		const {validateprivilages, validateprivilagesync,validateprivilagesyncnew} = useNamespacedActions("HOMEPAGE", [
		"validateprivilages", "validateprivilagesync", "validateprivilagesyncnew"
		]);
		
		const vtabs = ref()
		return {
			read_only,

			validateprivilages, validateprivilagesync,validateprivilagesyncnew,
			instances,
			isLoading,
			security,
			vtabs,
			deleteModal,
			isDelete,
			confirmDelete,
			instance,
			securityinstances,
		};
	},
	data() {
		return {
		openIpAddressDialog: false,
		};
	},
};
</script>

<style scoped>
.title {
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
}
.status {
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	line-height: 140%;
	color: #a5b3bf;
}

.content {
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 140%;
}

.modal-title {
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
}

.modal-content {
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 140%;

	color: #556272;
}
</style>