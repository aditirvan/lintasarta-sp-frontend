<template>
  <v-container class="pa-0" fluid>
    <div v-if="compileErrorMessage" class="mb-5">
      <v-card outlined style="background: #FF5252;">
        <v-card-text>
          <v-row>
            <v-col class="white--text">{{ compileErrorMessage }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <div v-if="editor">
      <div class="d-flex flex-row" style="align-items: center">
        <div class="headline font-weight-bold font--text mb-2">
          Editor
        </div>
        <!-- <v-spacer /> -->
      </div>
      <editor-content :editor="editor" />
      <div class="pt-5 pb-3 d-flex justify-center align-center">
        <v-btn depressed id="UpdateVCL" width="350" height="45" disabled class="secondary" @click="() => {
          validateprivilages(['CDN', 'editor']).then(async () => {
            openDialogConfirmUpdate = true;
          });
        }">
          Save
        </v-btn>
      </div>
    </div>
    <dialogConfirmUpdate v-model="openDialogConfirmUpdate" @close="saveEditor" />
  </v-container>
</template>

<script>
import dialogConfirmUpdate from "./dialogConfirmUpdateVCL.vue"
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent } from '@tiptap/vue-2'
import { lowlight } from 'lowlight'
import {
  useNamespacedActions,
  useNamespacedGetters,
  useState
} from "vuex-composition-helpers";
import { ref, onMounted, watch } from "@vue/composition-api";
export default {
  props: {
    id: String,
    name: String,
    compileErrorMessage: String
  },
  components: {
    EditorContent,
    dialogConfirmUpdate
  },
  setup(props) {
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);
    const { isLoadingUpdateVcl, vclSource } = useNamespacedGetters("CDN", ["isLoadingUpdateVcl", "vclSource"]);
    const { updateVcl } = useNamespacedActions("CDN", ["updateVcl"]);
    const { topbarloading } = useState(["topbarloading"]);
    const openDialogConfirmUpdate = ref(false)
    const editor = ref(null)
    onMounted(() => {
      editor.value = new Editor({
        extensions: [
          Document,
          Paragraph,
          Text,
          CodeBlockLowlight.configure({
            lowlight,
          }),
        ],
        content: `<pre><code>${escapeHtml(vclSource.value)}</code></pre>`,
        editable: false,
      })
    })
    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    watch(vclSource, (content) => {
      const currentHtml = editor.value.getHTML();
      const escaped = `<pre><code>${escapeHtml(content)}</code></pre>`;
      if (currentHtml !== escaped) {
        editor.value.commands.setContent(escaped, false);
      }
      // const isSame = editor.value.getHTML() === content
      // if (!isSame) {
      //   editor.value.commands.insertContent(content, false)
      // }
    })

    const saveEditor = async (val) => {
      openDialogConfirmUpdate.value = false
      if (val) {
        const json = editor.value.getJSON();
        const editorValue = json.content[0].content[0].text ? json.content[0].content[0].text : "";
        let payload = {
          id: props.id,
          sourceFile: btoa(editorValue)
        }
        topbarloading.value.start();
        await updateVcl(payload)
        topbarloading.value.done();
      }
    }

    return {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      updateVcl,
      topbarloading,
      editor,
      saveEditor,
      openDialogConfirmUpdate,
      isLoadingUpdateVcl
    };
  },


  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  >*+* {
    margin-top: 0.75em;
  }

  pre {
    // background: #0D0D0D;
    background: #282c34;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 1rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #F98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>