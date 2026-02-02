import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";

export const by = [ 'service', 'item' ] as const
export type By = typeof by[number]

export const services = [
	"INSTANCE",
	"OS_CHARGING",
	"ROOT_DISK",
	"STORAGE",
	"OBJECT_STORAGE",
	"SNAPSHOT",
	"FLOATING_IP",
	"SLB",
	"DAILY_BACKUP",
	"MANAGE_SERVICE",
	"MANAGE_SERVICE_ADDON",
] as const

export type Service = typeof services[number]

export type Tag = {
  name: string 
  qty: number
}

export type ByService = {
  service_name: Service,
  id: string
  "tags": Tag[]
}

export type ByItem = {
  service_name: Service,
  id: string
}

export type ByCustom = {
  service_name: Service,
  id: string
}


export type Item = {
  project_id: string
  items: ByService | ByItem | ByCustom
}

export type NewServiceAvailability = {
	by   : 'service' | 'item'
	item : Item
}

export const useNewServiceAvailability = () => {
  const { checkNewServiceAvailability, multiCheckNewServiceAvailability } = useNamespacedActions('PROJECT', ["checkNewServiceAvailability", "multiCheckNewServiceAvailability"]);
  const { newServiceAvailability, isCheckNewServiceLoading, getprojectid } = useNamespacedGetters('PROJECT', ["newServiceAvailability", "getprojectid"]);

  const checkAvailability = async(item: NewServiceAvailability) => {

    const payload = {
      project_id: getprojectid.value,
      item: item,
    }
    
    await checkNewServiceAvailability(payload);
  }

  const multiCheckAvailability = async(items: NewServiceAvailability[]) => {

    const payload = {
      project_id: getprojectid.value,
      items: items,
    }
    
    await multiCheckNewServiceAvailability(payload);
  }

  return {
    checkAvailability,
    multiCheckAvailability,
    newServiceAvailability,
    isCheckNewServiceLoading,
  }
}

export default useNewServiceAvailability