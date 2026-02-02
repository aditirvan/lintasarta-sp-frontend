<template>
	<v-container>
		<div class="dns-content">
			TXT records are used to associate a string of text with a hostname. These
			are primarily used for verification.
		</div>
		<v-row class="pt-7">
			<v-col class="12">
				<div class="domain-input-label">VALUE</div>
				<v-text-field
					maxlength="255"
					label="Paste TXT string here"
					single-line
					outlined
				></v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="3">
				<div class="domain-input-label">HOSTNAME</div>
				<v-text-field
					maxlength="50"
					label="Enter @ or hostname"
					single-line
					outlined
				></v-text-field>
			</v-col>
			<v-col cols="2">
				<div class="domain-input-label">TTL (SECONDS)</div>
				<v-text-field maxlength="50" label="Enter TTL" single-line outlined></v-text-field>
			</v-col>
			<v-col cols="3">
				<br />
				<v-btn block class="secondary">Create Record</v-btn>
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
	height: 55px !important;
}
</style>