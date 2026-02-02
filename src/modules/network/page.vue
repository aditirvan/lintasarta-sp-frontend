<template>
	<div>
		<router-view></router-view>
		<router-view name="a"></router-view>
		<deletemodal />
	</div>
</template>

<script>
import deletemodal from "./deletemodal";
export default {
	components: {
		deletemodal,
	},
};
</script>

<style>
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
</style>