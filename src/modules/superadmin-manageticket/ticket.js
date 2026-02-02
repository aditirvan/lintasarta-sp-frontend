import Vue from 'vue'
import CompositionApi, {ref} from '@vue/composition-api'

Vue.use(CompositionApi)

const items = ref(false);

export default function Ticketing(){

    const CreateTiket = () => {
        items.value = true
    }

    return {
        items,
        CreateTiket
    }
}

