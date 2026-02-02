import {ref} from '@vue/composition-api'

const isOpen = ref(false)

export default function billingModal() {

    const openModal = () => {
        isOpen.value = true
    }

    const closeModal = () => {
        isOpen.value = false
    }

    return {
        isOpen,
        openModal,
        closeModal
    }
}