import {ref} from '@vue/composition-api'

const isOpen =  ref(false)
const project = ref(false)
const isLoading = ref(true)
const activeProject = ref("")

export default function openSelectProjectModal(){
    

    const openModal = () => {
        isOpen.value = true
    }

    const choseProject = (project) => {
        activeProject.value = project
    }

    const closeModal = () => {
        isOpen.value = false
    }

    const createProject = () => {
        project.value = true
    }

    return {
        isOpen,
        openModal,
        closeModal,
        createProject,
        project,
        isLoading,
        choseProject,
        activeProject
    }
}