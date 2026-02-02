import { computed, ref } from "@vue/composition-api";
import {
    useNamespacedActions,
    useNamespacedMutations,
    useNamespacedState
  } from "vuex-composition-helpers";
const PROJECT = 'PROJECT'
import localstorage from '@/lib/localstorage'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'

export const useProjects = ()=>{
    const user_role = localstorage.getItem('role')
    const store = (user_role == 'Superadmin' || user_role == 'GodMode')? SUPERADMINMANAGEORG: PROJECT
    
    const { projects } = useNamespacedState<any>(store,
        ['projects'])
    // const { projectsDownload } = useNamespacedState<any>(store,
    //         ['projectsDownload'])
    const projectsselected = ref([])
    const projectselected = ref()
    const selectprojects = computed(()=>{
        return projects.value.map((e:any)=>{
            return {
                value: e.id,
                text: e.name,
                openstack_project_id: e.openstack_project_id,
            }
        })
    })

    const selectprojectsDownloads = computed(()=>{
        return projects.value.map((e:any)=>{
            return {
                value: e.id,
                text: e.name,
                openstack_project_id: e.openstack_project_id,
            }
        })
    })
    // const selectprojectsWithAll = computed(()=>{
    //     return projects.value.map((e:any)=>{
    //         console.log(e);
    //         return {
    //             value: e.id,
    //             text: e.name,
    //             openstack_project_id: e.openstack_project_id,
    //         }
    //     })
    // })
    const { fetchprojects } = useNamespacedActions(store,['fetchprojects'])
    const { fetchprojectsSelectOption } = useNamespacedActions(store,['fetchprojectsSelectOption'])
    const {selectModal} = useNamespacedState(PROJECT,['selectModal'])
    const {setselectmodal} = useNamespacedMutations(PROJECT,['setselectmodal'])
    const SelectModal = computed({
        get: ()=>selectModal.value,
        set:(val)=>setselectmodal(val)
    })
    return {
        projectsselected,
        SelectModal,
        fetchprojects,
        projects,
        selectprojects,
        selectprojectsDownloads,
        projectselected,
        fetchprojectsSelectOption
    }
}
