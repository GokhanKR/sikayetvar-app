<template>
  <div>
    <base-editor v-model="editor" :highlights="highlights" :phrase="phrase" />
  </div>
</template>

<script>
import axios from "axios";
import BaseEditor from "./BaseEditor.vue";
export default {
  components: { BaseEditor },
  name: "TextEditor",
  props: {
    value: {
      type: String,
      default: "",
      required: true,
    },
  },
  data: () => ({
    editor: null,
    rawEditor: null,
    lastEditor: null,
    contentTimeout: null,
    contentTimeoutTime: 550,
    highlights: {
      blackListed: [],
      companies: [],
      grayListed: [],
      undefined: [],
    },
    phrase: null,
  }),
  methods: {
    sendContent() {
      axios({
        url: "https://api.sikayetvar.com/dictionary/phrase/check",
        method: "POST",
        data: this.editor,
        headers: {
          "Content-Type": "text/plain",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.highlights = { ...res.data };
            this.phrase = res.data.phrase;
          } else {
            this.$notify(0, "Metin ayrıştırması başarısız oldu!");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // parseText(text) {},
  },
  watch: {
    editor() {
      if (this.contentTimeout) {
        clearTimeout(this.contentTimeout);
      }
      this.contentTimeout = setTimeout(() => {
        this.sendContent();
      }, this.contentTimeoutTime);
    },
    value() {
      this.editor = this.value;
    },
  },
};
</script>
