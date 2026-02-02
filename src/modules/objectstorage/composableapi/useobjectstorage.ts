import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { ref } from '@vue/composition-api'
export const useObjectStorage = () => {
    const { 
        createObjectStorage, 
        fetchObjectStorage, 
        fetchObjectStorages, 
        deleteObjectStorage,
        fetchS3DefaultPrice,
        fetchS3Flavors,
        fetchAccessKeys,
        createAccessKey,
        deleteAccessKey,
        updateCORS,
        revealAccessKey,
        fetchUsage,
        increaseVolume,
        createBucket,
        fetchCorsObjectStorage,
        fetchBuckets,
        deleteBucketById,
        getActiveRegionById,
    } = useNamespacedActions('OBJECTSTORAGE', [
        'createObjectStorage', 
        'fetchObjectStorages',
        'fetchObjectStorage',
        'fetchS3Flavors',
        'fetchS3DefaultPrice',
        'deleteObjectStorage',
        'fetchAccessKeys',
        'createAccessKey',
        'deleteAccessKey',
        'updateCORS',
        'revealAccessKey',
        'fetchUsage',
        'increaseVolume',
        'createBucket',
        'fetchCorsObjectStorage',
        'fetchBuckets',
        'deleteBucketById',
        'getActiveRegionById',
    ])

    const { 
        fetchmembers
    } = useNamespacedActions('MEMBER', [
        'fetchmembers'
    ])

    const { 
        members
    } = useNamespacedState('MEMBER', [
        'members'
    ])
    
    const { 
        fetchmembers: superadminFetchMembers
    } = useNamespacedActions('SUPERADMINMANAGEORG', [
        'fetchmembers'
    ])

    const { 
        members: membersFromSuperadmin
    } = useNamespacedState('SUPERADMINMANAGEORG', [
        'members'
    ])

    const role = localStorage.getItem('role')
    let listMembers = role == 'Superadmin' ? membersFromSuperadmin : members
    
    const selectedObjectStorage = ref({})
    const selectedS3Flavor = ref(null)
    const customQuota = ref(null)
    const isCustomQuotaHighlighted = ref(false)
    const fetchMembers = fetchmembers
        
    return {
        listMembers,
        superadminFetchMembers,
        fetchUsage,
        fetchMembers,
        members,
        customQuota,
        isCustomQuotaHighlighted,
        selectedS3Flavor,
        fetchObjectStorage,
        fetchObjectStorages,
        fetchS3DefaultPrice,
        fetchS3Flavors,
        selectedObjectStorage,
        createObjectStorage,
        deleteObjectStorage,
        fetchAccessKeys,
        createAccessKey,
        deleteAccessKey,
        updateCORS,
        revealAccessKey,
        increaseVolume,
        createBucket,
        fetchCorsObjectStorage,
        fetchBuckets,
        deleteBucketById,
        ...useNamespacedState('OBJECTSTORAGE', [
            'objectStorage',
            'objectStorageUsage',
            'objectStorages',
            's3Flavors',
            's3DefaultPrice',
            'isLoading',
            'accessKeys',
            'objectStorageCors',
            'buckets',
            
        ])
    }
}