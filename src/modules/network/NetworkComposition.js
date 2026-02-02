import Vue from 'vue'
import CompositionApi, {ref} from '@vue/composition-api'

Vue.use(CompositionApi)


const domains = ref([])
const loadbalances = ref([])
const floatingip = ref([])
const vpcs = ref([])
const isDelete = ref(false)
const isEditVpc = ref(false)
const deleteLoadBalance = ref(false)

export default function NetworkComposition() {
 
    
    const createDomain = (domain) => {
        domains.value.push(domain)
    }

    const createLoadbalance = (balance) => {
        loadbalances.value.push(balance)
    }

    const createFloatingIp = (ip) => {
        floatingip.value.push(ip)
    } 

    const createVpc = (vpc) => {
        vpcs.value.push(vpc)
    }

    const deleteModal = () => {
        isDelete.value = true
    }

    const confirmDelete = () => {
        isDelete.value = false
    }

    const editVpc = () => { 
        isEditVpc.value = true
    }

    const deleteLoadBalanceModal = () => {
        deleteLoadBalance.value = true
    }



    const confirmDeleteLoadBalance = () => {
        deleteLoadBalance.value = false
    }


    return {
        domains,
        createVpc,
        vpcs,
        createLoadbalance,
        createDomain,
        loadbalances,
        createFloatingIp,
        floatingip,
        isDelete,
        deleteModal,
        editVpc,
        isEditVpc,
        confirmDelete,
        confirmDeleteLoadBalance,
        deleteLoadBalance,
        deleteLoadBalanceModal
    }

} 