import { computed } from '@vue/composition-api';
import {useNamespacedActions, useNamespacedState} from 'vuex-composition-helpers'
export const useOrganization = ()=>{
    const {
        fetchorganizations,
      } = useNamespacedActions("ORGANIZATION", [
        "fetchorganizations",
      ]);
      const { organizations } = useNamespacedState(
        "ORGANIZATION",
        ["organizations"]
      );
      const selectorganizations = computed(()=>{
        const value = organizations.value as any
        return value.slice().map((x:any):any=>{
          return {value:x,text:x.name}
        })
      })
      return {
          fetchorganizations,
          organizations,
          selectorganizations
      }
}