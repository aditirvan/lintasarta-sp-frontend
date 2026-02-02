import { reactive, ref, onMounted } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { MANAGEVOUCHER } from './namespace'
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers"
export const useCreateVoucher = (props, context) => {
    const name = ref('')
    const description = ref('')
    const quota = ref(0)
    const day_duration = ref(0)
    const code = ref('')
    const instance = ref(0)
    const cpu = ref(0)
    const ram = ref(0)
    const volume_size = ref(0)
    const object_volume_size = ref(0)
    const root_disk_size = ref(0)
    const snapshot_size = ref(0)
    const total_object_volume = ref(0)
    const total_volume = ref(0)
    const total_snapshot = ref(0)
    const s_router = ref(0)
    const floating_ip = ref(0)
    const total_lb = ref(0)
    const nat_gateway = ref(0)
    const nat_gateway_fip = ref(0)
    const { addvoucher } = useNamespacedActions(MANAGEVOUCHER, ['addvoucher'])

    const voucheredit = ref(false)
    const { fetchvouchers } = useNamespacedActions(MANAGEVOUCHER, [
        "fetchvouchers",
    ]);
    const { vouchers, isLoading } = useNamespacedState(MANAGEVOUCHER, ["vouchers", 'isLoading']);
    onMounted(() => {
        fetchvouchers();
    });

    return {
        addvoucher,
        isVoucherLoading: isLoading,
        voucheredit,
        root_disk_size,
        name,
        description,
        quota,
        day_duration,
        code,
        instance,
        cpu,
        ram,
        volume_size,
        object_volume_size,
        snapshot_size,
        total_volume,
        total_object_volume,
        total_snapshot,
        s_router,
        floating_ip,
        total_lb,
        nat_gateway,
        nat_gateway_fip,
        vouchers
    }
}
