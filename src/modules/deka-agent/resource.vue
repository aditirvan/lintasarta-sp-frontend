<template>
    <!-- <v-container> -->

        <Agent  />

    <!-- </v-container>     -->
</template>

<script>

import Agent from "@/modules/deka-agent/agent";
// import { AccessControl } from "@/lib/middleware";
// import { ref } from "@vue/composition-api";


export default {
    components: {
        // instance,
        Agent,
    },
    setup(props, context) {
		// const access_control = new AccessControl(context.root.$store);
        // const not_hide = ref({
		// 	instance: access_control.isNotHideMenu("Project Instance"),
		// });

        return {
            // not_hide
        }

    }
}
</script>

<style scoped>
.table-title {
	font-family: Fira Sans;
	font-style: normal;
	font-weight: bold;
	font-size: 21px;
	line-height: 140%;
	color: #556272;
	padding-top: 30px;
}

.table-status {
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 22px;
	text-transform: capitalize;
	color: #a5b3bf;
	padding-top: 5px;
	padding-bottom: 20px;
}
</style>