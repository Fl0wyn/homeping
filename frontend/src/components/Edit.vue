<template>
  <v-container>
    <v-card
      flat
      color="dali"
      class="d-flex flex-column justify-space-between align-center"
    >
      <v-card width="700">
        <v-toolbar flat dark color="primary" dense>
          <v-toolbar-title> Edit Host</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon to="/">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div v-if="currentApp" class="edit-form">
          <p class="headline my-4"></p>

          <v-form ref="form" lazy-validation>
            <v-row class="mt-6">
              <v-col cols="12" sm="12" lg="6">
                <v-text-field
                  v-model="currentApp.title"
                  :rules="[(v) => !!v || 'Hostname is required']"
                  label="Hostname"
                  required
                  clearable
                  prepend-icon="mdi-account-network-outline"
                ></v-text-field>

                <v-text-field
                  v-model="currentApp.description"
                  :rules="[(v) => !!v || 'IP is required']"
                  label="IP"
                  required
                  clearable
                  prepend-icon="mdi-ip-network-outline"
                ></v-text-field>

                <v-text-field
                  :value="currentApp.published ? 'Yes' : 'No'"
                  label="Enabled"
                  disabled
                  :prepend-icon="
                    currentApp.published
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
                  v-if="currentApp.published"
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

                <v-btn outlined color="success" @click="updateApp">
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <p class="mt-3">{{ message }}</p>
        </div>

        <div v-else>
          <p class="ma-6">Please wait...</p>
        </div>
      </v-card>
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
      switch1: false,

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
        title: this.currentApp.title,
        description: this.currentApp.description,
        published: status,
      };

      DataService.update(this.currentApp.id, data)
        .then((response) => {
          this.currentApp.published = status;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateApp() {
      if (!this.currentApp.title || !this.currentApp.description) {
        this.newSnackbar("Error: empty field", "error", "mdi-close-circle");
      } else {
        if (ipRegex({ exact: true }).test(this.currentApp.description)) {
          DataService.update(this.currentApp.id, this.currentApp)
            .then((response) => {
              console.log(response.data);
              this.newSnackbar(
                "Success: Updated successfully",
                "success",
                "mdi-check-circle"
              );
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
          this.$router.push({ name: "/" });
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
