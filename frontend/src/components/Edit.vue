<template>
  <v-container>
    <v-card
      flat
      color="dali"
      class="d-flex flex-column justify-space-between align-center"
    >
      <div v-if="currentApp">
        <v-card width="700px" class="mb-4">
          <v-toolbar flat dense>
            <v-toolbar-title> Edit Host </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-divider class="mr-1" vertical></v-divider>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="primary" v-bind="attrs" v-on="on" to="/">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Close</span>
            </v-tooltip>
          </v-toolbar>
        </v-card>

        <v-card width="700px">
          <div class="edit-form">
            <v-form ref="form" lazy-validation>
              <v-row class="mt-6">
                <v-col cols="12" sm="12" lg="6">
                  <v-text-field
                    v-model="currentApp.hostname"
                    :rules="[(v) => !!v || 'Hostname is required']"
                    label="Hostname"
                    required
                    clearable
                    prepend-icon="mdi-account-network-outline"
                  ></v-text-field>

                  <v-text-field
                    v-model="currentApp.ip"
                    :rules="[(v) => !!v || 'IP is required']"
                    label="IP"
                    required
                    clearable
                    prepend-icon="mdi-ip-network-outline"
                  ></v-text-field>

                  <v-text-field
                    :value="currentApp.enabled ? 'Yes' : 'No'"
                    label="Enabled"
                    disabled
                    :prepend-icon="
                      currentApp.enabled
                        ? 'mdi-check-circle-outline'
                        : 'mdi-checkbox-blank-circle-outline'
                    "
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12" lg="6">
                  <v-text-field
                    :value="
                      currentApp.createdAt.split('T')[0].replaceAll('-', '/') +
                      ' - ' +
                      currentApp.createdAt.split('T')[1].split('.')[0]
                    "
                    label="Created"
                    prepend-icon="mdi-calendar"
                    disabled
                  ></v-text-field>

                  <v-text-field
                    :value="
                      currentApp.updatedAt.split('T')[0].replaceAll('-', '/') +
                      ' - ' +
                      currentApp.updatedAt.split('T')[1].split('.')[0]
                    "
                    label="Last updated"
                    prepend-icon="mdi-calendar"
                    disabled
                  ></v-text-field>

                  <br />

                  <!-- 
                  
                  
                  BTN
                  
                  
                   -->

                  <v-btn
                    v-if="currentApp.enabled"
                    @click="updatePublished(false)"
                    outlined
                    color="dark"
                    class="mr-2"
                    width="110"
                  >
                    Disabled
                  </v-btn>
                  <v-btn
                    v-else
                    @click="updatePublished(true)"
                    outlined
                    color="dark"
                    class="mr-2"
                    width="110"
                  >
                    Enabled
                  </v-btn>

                  <v-btn outlined color="error" class="mr-2" @click="deleteApp">
                    Delete
                  </v-btn>

                  <v-btn
                    v-if="message == ''"
                    outlined
                    color="success"
                    @click="updateApp"
                  >
                    Update
                  </v-btn>
                </v-col>
                <code style="width: 100% !important" class="my-4 mx-2">
                  <v-chip small class="float-right pink--text">json</v-chip>
                  <pre>{{ currentApp }}</pre>
                </code>
              </v-row>
            </v-form>

            <p class="mt-3">{{ message }}</p>
          </div>
        </v-card>
      </div>
      <div v-else>
        <p class="ma-6">error..</p>
      </div>
    </v-card>
    <v-snackbar v-model="snackbar" top :color="colorSnackbar" timeout="1200">
      <v-icon class="mr-2">{{ iconSnackbar }}</v-icon>
      <b>{{ textSnackbar }} </b>
    </v-snackbar>
  </v-container>
</template>

<script>
import DataService from "../services/DataService";
import ipRegex from "ip-regex";

export default {
  name: "app-details",
  data() {
    return {
      currentApp: null,
      message: "",

      snackbar: false,
      textSnackbar: "",
      colorSnackbar: "",
      iconSnackbar: "",
    };
  },
  methods: {
    newSnackbar(text, color, icon) {
      this.snackbar = true;
      this.textSnackbar = text;
      this.colorSnackbar = color;
      this.iconSnackbar = icon;
    },

    getApp(id) {
      DataService.get(id)
        .then((response) => {
          this.currentApp = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.currentApp.id,
        hostname: this.currentApp.hostname,
        ip: this.currentApp.ip,
        enabled: status,
      };

      DataService.update(this.currentApp.id, data)
        .then((response) => {
          this.currentApp.enabled = status;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateApp() {
      if (!this.currentApp.hostname || !this.currentApp.ip) {
        this.newSnackbar("Error: empty field", "error", "mdi-close-circle");
      } else {
        if (ipRegex({ exact: true }).test(this.currentApp.ip)) {
          DataService.update(this.currentApp.id, this.currentApp)
            .then((response) => {
              console.log(response.data);
              this.$router.push({ name: "home" });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          this.newSnackbar("Error: Invalid IP", "error", "mdi-close-circle");
        }
      }
    },

    deleteApp() {
      DataService.delete(this.currentApp.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "home" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getApp(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 650px;
  margin: auto;
}
</style>
