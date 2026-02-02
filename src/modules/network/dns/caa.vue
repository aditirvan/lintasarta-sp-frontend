<template>
	<v-container>
		<div style="boder 1px solid blue">
			<div class="dns-content">
				CAA records specify which certificate authorities are permitted to issue
				certificates for a domain. Use them to reduce the risk of unintended
				certificate mis-issue.
			</div>
			<v-row class="pt-7">
				<div style="width: 227px; padding-left: 10px">
					<div class="domain-input-label">HOSTNAME</div>
					<v-text-field
						maxlength="50"
						label="e.g_service._protocol"
						single-line
						outlined
					></v-text-field>
				</div>
				<div style="width: 195px; padding-left: 20px">
					<div class="domain-input-label">AUTHORITY GRANTED FOR</div>
					<v-text-field
						maxlength="50"
						label="e.g mydomain.com"
						single-line
						outlined
					></v-text-field>
				</div>
				<div style="width: 142px; padding-left: 20px">
					<div class="domain-input-label">TAG</div>
					<v-select
						:items="items"
						label="Choose a tag"
						single-line
						outlined
					></v-select>
				</div>
				<div style="width: 108px; padding-left: 20px">
					<div class="domain-input-label">FLAGS</div>
					<v-text-field label="e.g." single-line outlined></v-text-field>
				</div>
				<div style="width: 115px; padding-left: 20px">
					<div class="domain-input-label">TTL (SECOND)</div>
					<v-text-field maxlength="50" label="Enter TTL" single-line outlined></v-text-field>
				</div>
				<div style="width: 121px; padding-left: 20px">
					<div class="pt-7">
						<v-btn block class="secondary">Create Record</v-btn>
					</div>
				</div>
			</v-row>
		</div>

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
						<span class="primary--text edit">Edit</span>
						<span class="error--text pr-3 delete ml-4">Delete</span>
					</td>
				</tr>
			</tbody>
		</v-simple-table>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		items: ["Test 1", "Test 2"],
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