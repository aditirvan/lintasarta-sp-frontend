<template>
	<v-dialog width="565" v-model="deleteLoadBalance">
		<v-card class="rounded-lg">
			<v-container class="pa-7">
				<div class="modal-title">Destroy Load Balancer</div>
				<div class="modal-content py-5">Are you sure you want to proceed?</div>

				<p>
					<strong> nyc1-load-balancer-01 </strong> be permanently destroyed. Any
					associated Instance will be disconnected and will stop receiving
					distributed traffic. Droplets will not be destroyed.
				</p>

				<p>
					You will lose the provisioned IP address, which might impact any DNS
					records pointing to it. This will not affect any associated Instance.
				</p>

				<strong>Do you want to permanently destroy this?</strong>
				<v-row class="pt-7">
					<v-col cols="6"
						><v-btn
							dark
							class="accent"
							@click="confirmDeleteLoadBalance()"
							block
							depressed
							>Cancel</v-btn
						></v-col
					>
					<v-col cols="6"
						><v-btn
							color="error"
							depressed
							@click="confirmDeleteLoadBalance()"
							block
							>Confirm</v-btn
						></v-col
					>
				</v-row>
			</v-container>
		</v-card>
	</v-dialog>
</template>

<script>
import network from "../NetworkComposition";

export default {
	setup() {
		const { deleteLoadBalance, confirmDeleteLoadBalance } = network();

		return {
			deleteLoadBalance,
			confirmDeleteLoadBalance,
		};
	},
};
</script>

<style scoped>
.v-btn {
	height: 50px !important;
}

.modal-title {
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
}

.modal-content {
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 140%;
	color: #556272;
}
</style>