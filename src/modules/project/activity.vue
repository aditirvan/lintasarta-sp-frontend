<template>
	<v-container :class="{animate:loading}" class="px-7">
		<div class="table-title">Activity</div>

		<v-data-table
			:class="{hidden:loading}"
			:headers="headers"
			:items="activities"
			:server-items-length="pagination.count"
			:options.sync="options"
			:items-per-page="10"
			class="elevation-0"
			hide-default-footer
		>
			<template v-slot:item.event="{ item }">
				<div class="d-flex">
					<div class="pa-2">
						<v-icon class="name">{{ converServiceName(item.service_name.toLowerCase())}}</v-icon>
					</div>

					<div>
						<div class="name">{{ item.service_name }}</div>
						<div>{{ item.action }} by {{item.user.fullname}} </div>
					</div>
				</div>
			</template>
			<template v-slot:item.date="{ item }">
				{{$moment(new Date(item.created_at)).format('DD/MM/YYYY h:mm A')}}
			</template>
			<template v-slot:footer="{ props }">
				<custom-footer-datatable v-if="pagination.count > 5" @input="(val)=>{options=val}" :props="props" />
			</template>
		</v-data-table>
	</v-container>
</template>


<script>
import { onMounted, reactive, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import {AUDITLOG} from '@/modules/auditlog/namespace'

export default {
	created(){
		this.getDataFromApi()
	},
	setup() {
		const {fetchactivities} = useNamespacedActions(AUDITLOG,['fetchactivities'])
		const {activities, pagination} = useNamespacedState(AUDITLOG,['activities','pagination'])
		const options = ref({})
		const loading = ref(true)
		const getDataFromApi = async()=>{
			loading.value = true
			try{
				await fetchactivities(options.value)
			}finally{
				loading.value = false
			}
		}
		onMounted(()=>{
			getDataFromApi()
		})
		watch(options,(val)=>{
			console.log(val)
			getDataFromApi()
		},{deep:true})
		const converServiceName = (name)=>{
			switch(name){
				case 'project': return '$vuetify.icons.projectIcon'
				case 'login' : return 'mdi-login'
				case 'addmembertoorg':
				case 'deleteorgmember': return 'mdi-account-multiple'
			}
		}
		return {
			converServiceName,
			headers: [
				{ text: "Event", value: "event", sortable: false },
				{ text: "IP Address", value: "ip_address", sortable: false },
				{ text: "Date", value: "date" },
			],
			activities,
			fetchactivities,
			pagination,
			options,
			getDataFromApi,
			loading
		};
	},
};
</script>

<style scoped>
.name {
	color: #1f60a8;
	padding-right: 4px;
}

.table-title {
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
	padding-top: 20px;
	padding-bottom: 30px;
}
</style>