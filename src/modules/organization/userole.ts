import { computed, ref } from "@vue/composition-api";
import {
    useNamespacedActions,
    useNamespacedState
} from "vuex-composition-helpers";
const ROLEPERMISSION = 'ROLEPERMISSION'
import localstorage from '@/lib/localstorage'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'


export const useRoles = () => {
    const user_role = localstorage.getItem('role')
    const store = (user_role == 'Superadmin') ? SUPERADMINMANAGEORG : ROLEPERMISSION
    const { roles } = useNamespacedState(store,
        ['roles'])


    const selectroles = computed(() => {
        const roles1 = roles as any
        return roles1.value.map((e: any) => {
            return {
                value: e.id,
                text: e.name
            }
        })
    })
    const { fetchRoles } = useNamespacedActions(store, ['fetchRoles'])
    return {
        fetchRoles,
        roles,
        selectroles,
        roleselected: ref('')
    }
}