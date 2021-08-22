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
            <v-btn icon v-bind="attrs" v-on="on" @click="toggleTheme()">
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </template>
          <span>Dark/light Theme</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="$router.go()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
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

    <v-footer padless>
      <v-col class="text-center font-weight-light subtitle-2 py-0" cols="12">
        v{{ version }}
        {{ "©" + new Date().getFullYear() }}
        <a class="hrefStyle mx-6" href="/"> Ping Monitor </a>

        <v-btn icon href="https://github.com/debmus/homeping" target="_blank">
          <v-icon> mdi-github </v-icon>
        </v-btn>
      </v-col>
    </v-footer>
  </v-app>
  <!-- 

    Fork me on Github 


 -->
</template>



<script>
import axios from "axios";
import { navigatorInfo, osInfo } from "./functions";

export default {
  name: "app",

  data: () => ({
    version: "",
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
  },

  async created() {
    const response = await fetch("VERSION");
    this.version = await response.text();
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


<style scoped>
.hrefStyle {
  color: var(--v-primary-base);
  text-decoration: none;
}
</style>