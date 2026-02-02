import { INSTANCE } from '../namespace'
import {
    useNamespacedActions,
    useNamespacedState,
  } from "vuex-composition-helpers";
import { ref, computed} from  '@vue/composition-api'
export const useVpc = ()=>{
    const vpcidselected = ref("");
    const { fetchvpcs, fetchvpcports, fetchvpcportsfip, fetchvpcportsfiplist, fetchvpcportdetacheds, fetchvpcportfloatingips, fetchvpcportattached } = useNamespacedActions(INSTANCE,['fetchvpcs', 'fetchvpcports', 'fetchvpcportsfip', 'fetchvpcportsfiplist', 'fetchvpcportdetacheds', 'fetchvpcportfloatingips', 'fetchvpcportattached'])
    const { vpcs, vpcportfloatingips, vpcports, vpcportattached } = useNamespacedState(INSTANCE, ['vpcs', 'vpcportfloatingips', 'vpcports', 'vpcportattached'])
    const selectvpcs = computed(() => {
      return vpcs.value.map((e) => ({
          text: e.name,
          value: e.vpcid,
        }));
    });
    const selectvpcportbyins = computed(() => {
      return vpcports.value.map((e) => ({
          text: e.vpc_name+" ("+e.ip_address+")",
          value: e.id,
        }));
    });
    return {
        vpcidselected,
        fetchvpcs,
        vpcs,
        vpcports,
        vpcportfloatingips,
        selectvpcs,
        selectvpcportbyins,
        fetchvpcports,
        fetchvpcportsfip,
        fetchvpcportsfiplist,
        fetchvpcportdetacheds,
        fetchvpcportfloatingips,
        vpcportattached,
        fetchvpcportattached
    }
}