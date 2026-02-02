<template>
	<v-container class="pa-8">
		<v-card outlined class="rounded-lg">
			<v-container>
				<div style="boder 1px solid blue">
					<v-row justify="center" align="center">
						<div class="text-center">
							<div class="empty-title-network pa-4">
								Looks like there are no domains here.
							</div>
							<div class="empty-content-network pa-4">
								You can add one easily, though. Enter a domain below and start
								managing your DNS with Lintasarta.
							</div>
						</div>
					</v-row>

					<v-row class="pt-6">
						<v-col cols="4">
							<v-text-field
								maxlength="50"
								label="Enter Domain"
								single-line
								outlined
								class="network-input"
							></v-text-field>
						</v-col>
						<v-col cols="4">
							<v-select
								label="Select Project"
								class="network-input"
								single-line
								outlined
								append-icon="mdi-chevron-down"
							></v-select>
						</v-col>
						<v-col cols="4">
							<router-link exact to="/network/dns/new-record">
								<v-btn block depressed class="secondary">Add Domain</v-btn>
							</router-link>
						</v-col>
					</v-row>
				</div>
			</v-container>
		</v-card>
	</v-container>
</template>

<script>
export default {};
</script>

<style scoped>
.v-btn {
	height: 50px !important;
}
</style>

