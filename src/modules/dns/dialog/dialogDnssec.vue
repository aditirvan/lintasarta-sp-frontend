<template>
  <div>
    <v-dialog v-model="showDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5"> How to enable DNSSEC </v-card-title
        ><br />
        <v-card-text
          >To enable DNSSEC you will need to add this DS record to your
          register. Most registrars will ask for only a few of the fields below.
          We have instructions for common registrars
        </v-card-text>
        <v-card-text
          ><h4>DS Record</h4>
          <v-text-field
            ref="inputDsRecord"
            outlined
            filled
            disabled
            v-model="dsRecord"
          ></v-text-field>
          <v-btn @click="copy('inputDsRecord')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Digest</h4>
          <v-text-field
            ref="inputDigest"
            outlined
            filled
            disabled
            v-model="digest"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputDigest')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Digest Type - 2</h4>
          <v-text-field
            ref="inputDigestType2"
            outlined
            filled
            disabled
            v-model="digestType2"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputDigestType2')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Algorithm</h4>
          <v-text-field
            ref="inputAlgorithm"
            outlined
            filled
            disabled
            v-model="algorithm"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputAlgorithm')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Public Key</h4>
          <v-text-field
            ref="inputPublicKey"
            outlined
            filled
            disabled
            v-model="publicKey"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputPublicKey')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Key Tag</h4>
          <v-text-field
            ref="inputKeyTag"
            outlined
            filled
            disabled
            v-model="keyTag"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputKeyTag')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-text
          ><h4>Flags</h4>
          <v-text-field
            ref="inputFlag"
            outlined
            filled
            disabled
            v-model="flag"
            placeholder="We have instructions for common registrars"
          ></v-text-field>
          <v-btn @click="copy('inputFlag')" text>click to copy</v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="closeDialog()"> Cancel </v-btn>
          <v-btn color="success" @click="closeDialog()"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
// import { ref, reactive, defineComponent } from "@vue/composition-api";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const flag = ref("We have instructions for common registrars");
    const digest = ref("We have instructions for common registrars");
    const digestType2 = ref("We have instructions for common registrars");
    const keyTag = ref("We have instructions for common registrars");
    const publicKey = ref("We have instructions for common registrars");
    const algorithm = ref("We have instructions for common registrars");
    const dsRecord = ref("We have instructions for common registrars");
    function closeDialog() {
      this.$emit("update:showDialog", false);
    }
    function copy(field) {
      const input = this.$refs[field].value;
      navigator.clipboard.writeText(input);
    }
    return {
      closeDialog,
      copy,
      flag,
      digest,
      digestType2,
      keyTag,
      publicKey,
      algorithm,
      dsRecord,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field--outlined fieldset {
  background: #ebebeb;
  color: black;
}
</style>