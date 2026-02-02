<template>
  <div>
		<div class="px-3">
			<v-row>
				<v-col cols="12" class="pl-0">
					<v-card class="rounded-0 rounded-t-lg" flat>
						<v-container fluid class="pa-7 pb-0">
							<!-- <div class="d-flex">
								<span class="page-title pb-5">Create VPC</span>
								<v-spacer></v-spacer>
							</div> -->
							<v-tabs class="pt-2">
								<v-tab to="/network/vpc/create/simple"><span>Wizard Simple</span></v-tab>
								<v-tab to="/network/vpc/create/expert"><span>Wizard Expert</span></v-tab>
							</v-tabs>
						</v-container>
					</v-card>
					<v-divider />

					<v-tabs-items v-model="$route.path" style="background: transparent">
						<v-tab-item value="/network/vpc/create/simple">
							<router-view></router-view>
						</v-tab-item>
						<v-tab-item value="/network/vpc/create/expert">
							<router-view></router-view>
						</v-tab-item>
					</v-tabs-items>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>