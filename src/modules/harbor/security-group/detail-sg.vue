<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card class="rounded-lg" flat>
					<v-container fluid class="ps-7">
						<v-row>
							<v-col cols="12">
								<div class="font-weight-bold fz-21" style="margin-bottom:6px">{{ SGRules.security_group_name }}</div>
								<div class="status">{{ SGRules.security_group_description }}</div>
								<div class="status">{{ totalRulesSG }} Rules </div>
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
						<!-- <v-tab class="px-8">Instance</v-tab>
						<v-tab class="px-8" v-if="!read_only">Destroy</v-tab> -->
						</v-tabs>
						<v-divider/>

						<v-tabs-items v-model="vtabs">
						<v-tab-item>
							<rules :security="[...inRules, ...outRules]" />
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
	</div>
</template>

<script>
import rules from "./rules";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
import INSTANCE from "@/modules/instance/namespace";
// import Loading from "@/components/Loading";
import {
	useNamespacedState,
	useNamespacedActions,
useNamespacedGetters,
} from "vuex-composition-helpers";

import { AccessControl } from "@/lib/middleware";
import { HARBOR } from "../namespace";

export default {
	components: { rules, },
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
        const { harborid, sg_id } = context.root.$route.params;

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

		const { instances } = useNamespacedState(INSTANCE, ["instances"]);
		const { fetchinstances } = useNamespacedActions(INSTANCE, ["fetchinstances"]);

        const { fetchSecurityGroupRules } = useNamespacedActions(HARBOR, ["fetchSecurityGroupRules"])
        const { SGRules, inRules, outRules, totalRulesSG } = useNamespacedGetters(HARBOR, ["SGRules", "inRules", "outRules", "totalRulesSG"])

		onMounted(async () => {
			// await fetchinstances({security_id:id, with_state:true})
            await fetchSecurityGroupRules({harborid: harborid, sg_id: sg_id})

			// await FETCH_SECURITY_DETAIL({ id })
		})

		const instance = reactive({
			headers: [
				{ text: "Name", value: "name" },
				{ text: "IP Address", value: "ip" },
				{ text: "Region", value: "region" },
				{ text: "Created Date", value: "createddate" },
			],
		});
		const isDelete = ref(false);

		function deleteModal() {
			isDelete.value = true;
		}

		async function confirmDelete() {
			// const response = await DELETE_SECURITY({ id })
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
            SGRules,
			inRules,
			outRules,
			totalRulesSG
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