import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers"
import { ref } from "@vue/composition-api"

export const useCertificate = () => {
  const openDialogCreateCertificate = ref(false)
  const {
    fetchCertificates,
    fetchCertificateByID,
    createCertificate,
  } = useNamespacedActions('NETWORKLOADBALANCER', [
    'fetchCertificates',
    'fetchCertificateByID',
    'createCertificate',
  ])

  const selectedCertificate = ref(null)
  
  return {
    openDialogCreateCertificate,
    fetchCertificates,
    fetchCertificateByID,
    createCertificate,
    selectedCertificate,
    ...useNamespacedState('NETWORKLOADBALANCER', [
      'certificates',
      'certificate',
      'loadbalancers',
      'loadbalancer',
      'isLoading',
    ])
  }
}