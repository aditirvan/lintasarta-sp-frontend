<template>
	<div>
		<div class="py-6">
			<div class="dns-subtitle">DNS Name</div>
			<div class="project-link">
				<router-link to="/project/a">in Project A</router-link>
			</div>
		</div>

		<div class="row">
			<v-col cols="12">
				<v-card class="rounded-lg" flat>
					<v-card-title class="pr-8 pl-8 pt-8">
						<h4>Create New Record</h4>
					</v-card-title>
					<v-container class="pr-8 pl-8 pb-8">
						<v-tabs>
							<v-tab>A</v-tab>
							<v-tab>AAAA</v-tab>
							<v-tab>CNAME</v-tab>
							<v-tab>MX</v-tab>
							<v-tab>TXT</v-tab>
							<v-tab>NS</v-tab>
							<v-tab>SRV</v-tab>
							<v-tab>CAA</v-tab>

							<v-tab-item>
								<v-divider />
								<a-set />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<a-set />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<cname />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<mx />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<txt />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<ns />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<srv />
							</v-tab-item>

							<v-tab-item>
								<v-divider />
								<caa />
							</v-tab-item>
						</v-tabs>
					</v-container>
				</v-card>
			</v-col>
		</div>
	</div>
</template>

<script>
import ASet from "./dns/A.vue";
import Caa from "./dns/caa.vue";
import Cname from "./dns/Cname.vue";
import Mx from "./dns/mx.vue";
import Ns from "./dns/ns.vue";
import Srv from "./dns/srv.vue";
import Txt from "./dns/txt.vue";
export default {
	components: {
		ASet,
		Cname,
		Mx,
		Txt,
		Srv,
		Caa,
		Ns,
	},
};
</script>

<style scoped>
.v-btn {
	height: 55px !important;
}

.v-tab {
	font-style: normal !important;
	font-weight: bold !important;
	font-size: 14px !important;
	line-height: 140% !important;
}
</style>

<style scoped>
.empty-title-network {
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 140%;
	color: #556272;
}

.empty-content-network {
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 140%;
	color: #a5b3bf;
}

.dns-content {
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 140%;
	color: #a5b3bf;
}

.dns-subtitle {
	font-style: normal;
	font-weight: 600;
	font-size: 24px;
	line-height: 140%;
	color: #a5b3bf;
}

.project-link {
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 140%;
}

.v-btn__content {
	font-style: normal;
	font-weight: bold;
	font-size: 14px;
	line-height: 19px;
}
</style>