<template>
     <v-dialog v-model="value" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">
            Delete this attachment 
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>Are you sure you delete this attachment key?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                color="accent"
                block
                depressed
                height="50"
                @click="$emit('close', $event)"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                depressed
                @click="
                  () => {
                   deleteattach(attachId, ticketId)
                  }
                "
              >
              <beat-loader
                  v-if="isLoading"
                  :loading="isLoading"
                  :color="'white'"
                  :size="'10px'"
                  style="transform: translateY(3px)"
                  class="mr-2"
                ></beat-loader>
                <b v-else>Yes</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { ref } from '@vue/composition-api'
import { TICKET } from "./namespace";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";

const module = defineComponent({
  props: {
     value: {
          type: Boolean,
          default: false,
      },
      attachId: {
          type: String,
          required: true,
      },
      ticketId: {
          type: String,
          required: true,
      },
  },
  setup(props, { emit }) {
    const { deleteattachment, fetchattachment } = useNamespacedActions(TICKET, ["deleteattachment", "fetchattachment"]);
    const { isLoading } = useNamespacedState('PROFILE', [ 'isLoading' ]);

    function deleteattach(attachId: any, ticketId: any) {
        const Value = {
          attachId: attachId,
          ticketId: ticketId,
        }

        deleteattachment(Value).then(()=>{
          fetchattachment(ticketId)
          emit('close')
          location.reload();
        })
    }

    return {
      isLoading,
      deleteattach,
      deleteattachment,
      fetchattachment,
    };
  },
});
export default module;
</script>
