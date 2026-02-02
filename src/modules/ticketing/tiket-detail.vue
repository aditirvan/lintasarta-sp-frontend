<template>
  <div>
    <div class="row">
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <div class="fz-20 font-weight-bold font--text">
              Ticket Details
            </div>
            <v-row>
              <v-col cols="6">
                <h4 class="pt-3">Ticket Subject</h4>
                <span>{{ detailtickets.subject }}</span>

                <br />

                <h4 class="pt-3">Project Name</h4>
                <span>
                  {{
                    detailtickets.project_name === ""
                      ? "-"
                      : detailtickets.project_name
                  }}
                </span>

                <h4 class="pt-3">Site</h4>
                <span>{{ detailtickets.site }}</span>

                <br />

                <h4 class="pt-3">Product Name</h4>
                <span>
                  {{
                    detailtickets.item === ""
                      ? "-"
                      : detailtickets.item
                  }}
                </span>
                <h4 class="pt-3">SDP Ticket ID</h4>
                <span class="text-bold">{{
                  detailtickets.sdp_ticket_id === ""
                    ? "-"
                    : detailtickets.sdp_ticket_id
                }}</span>
              </v-col>
              <v-col cols="6">
                <h4 class="pt-3">Status</h4>
                <span
                  class="cyan--text"
                  v-if="detailtickets.status === 'Open'"
                  >{{ detailtickets.status }}</span
                >
                <span
                  class="green--text"
                  v-if="detailtickets.status === 'Resolved'"
                  >{{ detailtickets.status }}</span
                >
                <span
                  class="red--text"
                  v-if="detailtickets.status === 'Rejected'"
                  >{{ detailtickets.status }}</span
                >
                <span class="" v-if="detailtickets.status === 'Onhold'">{{
                  detailtickets.status
                }}</span>
                <span
                  class="grey--text"
                  v-if="detailtickets.status === 'In Progress'"
                  >{{ detailtickets.status }}</span
                >
                <span
                  class="primary--text"
                  v-if="detailtickets.status === 'Closed'"
                  >{{ detailtickets.status }}</span
                >
                <span class="" v-if="detailtickets.status === 'Assigned'">
                  {{ detailtickets.status }}</span
                >
                <span
                  class=""
                  v-if="detailtickets.status === 'Released Onhold'"
                >
                  {{ detailtickets.status }}</span
                >
                <span class="" v-if="detailtickets.status === ''"> - </span>

                <br />

                <h4 class="pt-3">Request Type</h4>
                <span>{{ detailtickets.request_type }}</span>

                <br />

                <h4 class="pt-3">Priority</h4>
                <span>{{ detailtickets.priority }}</span>

                <h4 class="pt-3">Assets</h4>
                <span>
                  {{
                     !detailtickets.assets.length
                      ? "-"
                      : detailtickets.assets[0].name
                  }}
                </span>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
                <h4 class="pt-5">Description</h4>
                <span>{{ detailtickets.description }}</span>

                <br />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <v-row>
              <v-col class="d-flex justify-content-between">
                <div class="fz-20 font-weight-bold font--text">
                  Attachment
                </div>
                <v-btn
                  v-if="detailtickets.status !== 'Closed'"
                  id="CreateNewAttach"
                  depressed
                  class="secondary mb-5 ml-auto"
                  @click="
                    () => {
                      opendialogaddattach = true;
                    }
                  "
                  ><span class="fz-14">Upload Image</span></v-btn
                >
              </v-col>
            </v-row>

            <template>
              <v-data-table
                :headers="table.headers"
                :items="getattachment"
                :items-per-page="10"
                :options.sync="options"
                :server-items-length="paginationAttachment"
                class="elevation-0"
                hide-default-footer
              >
                <template #[`item.filename`]="{ item }">
                  <h4
                    class="secondary--text clickable"
                    @click="
                      showImg = true;
                      attachPreview = item.filename;
                    "
                  >
                    Preview Image
                  </h4>
                </template>
                <template #[`item.created_at`]="{ item }">
                  {{
                    $moment(new Date(item.created_at)).format("DD MMMM YYYY")
                  }}
                </template>
                <template v-slot:footer="{ props }">
                  <div v-if="getattachment.length > 0">
                    <custom-footer-datatable
                      @input="
                        (val) => {
                          options = val;
                        }
                      "
                      :props="props"
                    />
                  </div>
                  <div v-else class="text-center mb-4">
                    <h4 class="font-weight-regular">No Attachment Data</h4>
                    <v-divider />
                  </div>
                </template>
              </v-data-table>
            </template>
          </v-container>
        </v-card>

        <v-dialog max-width="500" v-model="opendialogaddattach">
          <v-card class="pt-7">
            <v-card-text>
              <div class="headline font-weight-bold font--text">
                Add Attachment
              </div>
            </v-card-text>
            <v-card-text>
              <p class="titletext">Add File</p>
              <input ref="attachFile" type="file" accept="image/*" @change="previewFiles" />
              <!-- <v-file-input
                placeholder="Input File"
                maxlength="100"
                outlined
                accept="image/*"
                v-model="fileattach"
              ></v-file-input> -->
            </v-card-text>
            <v-card-text >
              <p class="titletext">Min image resolution must be 150px width and 150px height<br>
                Max image resolution must be 1920px width and 1080px height<br>
                Only jpeg and png files are allowed
              </p>
            </v-card-text>

            <v-card-text>
              <v-row>
                <v-col
                  ><v-btn
                    :disabled="disabledBtn"
                    :loading="disabledBtn"
                    depressed
                    height="45"
                    block
                    class="accent"
                    @click="
                      () => {
                        opendialogaddattach = false;
                      }
                    "
                    >Cancel</v-btn
                  ></v-col
                >
                <v-col
                  ><v-btn
                    :disabled="disabledBtn"
                    :loading="disabledBtn"
                    id="Add"
                    depressed
                    height="45"
                    block
                    class="secondary"
                    @click="addAttach"
                    >Add</v-btn
                  ></v-col
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <div class="fz-20 font-weight-bold font--text">
              Discussion
            </div>
            <br />
            <form class="mb-6" v-if="detailtickets.status !== 'Closed'">
              <v-textarea
                placeholder="Type a new comment here"
                v-model="desc"
                :error-messages="
                  $v.desc.$errors.length ? $v.desc.$errors[0].$message : ''
                "
                required
                outlined
              ></v-textarea>

              <v-row>
                <v-col class="d-flex justify-content-end">
                  <v-btn
                    :disabled="!desc"
                    color="primary"
                    class="btn-submit-comment"
                    @click="submitComment()"
                  >
                    submit
                  </v-btn>
                </v-col>
              </v-row>
            </form>
            <div
              v-if="
                detailtickets.status == 'Closed' &&
                  (commentitems == null || commentitems.length == 0)
              "
            >
              <v-divider />
              <div class="text-center my-4">
                <h4>No Discussion</h4>
                <h4 class="font-weight-regular mt-3">No Discussion Data</h4>
              </div>
              <v-divider />
            </div>
            <div v-for="comment in commentitems" :key="comment.index">
              <div v-if="comment.ticket_id == ticketid">
                <v-row>
                  <v-col cols="6">
                    <h4 class="blue--text text--bold">
                      {{ comment.user_name }}
                    </h4>
                  </v-col>
                  <v-col cols="6" class="text-right">
                    {{
                      $moment(new Date(comment.updated_at)).format(
                        "DD MMMM YYYY hh:mm A"
                      )
                    }}
                  </v-col>
                  <v-col cols="6">
                    <p
                      class="gray--text"
                      v-show="comment_id === comment.id ? false : true"
                      v-html="comment.description"
                    ></p>
                    <form v-show="comment_id === comment.id ? true : false">
                      <v-textarea
                        placeholder="Type a new comment here"
                        v-model="descedit"
                        outlined
                      ></v-textarea>
                      <v-row justify="end">
                        <v-btn
                          :disabled="!descedit"
                          color="primary"
                          @click="submitCommentUpdate()"
                        >
                          submit
                        </v-btn>
                      </v-row>
                    </form>
                  </v-col>
                  <!-- <v-col cols="6" class="text-right">
                    <span
                      class="gray--text mr-1"
                      v-if="
                        comment.user_id ==
                          '13cb725d-aa75-4f18-811b-9aa32055f811'
                      "
                      >Edit</span
                    >
                    <a class="blue--text mr-1" @click="update(comment)" v-else
                      >Edit</a
                    >
                  </v-col> -->
                </v-row>
              </div>
            </div>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container class="pa-8">
            <v-btn to="/ticket" color="primary" block>Back To Ticket</v-btn>
          </v-container>
        </v-card>
      </v-col>
    </div>

    <dialogdeleteattach
      :attach-id="attachid"
      :ticket-id="ticketid"
      v-if="attachid && ticketid && openDialogDeleteattach"
      v-model="openDialogDeleteattach"
      @close="openDialogDeleteattach = false"
    />
    <v-overlay :value="showImg">
      <div class="d-flex flex-column">
        <v-icon class="ml-auto clickable" @click="showImg = false">
          mdi-close
        </v-icon>
        <img
          :src="`data:image/png;base64,${attachPreview}`"
          class="img-attachment"
        />
      </div>
    </v-overlay>
  </div>
