import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { IMAGES } from '../namespace'
import { useCreatedInstance } from '../../instance/compositionapi/usecreatedinstance'
const { required } = require("@vuelidate/validators");
import { useVuelidate } from '@vuelidate/core'
import { computed, ref } from '@vue/composition-api';

export const useBackupInstance = () => {
    const Composable = {
        ...useCreatedInstance()
    }

    const {
        enableBackup,
        disableBackup,
        fetchBackups,
    } = useNamespacedActions(IMAGES, [
        'enableBackup',
        'disableBackup',
        'fetchBackups'
    ])

    const {
        backups,
        backupIsLoading,
    } = useNamespacedState(IMAGES, [
        'backups',
        'backupIsLoading'
    ])

    const { instanceselected, instanceSelect, instancesActive} = Composable
    const instancecanbackupselected = computed(()=>{
        return instancesActive.value.slice().filter((s)=>{
            return !s.value.enablebackup
        })
    })

    const durationOptions = ref([
        {
            text: '7 Days',
            value: 7
        },
        {
            text: '14 Days',
            value: 14
        },
        {
            text: '30 Days',
            value: 30
        },
        {
            text: '90 Days',
            value: 90
        },
        {
            text: '365 Days',
            value: 365
        },
    ])

    const hourList = () => {
        let arr = []
        let obj = {}
        for (let i = 0; i <= 23; i++) {
             obj = {
                 text: `${i < 10 ? `0${i}` : i}:00`,
                 value: i
             }
             arr.push(obj)
        }
        return arr
    }

    const timeOptions = hourList()
    const selectedInstance = ref(null)
    const selectedTime = ref(null)
    const selectedDuration = ref(null)
    const backupName = ref(null)
    const hour = ref(null)

    return {
        backupIsLoading,
        instancecanbackupselected,
        ...Composable,
        durationOptions,
        hour,
        backupName,
        selectedDuration,
        timeOptions,
        selectedTime,
        backups,
        enableBackup,
        disableBackup,
        selectedInstance,
        fetchBackups,
        instancesActive,
    }
}