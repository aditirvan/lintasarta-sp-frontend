import {ref} from '@vue/composition-api'

const isOpen = ref(false)
const projects = ref([])

export default function openCreateProjectModal (){

    const openModal = () => {
        isOpen.value = true
    }

    const closeModal = () => {
        isOpen.value = false
    }

    const addProject = (project) => {
        if(!project.value.name)throw new Error('provide name')
        projects.value.push(project)
    }

    return {
        projects,
        isOpen,
        addProject,
        openModal,
        closeModal,
    }

}