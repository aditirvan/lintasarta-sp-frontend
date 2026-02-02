<template>
	<v-container>
		<div class="dns-content">
			SRV records specify the location (hostname and port number) of servers for
			specific services. You can use service records to direct certain types of
			traffic to particular servers.
		</div>
		<v-row class="pt-8">
			<v-col cols="3">
				<div class="domain-input-label">HOSTNAME</div>
				<v-text-field
					maxlength="50"
					label="e.g_service._protocol"
					single-line
					outlined
				></v-text-field>
			</v-col>
			<v-col cols="6">
				<div class="domain-input-label">WILL DIRECT TO</div>
				<v-text-field
					maxlength="50"
					label="Enter @ or hostname (e.g. www or domain.com.)"
					single-line
					outlined
				></v-text-field>
			</v-col>
			<v-col cols="3">
				<div class="domain-input-label">PORT</div>
				<v-text-field maxlength="50" label="e.g 5060" single-line outlined></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="2">
				<div class="domain-input-label">PRIORITY</div>
				<v-text-field label="e.g. 10" single-line outlined></v-text-field>
			</v-col>
			<v-col cols="2">
				<div class="domain-input-label">WEIGHT</div>
				<v-text-field maxlength="50" label="e.g. 100" single-line outlined></v-text-field>
			</v-col>
			<v-col cols="2">
				<div class="domain-input-label">TTL (SECONDS)</div>
				<v-text-field maxlength="50" label="Enter TTL" single-line outlined></v-text-field>
			</v-col>
			<v-col cols="3">
				<dir class="pt-7">
					<v-btn block class="primary">Create Record</v-btn>
				</dir>
			</v-col>
		</v-row>

		<h3>DNS Record</h3>
		<br />
		<v-simple-table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Hostname</th>
					<th>Value</th>
					<th>TTL (Second)</th>
					<th>Action</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="item in dns" :key="item.hostname">
					<td>{{ item.type }}</td>
					<td>{{ item.hostname }}</td>
					<td><small>redirects to</small> <br />{{ item.value }}</td>
					<td>{{ item.ttl }}</td>
					<td>
						<span class="text-primary"
							>Action <v-icon>mdi-chevron-down</v-icon></span
						>
					</td>
				</tr>
			</tbody>
		</v-simple-table>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		dns: [
			{
				type: "NS",
				hostname: "xxx.yz.yzx",
				value: "ns1.lintasarta.com",
				ttl: 1800,
			},
		],
	}),
};
</script>

<style scoped>
.v-btn {
	height: 50px !important;
}
</style>