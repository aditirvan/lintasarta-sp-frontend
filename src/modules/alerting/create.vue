<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card class="rounded-lg" flat>
					<v-container class="pa-8">
						<v-row>
							<v-col cols="9">
								<h2>Alerting</h2>
							</v-col>
							<v-col cols="3" class="text-center">
								<v-btn
									style="height: 45px; width: 150px"
									to="/alerting"
									class="secondary"
									>Create</v-btn
								>
							</v-col>
						</v-row>
						<br />

						<v-simple-table>
							<thead>
								<tr>
									<th>Type</th>
									<th>Applied to</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody style="font-weight: 600">
								<tr v-for="x in 5" :key="x">
									<td>
										Name <br />
										Condition
									</td>
									<td>All</td>
									<td>
										<span class="primary--text">Edit</span>
										<span class="pl-3 error--text pr-3">Delete</span>
									</td>
								</tr>
							</tbody>
						</v-simple-table>
					</v-container>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<style scoped>
.v-btn {
	height: 40px !important;
}
</style>