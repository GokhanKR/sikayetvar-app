<template>
  <div>
    <base-editor
      v-model="editor"
      :highlights="highlights"
      :content="content"
      @phrase="phrase"
    />
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
    contentTimeout: null,
    contentTimeoutTime: 550,
    loading: false,
    highlights: {
      blackListed: [],
      companies: [],
      grayListed: [],
      undefined: [],
    },
    content: {
      phrase: null,
      last: null,
    },
    request: null,
  }),
  computed: {
    /**
     * @returns {Boolean}
     */
    isChanged() {
      return (
        this.editor?.replaceAll(/\s/g, "") ===
        this.content.phrase?.replaceAll(/\s/g, "")
      );
    },
    /**
     * @returns {Boolean}
     */
    isEmpty() {
      return !this.editor == true;
    },
  },
  methods: {
    /**
     * Requests content
     * 
     * @returns {Object}
     */
    async sendContent() {
      this.loading = true;

      let editor = this.editor;

      this.content.phrase = null;
      this.content.last = editor;
      this.request = null;

      return await axios({
        url: "https://api.sikayetvar.com/dictionary/phrase/check",
        method: "POST",
        data: editor,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
    /**
     * Resync when text input
     */
    phrase() {
      this.refreshText();
    },
    /**
     * Refresh content with time interval
     */
    refreshText() {
      if (this.isChanged || this.isEmpty) return;

      // clear if there is a request before
      this.request = null;

      // If there is a time setting before, remove it
      if (this.contentTimeout) {
        clearTimeout(this.contentTimeout);
      }

      // set timeout for api request
      this.contentTimeout = setTimeout(() => {
        this.request = this.sendContent();
      }, this.contentTimeoutTime);
    },
  },
  watch: {
    /**
     * Run when changes are made in the editor
     */
    editor() {
      this.refreshText();
    },
    /**
     * Run when deper is entered from outside
     */
    value() {
      this.editor = this.value;
    },
    /**
     * Work on request
     */
    request() {
      if (this.request) {
        this.request
          .then((res) => {
            if (this.request) {
              this.highlights = { ...res.data };
              this.content.phrase = res.data.phrase;
            }
          })
          .catch((err) => {
            this.$notify(0, "Metin ayrıştırması başarısız oldu!");
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
            this.request = null;
          });
      }
    },
  },
};
</script>
