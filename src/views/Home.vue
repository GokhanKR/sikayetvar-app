<template>
  <div>
    <div class="mb-5">
      <h2 class="title secondary--text mb-1">
        <v-icon left size="28" color="secondary">mdi-text</v-icon>
        Text Editörü
      </h2>
      <v-divider></v-divider>
    </div>
    <div>
      <p class="text-subtitle-2 mb-1">
        <v-chip outlined color="primary">
          <v-icon left>mdi-tooltip-text-outline</v-icon>
          Deneme Yazısını İçe Aktarın</v-chip
        >
      </p>
      <p
        ref="text"
        class="d-flex align-center text-subtitle-1 font-weight-light px-1"
      >
        <span class="mr-4">
          “<span class="text">{{ text }}</span
          >”
        </span>
        <v-btn fab x-small color="primary" @click="replaceText"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
      </p>
    </div>
    <div>
      <text-editor v-model="editor" />
    </div>
  </div>
</template>

<script>
import TextEditor from "../components/TextEditor.vue";

export default {
  name: "Home",
  components: {
    TextEditor,
  },
  data: () => ({
    text: "bir test uygulamasi içeriğidir. nokta sonrası ilk harf örneği. Dolandırıcı dönek kelimeaaaleri tehlikeli.",
    editor: "",
  }),
  methods: {
    replaceText() {
      let text = this.$refs.text.querySelector("span.text").innerText;
      this.editor = text;
    },
  },
};
</script>
