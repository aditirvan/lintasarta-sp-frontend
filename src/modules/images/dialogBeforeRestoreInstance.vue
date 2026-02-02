<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Restore Instance
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>
          Are you sure you want to restore
          <b>{{ item && item.snapshot.name }}</b> from
          <b>{{ item && item.instance.value.instanceName }}</b
          >?
        </p>
        <br />
        <p>
          Note: Restoring will replace the current Instance with an older image.
          Snapshots will be charged based on space used and are charged
          <span class="primary--text">$0.05/GB/month</span>.
        </p>
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
            <v-btn color="error" block height="50" depressed @click="doRestore">
              Restore Instance
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useCreateSnapshot } from "./composableapi/usecreatesnapshot";

export default {
  props: ["value", "item"],
  computed: {
    dialog: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("close", val);
      }
    }
  },
  setup(props, context) {
    const { restoreSnapshot } = useCreateSnapshot();

    const doRestore = async () => {
      const { instance_id, image_id } = props.item;

      const payload = {
        instance_id,
        image_id
      };

      const response = await restoreSnapshot(payload);

      if (response.status == 200) {
        context.emit("close");
      } else {
        console.log("error");
      }
    };

    return {
      doRestore
    };
  }
};
</script>
