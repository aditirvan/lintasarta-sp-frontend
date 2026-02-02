<template>
  <div>
    <v-card flat class="rounded-lg pa-0">
      <v-card-text class="pa-7 d-flex flex-row align-center">
        <div class="headline font-weight-bold">Edit EULA</div>
      </v-card-text>
      <v-card-text
        class="pl-7 d-flex flex-row align-center"
        style="padding-top:0px"
      >
        <v-row style="width:100%">
          <v-col cols="24" class="pb-0">
            <p class="font-weight-bold">Form Name</p>
            <v-text-field
              outlined
              filled
              disabled
              v-model="form_name"
              placeholder="Form Name"
              single-line
            ></v-text-field> </v-col
          ><v-col cols="12" class="pb-0">
            <p class="font-weight-bold">Content</p>
            <markdown-editor
              :options="options"
              class="markdown-editor "
              v-model="content"
              :class="{ 'markdown-error': !content && content_error }"
            ></markdown-editor>
          </v-col>
          <v-col cols="6">
            <v-btn
              height="58"
              depressed
              block
              color="accent"
              to="/manage-eula"
              exact
            >
              <span style="font-size: 16px"> Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              v-if="!read_only"
              height="58"
              depressed
              block
              color="secondary"
              @click="updateEula()"
            >
              <span style="font-size: 16px"> Save</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row> </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from "@/lib/api";
import { AccessControl } from "@/lib/middleware";
import { ref } from "@vue/composition-api";

import { mapGetters } from "vuex";
export default {
  components: {},
  setup(props, context){
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage EULA'));
    return {
      read_only
    }
  },
  data() {
    return {
      loading: false,
      options: {
        lineNumbers: true,
        styleActiveLine: true,
        styleSelectedText: true,
        lineWrapping: true,
        indentWithTabs: true,
        tabSize: 2,
        indentUnit: 2
      },
      content_error: "",
      form_name: "",
      content: "",
      project_id: null,
      dialogProject: false
    };
  },
  methods: {
    async getEula() {
      try {
        const res = await api.POST("/superadmin/eula", {
          form_name: this.form_name
        });
        console.log("content : ", res.data[0]);
        this.content = res.data[0].content_raw;
      } catch (err) {
        console.log(err);
      }
    },
    async updateEula() {
      var data = {
        id: this.idEula,
        content: this.content
      };
      try {
        const res = await api.PUT("/superadmin/update/eula", {
          data: data
        });
        if (res.code === 200) {
          this.router.push({ path: "/manage-eula" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    ...mapGetters({
      projectname: "PROJECT/getprojectname",
      projectid: "PROJECT/getprojectid",
      idEula: "MANAGEEULA/getIdEula"
    })
  },
  mounted() {
    this.form_name = this.$route.params.eulaid;
    this.getEula();
  },
  watch: {}
};
</script>

<style scoped>
.fz-16px {
  font-size: 16px;
}

.hideinput2 ::v-deep input {
  opacity: 0;
}

.-mb-18px {
  margin-bottom: -8px;
}

.markdown-error {
  border: 1px solid red;
}

@import "~vue-select/dist/vue-select.css";
</style>
