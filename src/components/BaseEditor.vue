<template>
  <div class="editor-container" :style="backStyle">
    <textarea
      class="editor primary"
      ref="editor"
      contenteditable
      placeholder="Please type your message"
      @input="handleInput"
      @scroll="handleScroll"
      @keyup="handleKeydown"
      :value="value"
      :style="{ ...viewStyle, ...backStyle }"
    ></textarea>
    <div class="backdrop" ref="backdrop" :style="backStyle">
      <div class="highlights" :style="viewStyle" v-html="highlightsValue"></div>
    </div>
    <div class="infos"></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    value: String,
    highlights: Object,
    height: {
      type: String,
      default: "300px",
    },
    width: {
      type: String,
      default: "100%",
    },
    content: Object,
  },
  name: "BaseEditor",
  data: () => ({
    selectionStart: 0,
    selectionEnd: 0,
    highlightsValue: null,
    highlightsTypes: ["blackListed", "grayListed", "undefined"],
  }),
  computed: {
    /**
     * @returns {Object}
     */
    backStyle() {
      return {
        width: this.width,
        height: this.height,
      };
    },
    /**
     * @returns {Object}
     */
    viewStyle() {
      return {
        padding: "15px",
        letterSpacing: "1px",
        font: "16px/28px 'Roboto', sans-serif",
      };
    },
    /**
     * @returns {Object}
     */
    editorRef() {
      return this.$refs.editor;
    },
    /**
     * @returns {Object}
     */
    backdropRef() {
      return this.$refs.backdrop;
    },
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
    handleScroll(e) {
      this.backdropRef.scrollTop = e.target.scrollTop;
      this.backdropRef.scrollLeft = e.target.scrollLeft;
    },
    handleKeydown(e) {
      this.selectionStart = e.target.selectionStart;
      this.selectionEnd = e.target.selectionEnd;
    },
    setPhrase(text) {
      if (text === null) return;

      let val = this.editorRef.value,
        arr = val.split(""),
        selectionStart = this.editorRef.selectionStart,
        selectionEnd = this.editorRef.selectionEnd;

      if (text === this.content.phrase) {
        this.editorRef.value = text;

        // white space modifiers for selection caret
        if (val[selectionStart - 1] == " " && val[selectionStart] == " ") {
          arr.splice(selectionStart - 1, 2, " ", " ").join("");
          this.editorRef.value = arr.join("");
        } else if (val[selectionStart - 1] == " ") {
          arr.splice(selectionStart - 1, 1, " ").join("");
          this.editorRef.value = arr.join("");
        }

        this.$emit("input", this.editorRef.value);
        this.editorRef.selectionStart = selectionStart;
        this.editorRef.selectionEnd = selectionEnd;
      } else {
        this.$emit("phrase", true);
      }
    },
    parseText(text) {
      this.highlightsTypes.forEach((h) => {
        this.highlights[h].forEach((item) => {
          text = text
            .replace(/\n$/g, "\n\n")
            .replace(
              new RegExp(item, 'gi'),
              "<mark class='" + h.toLowerCase() + "'>$&</mark>"
            );
        });
      });

      this.highlightsValue = text;
    },
  },
  watch: {
    "content.phrase": {
      handler() {
        this.setPhrase(this.content.phrase);
      },
      deep: true,
    },
    value(value) {
      this.parseText(value);
    },
  },
};
</script>

<style lang="scss">
.editor-container {
  position: relative;
}

.v-application .editor.primary,
.editor.primary {
  border: 2px solid;
  display: block;
  position: relative;
  z-index: 2;
  color: #444;
  overflow: auto;
  resize: none;
  transition: transform 1s;
  background-color: transparent !important;
}

.backdrop {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  overflow: auto;
  pointer-events: none;
  transition: transform 1s;
  background-color: #efefef !important;
}

.editor.primary,
.backdrop {
  border-radius: 10px;
}

.highlights,
.highlights mark {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.highlights {
  color: transparent;
  font-weight: normal;
}

.highlights mark {
  color: transparent;
  position: relative;
  background-color: transparent;
}

.highlights mark.blacklisted {
  position: relative;
  top: 2px;
  border-radius: 3px;
  background-color: rgb(253, 191, 191);
}

.highlights mark.graylisted {
  top: 2px;
  border-radius: 3px;
  background-color: yellow;  
}

.highlights mark.undefined {
  border-bottom: 2px solid grey;  
}

/* .highlights mark.blacklisted::before {
  content: "";
  position: absolute;
  top: 50%;
    transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 2px;
  background-color: red;
} */

/* .highlights mark.blacklisted {
  border-bottom: 2px solid red;
} */

textarea:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 5px 0 #ccc;
}
</style>
