import { useStorage } from "../instance/compositionapi/usestorage";
export const useSelectVolume = () => {
    const Composable = {
        ...useStorage()
    }
    const {defaultstoragesize} = Composable
    function enterSizeInGB(e){
        console.log(e)
        if(e.code.match(/^Digit/)){
          defaultstoragesize.value[0].size = Number(''+defaultstoragesize.value[0].size+e.key)
        }else if(e.code == 'Backspace'){
          defaultstoragesize.value[0].size = Math.floor(defaultstoragesize.value[0].size / 10)
        }
      }
    return {
        enterSizeInGB,
        ...Composable
    }
}