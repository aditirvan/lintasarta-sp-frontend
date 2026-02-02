<template>
    <v-dialog
      v-model="value"
      persistent
      max-width="500"
    >

      <v-card>
        <v-card-title>
          <div
                              class="headline font-weight-bold font--text pb-4"
                            >
                                        Upload an Image

                            </div>
        </v-card-title>
        <v-card-text>
          <p class="font-weight-bold">ENTER URL</p>
          <v-text-field
					maxlength="255"
          hide-details
          outlined
          placeholder="Type URL Image"
          ></v-text-field>
          </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols=6>
<v-btn
            color="accent"
            block
            depressed
            height="50"
            @click="()=>{$emit('close')}"
          >
            Cancel
          </v-btn>
            </v-col>
            <v-col cols=6>
              <v-btn
            color="secondary"
            block
            height="50"
            depressed
            @click="()=>{$emit('close')}"
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
export default {
    props:['value']
}
</script>