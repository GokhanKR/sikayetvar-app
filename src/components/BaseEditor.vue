<template>
  <div class="editor-container" :style="backStyle">
    <textarea
      class="editor primary"
      ref="editor"
      contenteditable
      placeholder="Please type your message"
      @input="handleInput"
      @scroll="handleScroll"
      :value="value"
      :style="{ ...viewStyle, ...backStyle }"
    ></textarea>
    <div class="backdrop" ref="backdrop" :style="backStyle">
      <div class="highlights" :style="viewStyle"></div>
    </div>
    <div class="infos"></div>
  </div>
</template>

<script>
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
    phrase: String,
  },
  name: "BaseEditor",
  data: () => ({
    selectionStart: 0,
    selectionEnd: 0,
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
        padding: "1em",
        letterSpacing: "1px",
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
    setPhrase(text) {
      let selection = this.editorRef.selectionStart;

      this.$emit("input", text);
      this.editorRef.selectionStart = selection;
    },
  },
  watch: {
    phrase() {
      this.setPhrase(this.phrase);
    },
    value() {
      this.selectionStart = this.editorRef.selectionStart;
      this.selectionEnd = this.editorRef.selectionEnd;
    },
  },
};
</script>

<style scoped>
.editor-container {
  position: relative;
}

.editor.primary {
  border: 2px solid;
  display: block;
  position: relative;
  z-index: 2;
  color: #444;
  background-color: transparent !important;
  overflow: auto;
  resize: none;
  transition: transform 1s;
}

.backdrop {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  overflow: auto;
  background-color: #efefef !important;
  pointer-events: none;
  transition: transform 1s;
}

.editor.primary,
.backdrop {
  border-radius: 10px;
}

.highlights {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
}

mark {
  border-radius: 3px;
  color: transparent;
  background-color: #b1d5e5;
}

textarea:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 5px 0 #ccc;
}
</style>
