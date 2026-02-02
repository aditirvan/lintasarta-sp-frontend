import { onMounted, ref, watch } from '@vue/composition-api'
import { useMember } from '../organization/usemember'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { State } from '../organization/organization.store'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'
import { SUPERADMINMANAGEUSER } from './namespace'
export const useUser = () => {
    const name = ref('')
    const phone = ref('')
    const email = ref('')
    const org = ref('')
    const orgs = ref([])
    const role = ref('')
    const status = ref('')
    const { fetchmembers, deletememberselected, } = useMember()
    const { fetchorganizations, fetchprojects, fetchorganizationsall } = useNamespacedActions(SUPERADMINMANAGEORG, ['fetchorganizations', 'fetchprojects', 'fetchorganizationsall'])

    const { organizations, projects, organizationsall } = useNamespacedState<State>(SUPERADMINMANAGEORG, ['organizations', 'projects', 'organizationsall'])
    
    const searchorganizationselectoption = ref('')
    watch(searchorganizationselectoption, val => {
        fetchorganizationsall({ search: val })
    })

    const searchorganization = ref('')
    watch(searchorganization, val => {
        fetchorganizations({ search: val })
    })
    const projectsselected = ref([])
    watch(org, (val, old) => {
        if(old && val){
        projectsselected.value = []
        fetchprojects({ id: val, itemsPerPage:-1 })
        }
        
    })
    const searchprojectbyorg = ref()
    watch(searchprojectbyorg, val => {
        if(org.value){
            fetchprojects({ id: org.value, search: val, itemsPerPage:-1 })
        }
    })
    const { addmember, editmember } = useNamespacedActions(SUPERADMINMANAGEUSER, ['addmember', 'editmember'])
    return {
        name, phone, email, org, orgs, role, status,
        fetchmembers, addmember, deletememberselected,
        fetchorganizations, organizations, searchorganization,
        fetchprojects, projects, projectsselected, editmember,
        searchprojectbyorg,
        searchorganizationselectoption,
        organizationsall,
    }
}