<template>
	<div>
		<div>
			<v-subheader class="pl-0">Network</v-subheader>
			<h2>Balancer Name</h2>
			<span>In </span><span> Project A</span>
		</div>

		<v-row>
			<v-col cols="12">
				<v-card class="rounded-lg">
					<v-container class="pa-8">
						<h2>Setting</h2>
						<br />
						<hr />
						<v-row>
							<v-col cols="3"
								><div class="edit-label">Forwading Rules</div></v-col
							>
							<v-col cols="6" v-if="!isSetting">
								<div class="edit-content">
									HTTP on port 80 HTTP on port 80
								</div></v-col
							>
							<v-col cols="3" v-if="!isSetting" class="text-right py-6"
								><v-btn
									@click="isSetting = true"
									depressed
									dark
									class="accent rounded-lg"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="isSetting">
								<div class="text-right pa-4">
									<v-btn class="success" height="44" depressed>New Rule</v-btn>
								</div>
								<v-simple-table>
									<thead>
										<tr>
											<th>Load Balancer</th>
											<th></th>
											<th></th>
											<th>Instance</th>
											<th></th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<div class="pt-4">
													<v-select
														class="rounded-lg"
														label="Protocol"
														single-line
														items="HTTP"
														append-icon="mdi-chevron-down"
														outlined
													>
													</v-select>
												</div>
											</td>
											<td>
												<div class="full-input">
													<label for="name">Port</label>
													<input type="text" placeholder="80" />
												</div>
											</td>
											<td>
												<v-icon>mdi-arrow-right</v-icon>
											</td>
											<td>
												<div class="full-input d-flex">
													<div>
														<label for="name">Port</label>
														<select id="">
															<option value="http">HTTP</option>
														</select>
													</div>
													<v-icon>mdi-chevron-down</v-icon>
												</div>
											</td>
											<td>
												<div class="full-input">
													<label for="name">Port</label>
													<input type="text" placeholder="80" />
												</div>
											</td>
											<td>
												<div>
													<v-btn block depressed height="44" color="error"
														>Delete</v-btn
													>
												</div>
											</td>
										</tr>
									</tbody>
								</v-simple-table>

								<div class="d-flex">
									<v-btn depressed class="secondary ma-2">Save</v-btn>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="isSetting = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"><div class="edit-label">Algorithm</div></v-col>
							<v-col cols="6" v-if="!algo">
								<div class="edit-content">{{ algorithm }}</div></v-col
							>
							<v-col cols="3" v-if="!algo" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="algo = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="algo">
								<v-radio-group row v-model="algorithm">
									<v-radio label="Round Robin" value="Round Robin"></v-radio>
									<v-radio
										label="Least Connections"
										value="Least Connections"
									></v-radio>
								</v-radio-group>

								<div class="d-flex">
									<v-btn depressed class="secondary ma-2" @click="algo = false"
										>Save</v-btn
									>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="algo = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"
								><div class="edit-label">Health checks</div></v-col
							>
							<v-col cols="6" v-if="!health">
								<div class="edit-content">http://0.0.0.0:80/</div></v-col
							>
							<v-col cols="3" v-if="!health" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="health = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="health">
								<h4>TARGET</h4>

								<div style="overflow-x: auto; overflow-y: hidden">
									<table class="healt-check">
										<tbody>
											<tr>
												<td>
													<div class="full-input d-flex">
														<div>
															<label>Protocol</label>
															<select id="">
																<option value="http">HTTP</option>
															</select>
														</div>
														<v-icon>mdi-chevron-down</v-icon>
														<span class="success--text ml-auto pt-1">✔</span>
													</div>
												</td>
												<td style="padding-left: 20px">
													<div class="full-input d-flex">
														<div>
															<label>Port</label>
															<input type="text" placeholder="80" />
														</div>
														<span class="success--text ml-auto pt-1">✔</span>
													</div>
												</td>
												<td style="padding-left: 20px">
													<div class="full-input d-flex">
														<div>
															<label>Path</label>
															<select id="">
																<option value="http">/</option>
															</select>
														</div>
														<v-icon class="ml-auto">mdi-chevron-down</v-icon>
														<span class="success--text ml-auto pt-1">✔</span>
													</div>
												</td>
											</tr>
											<tr>
												<td colspan="5">
													<h4>ADDITIONAL SETTINGS</h4>
												</td>
											</tr>
											<tr>
												<td>
													<div class="full-input d-flex">
														<div>
															<label for="name">Check interval (in s)</label>
															<input type="text" placeholder="10" />
														</div>
														<span class="success--text pt-1">✔</span>
													</div>
												</td>
												<td style="padding-left: 20px">
													<div class="full-input d-flex">
														<div>
															<label for="name">Response Timeout (in s)</label>
															<input type="text" placeholder="5" />
														</div>
														<span class="success--text pt-1">✔</span>
													</div>
												</td>
												<td style="padding-left: 20px">
													<div class="full-input d-flex">
														<div>
															<label for="name">Response Timeout (in s)</label>
															<input type="text" placeholder="3" />
														</div>
														<span class="success--text pt-1">✔</span>
													</div>
												</td>
												<td style="padding-left: 20px">
													<div class="full-input d-flex">
														<div>
															<label for="name">Healthy Threshold</label>
															<input type="text" placeholder="5" />
														</div>
														<span class="success--text pt-1">✔</span>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<div class="d-flex">
									<v-btn
										depressed
										class="secondary ma-2"
										@click="health = false"
										>Save</v-btn
									>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="health = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"
								><div class="edit-label">Sticky sessions</div></v-col
							>
							<v-col cols="6" v-if="!session">
								<div class="edit-content">{{ stic_season }}</div>
							</v-col>
							<v-col cols="3" v-if="!session" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="session = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="session">
								<v-radio-group row v-model="stic_season">
									<v-radio label="None" value="Off"></v-radio>
									<v-radio label="Cookie" value="Cookie"></v-radio>
								</v-radio-group>

								<div class="d-flex">
									<v-btn
										depressed
										class="secondary ma-2"
										@click="session = false"
										>Save</v-btn
									>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="session = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"><div class="edit-label">SSL</div></v-col>
							<v-col cols="6" v-if="!ssl"
								><div class="edit-content">No redirect</div></v-col
							>
							<v-col cols="3" v-if="!ssl" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="ssl = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="ssl">
								<v-checkbox label="Redirect HTTP to HTTPS"></v-checkbox>
								<div class="d-flex">
									<v-btn depressed class="secondary ma-2" @click="ssl = false"
										>Save</v-btn
									>
									<v-btn depressed dark class="accent ma-2" @click="ssl = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"
								><div class="edit-label">Proxy Protocol</div></v-col
							>
							<v-col cols="6" v-if="!proxy"
								><div class="edit-content">Disabled</div></v-col
							>
							<v-col cols="3" v-if="!proxy" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="proxy = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="proxy">
								<v-checkbox label="Enable Proxy Protocol"></v-checkbox>
								<div class="d-flex">
									<v-btn depressed class="secondary ma-2">Save</v-btn>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="proxy = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"
								><div class="edit-label">Backend Keepalive</div></v-col
							>
							<v-col cols="6" v-if="!keepalive">
								<div class="edit-content">Disabled</div>
							</v-col>
							<v-col cols="3" v-if="!keepalive" class="text-right py-6"
								><v-btn
									class="accent rounded-lg"
									dark
									depressed
									@click="keepalive = true"
									>Edit</v-btn
								></v-col
							>
							<v-col cols="9" v-if="keepalive">
								<v-checkbox label="Enable Backend Keepalive"></v-checkbox>
								<div class="d-flex">
									<v-btn depressed class="secondary ma-2">Save</v-btn>
									<v-btn
										depressed
										dark
										class="accent ma-2"
										@click="keepalive = false"
										>Cancel</v-btn
									>
								</div>
							</v-col>
						</v-row>
						<hr />
						<v-row>
							<v-col cols="3"><div class="edit-label">Destroy</div></v-col>
							<v-col cols="6">
								<div class="edit-content">
									Your Load Balancer will be permanently destroyed. Any
									associated Instances will be disconnected and will stop
									receiving distributed traffic. Instances will not be
									destroyed.
								</div>
							</v-col>
							<v-col cols="3" class="text-right pt-7"
								><v-btn
									outlined
									depressed
									color="error"
									class="rounded-lg"
									@click="deleteLoadBalanceModal()"
									>Destroy</v-btn
								></v-col
							>
						</v-row>
						<hr />
					</v-container>
				</v-card>
			</v-col>
		</v-row>
		<deleteModal />
	</div>
