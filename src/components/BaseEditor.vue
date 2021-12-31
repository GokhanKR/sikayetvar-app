<template>
  <div class="editor-container pb-8" :style="backStyle">
    <textarea
      class="editor primary mb-4"
      ref="editor"
      contenteditable
      placeholder="Please type your message"
      @input="handleInput"
      @scroll="handleScroll"
      @keyup="handleKeydown"
      @keydown="handleScroll"
      :value="value"
      :style="{ ...viewStyle, ...backStyle }"
    ></textarea>
    <div class="backdrop" ref="backdrop" :style="backStyle">
      <div
        class="highlights"
        ref="highlights"
        :style="viewStyle"
        v-html="highlightsValue"
      ></div>
    </div>
    <div class="infos d-flex flex-wrap">
      <div :key="key" v-for="(item, key) in highlightsTypes" class="mr-4 mb-1">
        <p
          v-if="highlights[item].length"
          class="d-flex align-center text-subtitle-2 font-weight-light"
        >
          <v-sheet
            width="15px"
            height="15px"
            :class="item.toLowerCase()"
            class="mr-2"
            elevation="2"
            rounded="lg"
          ></v-sheet
          >{{ highlightsTexts[item] }}
        </p>
      </div>
    </div>
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
    content: Object,
  },
  name: "BaseEditor",
  data: () => ({
    selectionStart: 0,
    selectionEnd: 0,
    highlightsValue: null,
    highlightsTypes: ["blackListed", "grayListed", "undefined"],
    highlightsTexts: {
      blackListed: "Yasaklı kelime kullandınız",
      grayListed: "Şüpheli kelime kullandınız",
      undefined: "Belirsiz kelime kullandınız",
    },
    scrollInternal: null,
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
      this.parseText(e.target.value);
      this.$emit("input", e.target.value);
    },
    handleScroll(e) {
      this.$refs.backdrop.scrollTop = e.target.scrollTop;
      this.$refs.backdrop.scrollLeft = e.target.scrollLeft;
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

      // Is the output the same as the original output?
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

        // smart selector behavior in word
        while (
          this.editorRef.value[selectionStart]?.match(/\w/) &&
          this.editorRef.value.length >= selectionStart
        ) {
          selectionStart++;
          selectionEnd++;
        }

        // set the editor selection start and end positions
        this.editorRef.selectionStart = selectionStart;
        this.editorRef.selectionEnd = selectionEnd;
      } else {
        this.$emit("phrase", true);
      }
    },
    /**
     * Set up hightlighters
     *
     * @param {String} text
     *
     * @returns {Void}
     */
    parseText(text) {
      this.highlightsTypes.forEach((h) => {
        this.highlights[h].forEach((item) => {
          text = text
            .replace(/\n$/g, "\n\n")
            .replace(
              new RegExp(item + "(?!\\w+|[ıİşŞöÖçÇğĞüÜ])", "gi"),
              "<mark class='" + h.toLowerCase() + "'>$&</mark>"
            );
        });
      });

      this.highlightsValue = text;
    },
  },
  watch: {
    /**
     * change phrase when change
     */
    "content.phrase": {
      handler() {
        this.setPhrase(this.content.phrase);
      },
      deep: true,
    },
    /**
     * change phrase when change
     */
    highlights() {
      this.parseText(this.value);
    },
  },
};
</script>

<style lang="scss">

$blacklistedColor: rgb(187, 0, 0);
$graylistedColor: #bbb;
$undefinedColor: yellow;

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
  border: 2px solid;
  color: transparent;
  font-weight: normal;
  padding: 0.1rem;
}

.highlights mark {
  color: transparent;
  background-color: transparent;
}

.blacklisted {
  background-color: $blacklistedColor !important;
}

.graylisted {
  background-color: $undefinedColor !important;
}

.undefined {
  background-color: $graylistedColor !important;
}

mark.blacklisted {
  font-weight: bold;
  color: $blacklistedColor !important;
  background-color: transparent !important;
  position: relative;
}

mark.blacklisted::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  background-color: $blacklistedColor !important;
  height: 2px;
}

mark.graylisted {
  border-radius: 3px;
}

mark.undefined {
  background-color: transparent !important;
  border-bottom: 2px solid $graylistedColor;
}

textarea:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 5px 0 #ccc;
}
</style>
