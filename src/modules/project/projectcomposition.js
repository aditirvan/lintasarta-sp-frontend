import VueComposistionApi, {ref} from '@vue/composition-api';

import Vue from 'vue'

Vue.use(VueComposistionApi)

const project = ref([])

export default function projectComposition() {

    const addProject = (new_project) => {
        project.value.push(new_project.value)
    }

    return {
        addProject,
        project
    }
}