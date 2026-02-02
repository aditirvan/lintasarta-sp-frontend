import {useNamespacedState} from 'vuex-composition-helpers'
export const useUserPermission = ()=>{
    const userpermissions = useNamespacedState('ROLEPERMISSION',['userpermissions'])
    return{
        userpermissions
    }
}