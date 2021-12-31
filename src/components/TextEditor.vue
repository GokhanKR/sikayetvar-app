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
    phrase() {
      this.refreshText();
    },
    refreshText() {
      if (this.isChanged || this.isEmpty) return;

      this.request = null;
      if (this.contentTimeout) {
        clearTimeout(this.contentTimeout);
      }
      this.contentTimeout = setTimeout(() => {
        this.request = this.sendContent();
      }, this.contentTimeoutTime);
    },
  },
  // created() {
  //   let self = this
  //   axios.interceptors.response.use(
  //     function (response) {
  //       if (self.loading) {
  //         return response
  //       } else {
  //         return;
  //       }
  //       // throw new axios.Cancel("Operation canceled by the user.");
  //     },
  //     function (error) {
  //       return Promise.reject(error);
  //     }
  //   );
  // },
  watch: {
    editor() {
      this.refreshText();
    },
    value() {
      this.editor = this.value;
    },
    request() {
      if (this.request) {
        this.request
          .then((res) => {
            // console.log(res);
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
