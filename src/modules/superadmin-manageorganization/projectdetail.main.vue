<template>
    <router-view  v-if="currentProj" :project="currentProj" />
</template>
<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api'
import {useNamespacedState, useNamespacedMutations} from 'vuex-composition-helpers'
import {SUPERADMIN} from '../superadmin/namespace'
export default defineComponent({
    setup(props, context){
        onMounted(()=>{
        })
        const {setCurrentProj} = useNamespacedMutations(SUPERADMIN,['setCurrentProj'])
        const {currentProj} = useNamespacedState(SUPERADMIN,['currentProj'])
        return {
            currentProj,
            setCurrentProj
        }
    },
})
</script>