</template>

<script>
import { ref } from "@vue/composition-api";
import network from "../NetworkComposition";
import deleteModal from "./delete";

export default {
	components: { deleteModal },
	data: () => ({
		items: ["HTTPS", "HTTP"],
		isSetting: false,
		algo: false,
		health: false,
		keepalive: false,
		proxy: false,
		ssl: false,
		session: false,
	}),

	setup() {
		const algorithm = ref("Round Robin");
		const stic_season = ref("Off");

		const { deleteLoadBalanceModal } = network();

		return {
			algorithm,
			stic_season,
			deleteLoadBalanceModal,
		};
	},
};
</script>

<style scoped>
.v-btn.secondary {
	height: 55px !important;
	width: 100px !important;
	border-radius: 8px !important;
}

.v-btn.accent {
	height: 55px !important;
	width: 100px !important;
	border-radius: 8px !important;
}

.v-btn.v-btn--outlined {
	height: 55px !important;
	width: 100px !important;
	border-radius: 8px !important;
}

/* tbody > tr {
	vertical-align: baseline;
} */

td {
	padding-bottom: 10px !important;
}

.edit-label {
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 140%;
	color: #556272;
	padding-top: 30px;
}

.edit-content {
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 140%;
	color: #556272;
	padding-top: 30px;
}

.form-wrapper {
	margin: 10px;
}
.full-input {
	padding: 3px;
	border: 1px solid #cad6e1;
	border-radius: 6px;
}
input {
	outline: none;
	border: none;
	display: block;
	line-height: 1.2em;
	font-size: 14pt;
	padding-left: 10px;
	width: 90px;
	font-size: 14px;
}

select {
	outline: none;
	border: none;
	display: block;
	line-height: 1.2em;
	font-size: 14pt;
	padding-left: 10px;
	width: 70px;
	color: grey;
	font-size: 14px;
}
label {
	display: block;
	font-size: 10px;
	color: grey;
	padding-left: 10px;
}
</style>