<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="8" class="mx-auto">
            <text-input v-model="editor" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TextInput from "./components/TextInput.vue";

export default {
  name: "App",
  components: {
    TextInput,
  },
  data: () => ({
    editor: ""
  }),
};
</script>
