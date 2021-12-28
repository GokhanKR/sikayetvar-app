<template>
  <v-app id="app">
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" lg="8" class="mx-auto py-6">
            <img src="logo.svg" width="200" alt="Logo" />
          </v-col>
          <v-col cols="12" lg="8" class="mx-auto py-4">
            <home />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- Snackbar  -->
    <v-snackbar
      v-model="snackbar.value"
      :timeout="snackbar.timeout"
      :color="snackbar.status ? 'success' : 'error'"
    >
      {{ snackbar.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar.value = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- ./Snackbar  -->
  </v-app>
</template>

<script>
import Home from "./views/Home.vue";

export default {
  name: "App",
  components: {
    Home,
  },
  data: () => ({
    editor: "",
  }),
  computed: {
    /**
     * @returns {Object}
     */
    snackbar() {
      return this.$store.state.notify;
    },
  },
};
</script>

<style>
#app {
  background-color: #ededed;
}
</style>
