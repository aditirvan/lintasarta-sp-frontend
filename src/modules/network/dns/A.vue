<template>
	<v-container>
		<div style="boder 1px solid blue">
			<div class="dns-content">
				Use @ to create the record at the root of the domain or enter a hostname
				to create it elsewhere. A records are for IPv4 addresses only and tell a
				request where your domain should direct to.
			</div>
			<v-row class="pt-8">
				<v-col cols="3">
					<div class="domain-input-label">HOSTNAME</div>
					<v-text-field
						maxlength="50"
						label="Enter @ or hostname"
						single-line
						outlined
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<div class="domain-input-label">WILL REDIRECT TO</div>
					<v-text-field
						maxlength="50"
						label="Select Resources or custome IP"
						single-line
						outlined
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<div class="domain-input-label">TTL (SECONDS)</div>
					<v-text-field maxlength="50" label="Enter TTL" single-line outlined></v-text-field>
				</v-col>
				<v-col cols="3">
					<div class="pt-7">
						<v-btn block class="secondary" @click="addDomain()"
							>Create Record</v-btn
						>
					</div>
				</v-col>
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
import network from "../NetworkComposition";
export default {
	data: () => ({
		dns: [
			{
				type: "NS",
				hostname: "xxx.yz.yzx",
				value: "ns1.lintasarta.com",
				ttl: 1800,
			},
			{
				type: "NS",
				hostname: "xxx.yz.yx",
				value: "ns1.lintasarta.com",
				ttl: 1800,
			},
			{
				type: "NS",
				hostname: "xxx.yz.zx",
				value: "ns1.lintasarta.com",
				ttl: 1800,
			},
			{
				type: "NS",
				hostname: "xxx.yz.x",
				value: "ns1.lintasarta.com",
				ttl: 1800,
			},
		],
		items: [
			{ title: "Click Me" },
			{ title: "Click Me" },
			{ title: "Click Me" },
			{ title: "Click Me 2" },
		],
	}),

	setup() {
		const { createDomain } = network();

		function addDomain() {
			createDomain({ name: "test" });
			this.$router.push("/network/dns");
		}

		return {
			addDomain,
		};
	},
};
</script>

<style scoped>
.v-btn {
	height: 50px !important;
}
</style>

<style>
.domain-input-label {
	font-style: normal;
	font-weight: bold;
	font-size: 14px;
	line-height: 140%;
	color: #556272;
	padding-bottom: 10px;
}
</style>