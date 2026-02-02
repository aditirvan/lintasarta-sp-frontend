<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">Tags</div>

            </v-card-text>
          <v-card-text>
            <v-card outlined>
              <v-card-text class="text-center py-16">
                <p class="font-weight-bold">Tag your instance</p>
                <p>
                  Tags are a great way to group Instances. Learn how to get the
                  most out of tags by reading our community tutorial.
                </p>
                <v-btn depressed
                  @click="
                    () => {
                      dialog = true;
                    }
                  "
                  class="secondary"
                  height="45"
                  width="100%"
                  max-width="300"
                  >Manage Tags</v-btn
                >
              </v-card-text></v-card
            >
          </v-card-text>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog max-width="500" v-model="dialog">
      <v-card>
        <v-card-title> <h3>Manage Tags</h3> </v-card-title>
        <v-card-text>
          <p>
            Tags may contain letters, numbers, colons, dashes, and underscores.
          </p>
          <v-text-field
            maxlength="50"
            hide-details
            outlined
            placeholder="Type Tags Here"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="accent"
                block
                @click="
                  () => {
                    dialog = false
                  }
                "
              >
                <b>Cancel</b>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="secondary"
                block
                @click="
                  () => {
                    dialog = false
                  }
                "
              >
                <b>Save Tags</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
<style scoped>
.headline{
  font-weight:600;
  font-family: 'Poppins', sans-serif;
}
</style>