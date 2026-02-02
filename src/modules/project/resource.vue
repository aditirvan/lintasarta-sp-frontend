<template>	
	<div>
		<v-container class="px-7" v-if="currentProj && currentProj.dekaprime_project_id && !currentProj.openstack_project_id">
			<!-- <div class="table-title mb-4">Instance</div> -->
			<VdcDP v-if="!loading" />
			<InstanceDP v-if="!loading" />

			<!-- <div class="table-title mb-4">Network</div> -->
			<NetworkDP v-if="!loading" />
			<Security v-if="!loading" />
		</v-container>
		<v-container class="px-7" v-else-if="currentProj && !currentProj.dekaprime_project_id && currentProj.openstack_project_id">
			<div class="table-title mb-4" v-if="not_hide.instance">Instance </div>
			<instance v-if="not_hide.instance" />
			<div class="font-weight-bold fz-21 font--text mb-4" v-if="not_hide.storage">Storage</div>
			<storage v-if="not_hide.storage" />
			<div class="font-weight-bold fz-21 font--text mb-4" v-if="not_hide.images">Custom Image</div>
			<images v-if="not_hide.images" />
		</v-container>
		<v-container v-else class="rounded-lg mt-4 mb-4" flat outlined>
			<template>
				<v-tabs v-model="tab" class="mb-0 mt-2">
				<v-tab class="fz-12 firewall-title" >Deka Flexi</v-tab>
				<v-tab class="fz-12 firewall-title" >Deka Prime</v-tab>
				</v-tabs>
			</template>
			<v-tabs-items v-model="tab" class="mb-2">
				<v-tab-item>
				<v-card flat class="pa-4 ma-4">

					<div class="headline font-weight-bold font--text mb-4">Instance</div>

					<instance />
					<!-- <div class="headline font-weight-bold font--text">Object Storage</div>

					<objectstorage /> -->

					<div class="headline font-weight-bold font--text  mb-4">Storage</div>
					<storage />

					<div class="headline font-weight-bold font--text  mb-4">Image</div>

					<images />
				</v-card>
				</v-tab-item>

				<v-tab-item>
				<v-card flat class="px-4 ">
					<VdcDP v-if="!loading" />
					<InstanceDP v-if="!loading" />
					<NetworkDP v-if="!loading" />
					<!-- <div class="table-title mb-4">Instance</div>
					<instanceDekaprime />
					<div class="table-title mb-4">Network</div>
					<networkDekaprime /> -->
					<Security v-if="!loading" />
				</v-card>
				</v-tab-item>

			</v-tabs-items>
		</v-container>
	</div>
</template>

<script>
import storage from "@/modules/storage/storage.vue"
// import storage from "./resource/storage";
// import objectstorage from "./resource/objectstorage";
import VdcDP from '../deka-prime/vdc/vdc.vue'
import instance from "./resource/instance";
import images from './resource/image'
import instanceDekaprime from "@/modules/project/resource/instanceDekaprime";
import networkDekaprime from "@/modules/project/resource/networkDekaprime";
import EdgeGatewayDP from '../superadmin-dp-edgegateway/edge-gateway.vue'
import InstanceDP from '../deka-prime/vdc/vdc-tabs.vue'
import NetworkDP from '../deka-prime/networking/networking.vue'
import Security from '../deka-prime/security/security.vue'
import { onMounted, ref } from "@vue/composition-api";

import { AccessControl } from "@/lib/middleware";
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from '../superadmin-dp-edgegateway/namespace';

export default {
	components: {
		storage,
		// objectstorage,
		instance,
		images,
		instanceDekaprime,
		networkDekaprime,
		InstanceDP,
		NetworkDP,
		Security,
		VdcDP,
	},
	setup(props, context) {
		const { dekaprimeVdcByProject } = useNamespacedActions(EDGEGATEWAY, [ "dekaprimeVdcByProject"])
		const { vdcProject } = useNamespacedGetters(EDGEGATEWAY, ["vdcProject"])
		onMounted(async() => {
			currentProj.value = JSON.parse(localStorage.getItem("currentProj") || "{}")
			// loading.value = true
			// await dekaprimeVdcByProject({projectDPId: currentProj.value.dekaprime_project_id })
			// localStorage.setItem('vdcById', JSON.stringify(vdcProject.value))
			// loading.value = false
		})
		const tab = ref(0)
		const access_control = new AccessControl(context.root.$store);
		// const currentProj = JSON.parse(localStorage.getItem("currentProj") || "{}");
		const currentProj = ref();
		const not_hide = ref({
			instance: access_control.isNotHideMenu("Project Instance"),
			images: access_control.isNotHideMenu("Project Images"),
			storage: access_control.isNotHideMenu("Project Storage")
		});
		const loading = ref(false);

		return {
			not_hide,
			loading,			
			currentProj,
			tab,
		};
	},
};
</script>

<style scoped>
.table-title {
	font-family: Fira Sans;
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
	padding-top: 30px;
}

.table-status {
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 22px;
	text-transform: capitalize;
	color: #a5b3bf;
	padding-top: 5px;
	padding-bottom: 20px;
}
</style>