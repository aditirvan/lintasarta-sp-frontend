<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card>
      <v-card-title class="pb-7">
        <div class="headline font-weight-bold font--text">Create New Bucket</div>
      </v-card-title>
      <v-card-text>
        <p class="font-weight-bold">Bucket Name</p>
        <v-text-field
          v-model="name"
          outlined
          placeholder="Bucket Name"
          :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
        />
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Region</p>
        <v-text-field
          v-model="selectedRegion"
          outlined
          placeholder="Region"
          readonly
          :error-messages="$v.selectedRegion.$errors.length ? $v.selectedRegion.$errors[0].$message : ''"
        />
      </v-card-text>
      <!-- <v-card-text>
        <v-row>
            <v-col cols="12" class="pt-0 mt-0">
            <v-checkbox
              label="Object Version"
              v-model="objectVersion"
              :readonly="objectLock"
            ></v-checkbox>
             <p style="font-size: 12px">
              <span class="primary--text"><b>Important:</b></span> Enable object versioning if you want to store every version of each object in this bucket. You can then retrieve previous versions of an object as needed.
            </p>
          </v-col>
           <v-col cols="12" class="pt-0 mt-0">
            <v-checkbox
              label="Object Lock"
              v-model="objectLock"
            ></v-checkbox>
             <span class="primary--text"><b>Important:</b></span> S3 Object Lock allows you to specify retention and legal hold settings for the objects ingested into a bucket. If you want to use S3 Object Lock, you must enable this setting when you create the bucket. You cannot add or disable S3 Object Lock after a bucket is created
             <br>
             <br>
              If S3 Object Lock is enabled, object versioning is enabled for the bucket automatically and cannot be suspended.
          </v-col>
        
        </v-row>
      </v-card-text>
      <v-card-text v-if="objectLock">
         <v-row>
              <v-col cols="9" class="pt-0 mt-0">
                <v-text-field
                  v-model="retentionPeriod"
                  label="Retention Period"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
              <v-col cols="3" class="pt-0 mt-0">
                <v-select
                  v-model="retentionType"
                  :items="['Days', 'Years']"
                  label="Retention Type"
                ></v-select>
              </v-col>
            </v-row>
      </v-card-text> -->
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="accent"
              block
              @click="resetValue"
              :disabled="loading"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn depressed
              height="50"
              color="secondary"
              block
              @click="create"
              :loading="loading"
              :disabled="loading"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useObjectStorage } from './composableapi/useobjectstorage'
import { ref, watch, onMounted } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators'

export default {
  props: ['value', 'objectStorageID'],
  setup(props, context){
    const Composable = {
      ...useObjectStorage()
    }

    const {
      createBucket,
      fetchUsage,
      fetchObjectStorage,
    } = Composable

    const objectStorageData = ref(null)
    const objectStorageUsage = ref(null)
    const listRegion = ref([])
    const selectedRegion = ref('')
    const objectLock = ref(false)
    const objectVersion = ref(false)
    const name = ref('')
    const loading = ref(false)
    const retentionType=ref("Days")
    const retentionPeriod=ref(0)
    onMounted(async () => {
      if (props.objectStorageID) {
        objectStorageData.value = await fetchObjectStorage({ id: props.objectStorageID });
        if (objectStorageData.value) {
          const defaultRegion = objectStorageData.value.data.data.default_region;
          const tempRegion = defaultRegion !== "" ? defaultRegion : await fetchAndSetRegion();
          selectedRegion.value=capitalize(tempRegion);
        }
      }
    })

    watch(objectLock, async (newVal) => {
      if (newVal) {
        objectVersion.value = true
      } else {
        objectVersion.value = false
      }
    })

    async function fetchAndSetRegion() {
      objectStorageUsage.value = await fetchUsage({ id: props.objectStorageID });
      if (objectStorageUsage.value) {
        const buckets = objectStorageUsage.value.data.data.data.buckets;
        return buckets.length > 0 ? buckets[0].region : null;
      }
    }

    const $v = useVuelidate({
      name: { 
        required,
        $autoDirty: true,
        conditional: {
          $message: "The special character or spaces are not allowed",
          $validator: (val) => {
            return /^[A-Za-z0-9\-_]+$/.test(val);
          },
        },
      },
      selectedRegion: { required },
    }, {
      name,
      selectedRegion,
    })

    const create = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({ behavior: "smooth" })
        return;
      }
      loading.value = true;
      const payload = {
        region: lower(selectedRegion.value),
        name: name.value,
        object_storage_id: props.objectStorageID,
        object_version: objectVersion.value,
        object_lock: objectLock.value,
        count_object_lock:parseInt(retentionPeriod.value),
        type_object_lock: retentionType.value
      }

      console.log(payload);

      const response = await createBucket(payload)
      console.log("response ", response);
      if(response.status == 200) {
        context.emit('close')
        context.emit('refresh')
        name.value = ''
        objectLock.value = false
        objectVersion.value = false
      }
      loading.value = false;
      $v.value.$reset();
    }
   
    const resetValue = async () => {
      name.value = ''
      context.emit('close')
      loading.value = false;
    }

    const capitalize=(value) =>{
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    const lower=(value) =>{
      if (!value) return ''
      return value.toString().toLowerCase()
    }

    return {
      ...Composable,
      name,
      create,
      objectStorageData,
      selectedRegion,
      listRegion,
      resetValue,
      fetchUsage,
      objectVersion,
      objectLock,
      $v,
      loading,
      retentionType,
      retentionPeriod
    }
  },
  
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('close', val)
      }
    }
  }
};
</script>

<style scoped lang="scss">
button {
  ::v-deep .v-btn__content {
    font-size: 14px;
  }
}
</style>
