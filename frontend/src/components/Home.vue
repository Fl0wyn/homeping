<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" sm="12">
        <v-card class="mb-4">
          <v-toolbar flat dense>
            Updated today at : {{ time }}

            <v-spacer></v-spacer>

            <v-divider class="ml-3" vertical></v-divider>
            <template>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="color"
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="dialog1 = true"
                  >
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>Add new host</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="color"
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="dialog2 = true"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Remove all hosts</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="color"
                    v-bind="attrs"
                    v-on="on"
                    @click="onClick()"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <span>Export data</span>
              </v-tooltip>

              <!--               <v-divider class="mx-4" vertical></v-divider>
              <v-chip class="mr-4 font-weight-bold" color="success" content="5">
                2
              </v-chip>
              <v-chip class="mr-4 font-weight-bold" color="error" content="4">
                3
              </v-chip>
              <v-chip class="font-weight-bold" color="dark" dark content="4">
                5
              </v-chip> -->
            </template>
          </v-toolbar>
        </v-card>

        <v-card class="mx-auto" tile>
          <!-- <v-card-title>Dashboard</v-card-title> -->
          <!-- START : TABLE -->
          <v-data-table :headers="headers" :items="home" hide-default-footer>
            <template v-slot:[`item.alive`]="{ item }">
              <v-chip v-if="item.title == 'a'" small color="success" dark>
                <b> UP </b>
              </v-chip>
              <v-chip v-else small color="error" dark><b> DOWN </b></v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="color"
                    v-bind="attrs"
                    v-on="on"
                    class="mx-1"
                    @click="editApp(item.id)"
                  >
                    <v-icon @click="dialog3 = true">mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>

              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    :color="color"
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteApp(item.id)"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Remove</span>
              </v-tooltip>
            </template>
          </v-data-table>
          <!-- END : TABLE -->
        </v-card>
      </v-col>

      <!-- START : ACTIONS -->
      <!--       <v-col cols="12" lg="6" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title class="">Actions</v-card-title>

          <v-toolbar dense flat>
            <template>
              <v-btn-toggle borderless group>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="dialog1 = true"
                    >
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Add new host</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="dialog2 = true"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove all hosts</span>
                </v-tooltip>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </v-card>
      </v-col> -->
      <!-- END : ACTIONS -->
    </v-row>
    <!-- START : DIALOG -->
    <!-- START : ADD -->
    <v-dialog v-model="dialog1" max-width="350">
      <v-card tile>
        <v-toolbar dark color="primary" dense>
          <v-toolbar-title> Add new host</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog1 = false">
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="submit-form mx-auto mt-4">
          <div v-if="!submitted">
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="tutorial.title"
                :rules="[(v) => !!v || 'Hostname is required']"
                label="Hostname"
                required
                clearable
                prepend-icon="mdi-account-network-outline"
              ></v-text-field>

              <v-text-field
                v-model="tutorial.description"
                :rules="[(v) => !!v || 'IP is required']"
                label="IP"
                required
                clearable
                prepend-icon="mdi-ip-network-outline"
              ></v-text-field>
            </v-form>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="success" outlined @click="saveApp">
                Create
              </v-btn>
            </v-card-actions>
          </div>

          <div v-else>
            <v-alert type="success"></v-alert>
            {{ newApp() }}
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- END : ADD -->
    <!-- START : REMOVE ALL -->
    <v-dialog v-model="dialog2" max-width="350">
      <v-card tile>
        <v-toolbar dark color="primary" dense>
          <v-toolbar-title>Remove all hosts</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="dialog2 = false">
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-title class="pa-6"> Are your sure ? </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" outlined @click="removeAllApps">
            YES
          </v-btn>
          <v-btn color="error" outlined @click="dialog2 = false"> NO </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END : REMOVE ALL -->
    <!-- END : DIALOG -->

    <!-- START : SNACKBAR -->
    <v-snackbar v-model="snackbar" top :color="colorSnackbar" timeout="1200">
      <v-icon class="mr-2">{{ iconSnackbar }}</v-icon>
      <b>{{ textSnackbar }} </b>
    </v-snackbar>
    <!-- END : SNACKBAR -->
  </v-container>
</template>

<script>
import DataService from "../services/DataService";

import axios from "axios";
import ipRegex from "ip-regex";

export default {
  name: "homes",

  data() {
    return {
      dialog1: false,
      dialog2: false,

      snackbar: false,
      textSnackbar: "",
      colorSnackbar: "",
      iconSnackbar: "",

      color: "dark",
      time: new Date().toLocaleTimeString(),

      tutorial: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      submitted: false,

      home: [],
      title: "",
      headers: [
        { text: "Hostname", align: "start", sortable: false, value: "title" },
        { text: "IP", value: "description", sortable: false },
        { text: "Status", value: "alive", sortable: false, align: "center" },
        { text: "Uptime", value: "uptime", sortable: false },
        { text: "TTL", value: "ttl", sortable: false },
        { text: "Enabled", value: "status", sortable: false, align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ],
    };
  },

  methods: {
    onClick() {
      var date = new Date();
      axios({
        url: "http://localhost:8080/api/apps",
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

    newSnackbar(text, color, icon) {
      this.snackbar = true;
      this.textSnackbar = text;
      this.colorSnackbar = color;
      this.iconSnackbar = icon;
    },

    saveApp() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
      };

      if (!this.tutorial.title || !this.tutorial.description) {
        this.newSnackbar("Error: empty field", "error", "mdi-close-circle");
      } else {
        if (ipRegex({ exact: true }).test(this.tutorial.description)) {
          DataService.create(data)
            .then((response) => {
              this.tutorial.id = response.data.id;
              console.log(response.data);
              this.submitted = true;
              this.newSnackbar(
                "Success: New host added",
                "success",
                "mdi-check-circle"
              );
            })
            .catch((e) => {
              console.log(e);
            });

          this.refreshList();
        } else {
          this.newSnackbar("Error: Invalid IP", "error", "mdi-close-circle");
        }
      }
    },

    newApp() {
      this.submitted = false;
      this.tutorial = {};
      this.$refs.form.reset();
    },

    retrieveApps() {
      DataService.getAll()
        .then((response) => {
          this.home = response.data.map(this.getDisplayApp);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveApps();
    },

    removeAllApps() {
      DataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
          this.newSnackbar(
            "Success: All hosts removed",
            "success",
            "mdi-check-circle"
          );
        })
        .catch((e) => {
          console.log(e);
        });
      this.dialog2 = false;
    },

    editApp(id) {
      this.$router.push({ name: "app-details", params: { id: id } });
    },

    deleteApp(id) {
      DataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayApp(tutorial) {
      return {
        id: tutorial.id,
        title:
          tutorial.title.length > 30
            ? tutorial.title.substr(0, 30) + "..."
            : tutorial.title,
        description:
          tutorial.description.length > 30
            ? tutorial.description.substr(0, 30) + "..."
            : tutorial.description,
        status: tutorial.published ? "Yes" : "No",
      };
    },
  },
  mounted() {
    this.retrieveApps();

    window.setInterval(() => {
      this.time = new Date().toLocaleTimeString();
      this.retrieveApps();
    }, 30 * 1000 * 1);
  },
};
</script>

<style>
.list {
  max-width: 750px;
}

.submit-form {
  max-width: 300px;
}
</style>
