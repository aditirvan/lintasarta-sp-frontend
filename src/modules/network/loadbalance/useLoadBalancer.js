import { ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';

export const useLoadBalancer = () => {
    const selectHealthCheckProtocols = ref(['HTTP', 'HTTPS', 'FTP', 'PING', 'SCTP', 'TCP', 'TLS-HELLO', 'UDP-CONNECT']);
    const selectInstanceProtocols = ref(['TCP', 'UDP', 'HTTP', 'HTTPS', 'PROXY', 'PROXYV2']);
    const selectHTTPPaths = ref(['/', '/public', '/html']);

    const {
      createLoadBalancer,
      updateLoadBalancer,
      deleteLoadBalancer,
      fetchLoadBalancers,
      fetchCertificates,
      fetchLoadBalancerByID,
      assignFloatingIP,
    } = useNamespacedActions('NETWORKLOADBALANCER', [
      'createLoadBalancer',
      'updateLoadBalancer',
      'deleteLoadBalancer',
      'fetchLoadBalancers',
      'fetchCertificates',
      'fetchLoadBalancerByID',
      'assignFloatingIP',
    ])

    const {
      loadBalancer,
      loadBalancers,
      certificate,
      certificates,
      isLoading,
    } = useNamespacedState('NETWORKLOADBALANCER', [
      'loadBalancer',
      'loadBalancers',
      'certificate',
      'certificates',
      'isLoading',
    ])
    

    return {
        selectHealthCheckProtocols,
        selectInstanceProtocols,
        selectHTTPPaths,
        createLoadBalancer,
        updateLoadBalancer,
        deleteLoadBalancer,
        loadBalancer,
        loadBalancers,
        certificate,
        certificates,
        isLoading,
        fetchLoadBalancers,
        fetchCertificates,
        fetchLoadBalancerByID,
        assignFloatingIP,
    }
}