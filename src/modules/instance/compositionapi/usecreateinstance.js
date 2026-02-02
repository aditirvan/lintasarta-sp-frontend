import {INSTANCE} from '../namespace'
import {
    useNamespacedActions,
  } from "vuex-composition-helpers";
export const useCreateInstance = ()=>{
    const { createinstance } = useNamespacedActions(INSTANCE,['createinstance'])
    return {
        createinstance
    }
}