<template>
  <v-dialog v-model="dialog" v-if="selectedSnapshot" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Restore Instance
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          Are you sure you want to restore snapshot
          <b>{{ selectedSnapshot.name }}</b> ?
        </p>
        <p>
          <b>Note:</b> Restoring will replace the selected instance with
          <b>{{ selectedSnapshot.name }}</b
          >.
        </p>
        <v-row>
          <v-col cols="12">
            <p class="font-weight-bold">Select Instance</p>
            <v-select
              id="SelectInstance"
              :readonly="selectedInstance ? true : false"
              :filled="selectedInstance ? true : false"
              v-model="instance"
              :items="instanceSelect"
              outlined
              placeholder="Select an instance"
            >
              <template v-slot:selection="{ item }">
                {{ item.text }}
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="secondary"
              block
              :disabled="instance === null"
              height="50"
              depressed
              @click="doRestore"
            >
              Restore Instance
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useCreateSnapshot } from "../images/composableapi/usecreatesnapshot";
import { useCreatedInstance } from "../instance/compositionapi/usecreatedinstance";
import { ref, onMounted } from "@vue/composition-api";

export default {
  props: ["value", "selectedSnapshot", "selectedInstance"],
  computed: {
    dialog: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("close", val);
      },
    },
  },
  setup(props, context) {
    const { instanceSelect, fetchinstances } = useCreatedInstance();
    const { restoreSnapshot } = useCreateSnapshot();
    const instance = ref(null);

    onMounted(async () => {
      await fetchinstances();
      if (props.selectedInstance)
        instance.value = instanceSelect.value.filter(
          (option) => option.value.id == props.selectedInstance.id
        ).map(option => option.value)[0];
    });

    // const doRestore = async () => {
    //   const payload = {
    //     instance_id: instance.value.id,
    //     image_id: props.selectedSnapshot.id,
    //     instance,
    //     snapshot: props.selectedSnapshot
    //   };
    //   // const response = await restoreSnapshot(payload);
    //   // console.log(response);
    //   // if (response.status == 200) {
    //   // context.emit("close");
    //   // context.emit("submit", payload);
    //   // }
    //   // if (response.status !== 200) {
    //   //   this.dialogFail = true;
    //   //   // this.text = response.data;
    //   // }
    // };

    const doRestore = () => {
      if (
        props.selectedSnapshot.instance.name !== instance.value.value.instanceName
      ) {
        context.root.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Instance should same with origin"
        );
      } else {
        const payload = {
          instance_id: instance.value.value.id,
          image_id: props.selectedSnapshot.id,
          instance,
          snapshot: props.selectedSnapshot,
        };
        context.emit("submit", payload);
      }
    };

    return {
      instanceSelect,
      instance,
      doRestore,
    };
  },
};
</script>
