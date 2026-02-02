<template>
	<v-dialog width="480" v-model="isDelete">
		<v-card class="rounded-lg">
			<v-container class="pa-4">
				<div class="modal-title">Delete Alert</div>
				<div class="modal-content py-5">Are you sure you want to proceed?</div>
				<v-row>
					<v-col cols="6"
						><v-btn dark class="grey lighten-1" @click="confirmDelete()" block
							>Cancel</v-btn
						></v-col
					>
					<v-col cols="6"
						><v-btn color="error" @click="confirmDelete()" block
							>Confirm</v-btn
						></v-col
					>
				</v-row>
			</v-container>
		</v-card>
	</v-dialog>
</template>

<script>
import network from "./NetworkComposition";

export default {
	setup() {
		const { isDelete, confirmDelete } = network();

		return {
			isDelete,
			confirmDelete,
		};
	},
};
</script>

<style scoped>
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