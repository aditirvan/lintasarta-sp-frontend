import { INSTANCE } from "../namespace";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import {
  ref,
  computed,
  Ref,
  ComputedRef,
  onMounted,
} from "@vue/composition-api";

type Select = {
  value: any;
  text: string;
};
type instanceSelectT = ComputedRef<Array<Select>>;
export const useCreatedInstance = () => {
  const instanceselected: Ref<string> | Ref<any> = ref("");
  const instancesselected = ref([]);
  const { fetchinstances, fetchActiveInstances, fetchvpcportenabled, fetchsecurityinstances } = useNamespacedActions(
    INSTANCE,
    ["fetchinstances", "fetchActiveInstances", "fetchvpcportenabled", "fetchsecurityinstances"]
  );
  const {
    instances,
    activeInstances,
    securityinstances
  }: { instances: Ref<Array<any>>; activeInstances: Ref<Array<any>>; securityinstances: Ref<Array<any>>;} =
    useNamespacedState(INSTANCE, ["instances", "activeInstances", "securityinstances"]);

  function isSelected(id: string) {
    return id == instanceselected.value.id;
  }

  onMounted(() => {
    fetchActiveInstances();
  });

  const instancesAll: instanceSelectT = computed(() => {
    return instances.value.map((x) => {
      return { value: x, text: x.instanceName };
    });
  });

  const instancesActive: instanceSelectT = computed(() => {
    return activeInstances.value.map((x) => {
      return { value: x, text: x.instanceName };
    });
  });

  let instanceSelect: instanceSelectT = computed(() => {
    return instances.value.map((x) => {
      return { value: x, text: x.instanceName };
    });
  });
  const instanceSearch = ref("");
  const instanceAutoComplete: instanceSelectT = computed(() => {
    if (instanceSearch.value == "") return [];
    else
      return instanceSelect.value
        .slice()
        .filter((s) => s.text.includes(instanceSearch.value));
  });
  return {
    instanceselected,
    instancesselected,
    fetchinstances,
    instances,
    isSelected,
    instanceSelect,
    instanceSearch,
    instanceAutoComplete,
    instancesActive,
    instancesAll,
    activeInstances,
    fetchvpcportenabled,
    fetchsecurityinstances,
    securityinstances
  };
};
