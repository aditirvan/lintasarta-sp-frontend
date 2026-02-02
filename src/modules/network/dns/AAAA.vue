<template>
	<v-tab-item>
		<v-container>
			<div style="boder 1px solid blue">
				<p>
					Use @ to create the record at the root of the domain or enter a
					hostname to create it elsewhere. AAAA records are for IPv6 addresses
					only and tell a request where your domain should direct to.
				</p>
				<v-row>
					<v-col cols="3">
						<h4>HOSTNAME</h4>
						<v-text-field
							maxlength="50"
							label="Enter @ or hostname"
							single-line
							outlined
						></v-text-field>
					</v-col>
					<v-col cols="3">
						<h4>WILL REDIRECT TO</h4>
						<v-text-field
							maxlength="50"
							label="Select Resources or custome IP"
							single-line
							outlined
						></v-text-field>
					</v-col>
					<v-col cols="3">
						<h4>TTL (SECONDS)</h4>
						<v-text-field maxlength="50" label="Enter TTL" single-line outlined></v-text-field>
					</v-col>
					<v-col cols="3">
						<v-btn block class="secondary">Create Record</v-btn>
					</v-col>
				</v-row>
			</div>

			<h3>DNS Record</h3>
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
	</v-tab-item>
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
	height: 55px !important;
}
</style>