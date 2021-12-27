<template>
  <v-textarea
    label="Please type your message"
    v-model="editor"
    outlined
  ></v-textarea>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    value: {
      type: String,
      default: "",
      required: true,
    },
  },
  data: () => ({
      editor: null
  }),
  watch: {
      editor() {
          console.log(this.editor);
      }
  }
};
</script>

<style></style>
