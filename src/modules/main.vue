<template>
    <div>
    <HOMEPAGE v-if="isEmpty(user)"/>
    <DASHBOARD v-else />
    </div>
    <!-- <component :is="homepage"/> -->
    
</template>
<script>
import { ref } from '@vue/composition-api'
import {useGetters} from 'vuex-composition-helpers'
export default {
    setup(props,context){
        props;
        const { user } = useGetters({
            user: 'ROLEPERMISSION/getuser'
        })
        const homepage = ref('HOMEPAGE')
        const isEmpty = context.root.$lodash.isEmpty
        
        return {
            homepage,
            user,
            isEmpty
        }
    }
}
</script>
<style lang="scss" scoped>
.v-snack{
    ::v-deep .v-snack__content{
    text-align: center;
}
}

</style>