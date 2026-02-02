<template>
<div>
    <router-view></router-view>
</div>
</template>
<script>
import { useGetters } from 'vuex-composition-helpers'
export default {
    setup(props){
        props;
        const { dashboardComponent } = useGetters({
            dashboardComponent: 'DASHBOARD/dashboardComponent'
        })
        const breadcrumbs = [dashboardComponent.value['breadcrumbs']]
        return {
            breadcrumbs,
        }
    }
}
</script>