<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <!-- <v-icon large class="mx-4">mdi-home-automation</v-icon> -->
      <img src="./assets/logo.svg" width="28px" class="mx-4" alt="" />
      <v-toolbar-title class="d-none d-sm-flex">Ping Monitor</v-toolbar-title>

      <v-spacer></v-spacer>

      <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mr-4" v-bind="attrs" v-on="on" @click="toggleTheme()"
              >mdi-theme-light-dark</v-icon
            >
          </template>
          <span>Dark/light Theme</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" @click="$router.go()"
              >mdi-refresh</v-icon
            >
          </template>
          <span>Reload page</span>
        </v-tooltip>
      </div>

      <v-divider class="mx-6" dark vertical></v-divider>

      <div class="text-center">
        {{ dateLive }}
        <br />
        {{ timeLive }}
      </div>

      <v-divider class="mx-6" dark vertical></v-divider>

      <div>
        {{ ipInfo }}
        <br />
        {{ osInfo() }},
        {{ navigatorInfo() }}
      </div>
    </v-app-bar>

    <v-main class="ma-8">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import { navigatorInfo, osInfo } from "./functions";

export default {
  name: "app",

  data: () => ({
    ipInfo: "",
    timeLive: new Date().toLocaleTimeString(),
    dateLive: new Date().toLocaleDateString(),
  }),

  methods: {
    navigatorInfo,
    osInfo,

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },

    onClick() {
      var date = new Date();
      axios({
        url: "http://localhost:8080/api/tutorials",
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          "PingMonitor_" +
            date.toLocaleDateString().replaceAll("/", "-") +
            "_" +
            date.toLocaleTimeString().replaceAll(":", "-") +
            "_.json"
        );
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
  },

  mounted() {
    axios
      .get("http://localhost:8080/ip")
      .then((response) => (this.ipInfo = response.data));

    window.setInterval(() => {
      var date = new Date();
      this.timeLive = date.toLocaleTimeString();
      this.dateLive = date.toLocaleDateString();
    }, 1 * 1000 * 1);
  },
};
</script>
