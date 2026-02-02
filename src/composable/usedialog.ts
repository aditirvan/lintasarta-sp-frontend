import { computed } from '@vue/composition-api'
import { useNamespacedMutations } from 'vuex-composition-helpers'

export const useDialog = (props:any,context:{emit:any})=>{
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
          context.emit("input", val);
        },
      });

    const {
        setopendialogcommonwarning,
        setmessagecommonwarning,
        setopendialogcommonsuccess,
        setmessagecommonsuccess,
    } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonwarning",
      "setmessagecommonwarning",
      "setopendialogcommonsuccess",
      "setmessagecommonsuccess",
    ]);

    const showCommonDialogSuccess = (message = null) => {
      if(message) setmessagecommonsuccess(message)
      setopendialogcommonsuccess(true)
    }

    const showCommonDialogWarning = (message = null) => {
      if(message) setmessagecommonwarning(message)
      setopendialogcommonwarning(true)
    }

    return {
        dialog,
        showCommonDialogSuccess,
        showCommonDialogWarning,
    }
}