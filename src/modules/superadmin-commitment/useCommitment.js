import { ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'
import { SUPERADMINCOMMITMENT } from './namespace.ts'
export const useCommitment = () => {
    const { pagination, isLoading, commitments, optionsProject, commitment } = useNamespacedState(SUPERADMINCOMMITMENT, ['pagination', 'isLoading', 'commitments', 'optionsProject', 'commitment'])
    const { 
        GET_ALL_COMMITMENTS, 
        FETCH_PROJECTS,
        CREATE_COMMITMENT,
        SELECT_COMMITMENT,
        APPROVE_COMMITMENT,
        DECLINE_COMMITMENT,
    } = useNamespacedActions(SUPERADMINCOMMITMENT, [
        'GET_ALL_COMMITMENTS', 
        'FETCH_PROJECTS',
        'CREATE_COMMITMENT',
        'SELECT_COMMITMENT',
        'APPROVE_COMMITMENT',
        'DECLINE_COMMITMENT',
    ])
    
    const { organizations } = useNamespacedState(SUPERADMINMANAGEORG, ['organizations'])
    const { fetchorganizations } = useNamespacedActions(SUPERADMINMANAGEORG, ['fetchorganizations'])

    const selectedCommitment = ref({})
    const options = ref({ search: '', page: 1, organization_id: '', role_id: '' })
    const search = ref('')
    let timeout = setTimeout(() => {}, 500);
    
    const filterOrganization = ref()
    watch(filterOrganization, val => {
        options.value.organization_id = val
    })
    watch(search, val => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            options.value.search = val
            options.value.page = 1
        }, 500)
    })
    const searchorganization = ref('')
    watch (searchorganization, val => {
        fetchorganizations({ search: val })
    })
    return {
        optionsProject,
        pagination, 
        isLoading,
        options, 
        search,
        filterOrganization, 
        commitment, 
        commitments, 
        organizations, 
        searchorganization,
        fetchorganizations,
        selectedCommitment,
        GET_ALL_COMMITMENTS,
        CREATE_COMMITMENT,
        FETCH_PROJECTS,
        SELECT_COMMITMENT,
        APPROVE_COMMITMENT,
        DECLINE_COMMITMENT,
    }
}