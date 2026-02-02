import VuecompositionApi, {ref} from '@vue/composition-api'
import Vue from 'vue'

Vue.use(VuecompositionApi)

const isOpen = ref(false)
const items = ref( ['HTTPS', 'FTP', 'HTTP'])
const data = ref(false)
const isDelete = ref(false)

export default function openModalAlerting() {

    const openModal = () => {
        isOpen.value = true
    } 

    const closeMOdal = () => {
        isOpen.value = false
    }

    const deleteModal = () => {
        isDelete.value = true
    }

    const confirmDelete = () => {
        isDelete.value = false
    }

    return {
        openModal,
        closeMOdal,
        deleteModal,
        confirmDelete,
        isOpen,
        data,
        items,
        isDelete
    }
    
}
