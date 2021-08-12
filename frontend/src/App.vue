<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-icon large class="mx-4">mdi-home-automation</v-icon>
      <v-toolbar-title class="d-none d-sm-flex">Ping Monitor</v-toolbar-title>

<!--       <v-spacer></v-spacer>

      <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
    </v-app-bar>

    <v-main class="mt-12 px-8">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
};
</script>