</template>

<script>
import ticket from "./ticket";
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import dialogAddAttach from "./dialogAddAttachment.vue";
import { TICKET } from "./namespace";
import { useProjects } from "@/modules/project/useprojects";
import localstorage from "@/lib/localstorage";
import { PROJECT } from "../project/namespace";
import dialogdeleteattach from "./dialogDeleteAttachment.vue";

export default defineComponent({
  components: {
    dialogAddAttach,
    dialogdeleteattach,
    // Dialogsuccess
  },
  // props: ["tiket"],
  setup(props, context) {
    const loading = ref(false);

    const {
      fetchdetailtiket,
      fetchcomment,
      fetchattachment,
    } = useNamespacedActions(TICKET, [
      "fetchdetailtiket",
      "fetchcomment",
      "fetchattachment",
    ]);

    const {
      detailtickets,
      commentitems,
      pagination,
      paginationAttachment,
    } = useNamespacedState(TICKET, [
      "detailtickets",
      "pagination",
      "commentitems",
      "paginationAttachment",
    ]);
    const { getattachment } = useNamespacedGetters(TICKET, ["getattachment"]);

    const { fetchprojects } = useNamespacedActions(PROJECT, ["fetchprojects"]);
    const { projects } = useNamespacedState(PROJECT, ["projects"]);

    const comment = ref([]);

    const table = reactive({
      headers: [
        { text: "Image", value: "filename", sortable: false },
        { text: "Created Date", value: "created_at", sortable: true },
      ],
    });

    const options = ref({
      id: context.root._route.params.ticketid,
      page: 1,
      itemsPerPage: 10,
      rowsPerPage: 10,
    });

    watch(options, async (val) => {
      options, (loading.value = true);
      try {
        await fetchattachment(val);
      } finally {
        loading.value = false;
      }
    });

    const locals = JSON.parse(localstorage.getItem("currentOrg"));

    // const ticketing = JSON.stringify(detailtickets.value);

    const { ticketid } = context.root.$route.params;
    const desc = ref("");
    const descedit = ref("");
    const comment_id = ref("");
    const fileattach = ref({});
    const opendialogaddattach = ref(false);
    const openDialogDeleteattach = ref(false);
    const ticket_id = ref("");
    const attachid = ref("");
    const attachPreview = ref("");
    const showImg = ref(false);
    const disabledBtn = ref(false)
    const fileattachlength = ref(0);
    const fileattachext = ref("");

    const { addcomment } = useNamespacedActions(TICKET, ["addcomment"]);
    const { addattachment } = useNamespacedActions(TICKET, ["addattachment"]);
    const { updatecomment } = useNamespacedActions(TICKET, ["updatecomment"]);

    const $v = useVuelidate(
      {
        desc: { required: required },
      },
      { desc }
    );

    function submitComment() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const Value = {
        user_id: locals.user_id,
        ticket_id: ticketid,
        description: desc.value,
      };

      addcomment(Value).then(() => {
        location.reload();
      });
    }

    function submitCommentUpdate() {
      const valueUpdate = {
        user_id: locals.user_id,
        ticket_id: ticketid,
        comment_id: comment_id.value,
        description: descedit.value,
      };

      updatecomment(valueUpdate).then(() => {
        location.reload();
      });
    }

    function update(comment) {
      descedit.value = comment.description;
      comment_id.value = comment.id;
    }

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    function previewFiles(e) {
      console.log("file", e.target.files[0].name);
      fileattachlength.value = e.target.files.length;
      if (fileattachlength.value > 0) {
        fileattachext.value = e.target.files[0]['type']
        // console.log('fileattachext.value: ', fileattachext.value)
      }
      getBase64(e.target.files[0]).then((data) => {
        fileattach.value = data;
      });
    }

    function addAttach() {
      if (fileattachlength.value > 0) {
        if (fileattachext.value == 'image/png' || fileattachext.value == 'image/jpeg') {
          disabledBtn.value = true
          // console.log('fileattach.value in addAttach(): ', fileattach.value)
          let filedata = fileattach.value;
          if (fileattach.value.includes('data:image/png;base64,')) {
            filedata = fileattach.value.replace("data:image/png;base64,", "");            
          } else if (fileattach.value.includes('data:image/jpeg;base64,')) {
            filedata = fileattach.value.replace("data:image/jpeg;base64,", "");
          }
          // console.log('filedata', filedata)

          const valueattach = {
            ticket_id: ticketid,
            filename: filedata,
          };

          addattachment(valueattach).then((res) => {
            opendialogaddattach.value = false;
            disabledBtn.value = false
            context.root.$store.dispatch('HOMEPAGE/showSuccessToast', res.data.message);
            fetchattachment({ id: context.root._route.params.ticketid });
          })
          .catch((err) => {
            disabledBtn.value = false
            // console.log('the error:', err)
            context.root.$store.dispatch("HOMEPAGE/showErrorToast", err);

          });
        } else {
          const messageerr = "Only jpeg and png files are allowed"
          context.root.$store.dispatch("HOMEPAGE/showErrorToast", messageerr);
        }
      } else {
        const messageerr = "File can not be null"
        context.root.$store.dispatch("HOMEPAGE/showErrorToast", messageerr);
      }
    }

    watch(opendialogaddattach, (newVal) => {
      if(!newVal){
        context.refs.attachFile.value = null
      }
    })

    // const options = ref({});
    //  watch(
    //   options,
    //   (val) => {
    //     const op = { id: props.tiket, ...val };
    //     fetchdetailtiket(op);
    //   },
    //   { deep: true }
    // );

    onMounted(() => {
      fetchdetailtiket(context.root._route.params.ticketid);
      fetchprojects();
      fetchattachment({ id: context.root._route.params.ticketid });
      fetchcomment(context.root._route.params.ticketid);
    });

    return {
      loading,
      submitComment,
      update,
      submitCommentUpdate,
      addAttach,
      fetchdetailtiket,
      detailtickets,
      projects,
      table,
      fetchcomment,
      fetchattachment,
      commentitems,
      comment,
      locals,
      desc,
      comment_id,
      ticketid,
      descedit,
      opendialogaddattach,
      fileattach,
      fileattachlength,
      fileattachext,
      previewFiles,
      getBase64,
      openDialogDeleteattach,
      attachid,
      ticket_id,
      pagination,
      options,
      $v,
      paginationAttachment,
      getattachment,
      showImg,
      attachPreview,
      disabledBtn
    };
  },
});
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  margin-top: 0;
}
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--is-readonly {
  ::v-deep input {
    cursor: auto;
  }
}
.btn-submit-comment {
  width: auto;
}
.clickable {
  cursor: pointer;
}
.img-attachment {
  max-width: 500px;
}
</style>
