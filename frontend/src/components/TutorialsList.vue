<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>Dashboard</v-card-title>

          <v-data-table
            :headers="headers"
            :items="tutorials"
            disable-pagination
            :hide-default-footer="true"
          >
            <template v-slot:[`item.alive`]="{ item }">
              <v-chip v-if="item.title == 'a'" small color="green" dark>
                <b> UP </b>
              </v-chip>
              <v-chip v-else small color="red" dark> <b> DOWN</b> </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="editTutorial(item.id)">mdi-playlist-edit</v-icon>

              <v-icon @click="deleteTutorial(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" lg="6" sm="12">
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
                    <v-btn v-bind="attrs" v-on="on" @click="removeAllTutorials">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove All</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" @click="onClick()">
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Export</span>
                </v-tooltip>

                <!--                 <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                      <v-icon>mdi-cloud-upload</v-icon>
                    </v-btn>
                  </template>
                  <span>Import</span>
                </v-tooltip> -->
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
    <!-- START : dialog1 -->
    <!-- START : ADD -->
    <v-dialog v-model="dialog1" max-width="350">
      <v-card tile>
        <v-toolbar dark color="blue-grey" dense>
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
              ></v-text-field>

              <v-text-field
                v-model="tutorial.description"
                :rules="[(v) => !!v || 'IP is required']"
                label="IP"
                required
              ></v-text-field>
            </v-form>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue-grey" outlined @click="saveTutorial">
                <!-- to="/tutorials" -->
                Submit
              </v-btn>
            </v-card-actions>
          </div>

          <div v-else>
            <v-alert type="success"></v-alert>
            {{ newTutorial() }}
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- END : ADD -->
    <!-- START : REMOVE ALL -->
    <v-dialog v-model="dialog2" max-width="350">
      <v-card tile>
        <v-toolbar dark color="blue-grey" dense>
          <v-toolbar-title> Add new host</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog2 = false">
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-btn></v-btn>
      </v-card>
    </v-dialog>
    <!-- END : REMOVE ALL -->
    <!-- END : dialog -->

    <!-- START : Snackbar -->
    <v-snackbar v-model="snackbar" top :color="colorSnackbar" timeout="1200">
      <v-icon class="mr-2">{{ iconSnackbar }}</v-icon>
      <b>{{ textSnackbar }} </b>
    </v-snackbar>
    <!-- END : Snackbar -->
  </v-container>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

import axios from "axios";

export default {
  name: "tutorials-list",

  data() {
    return {
      dialog1: false,
      dialog2: false,

      // Snackbar
      snackbar: false,
      textSnackbar: "",
      colorSnackbar: "",
      iconSnackbar: "",

      text: `Submitted successfully!`,
      tutorial: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      submitted: false,

      tutorials: [],
      title: "",
      headers: [
        { text: "Hostname", align: "start", sortable: false, value: "title" },
        { text: "IP", value: "description", sortable: false },
        { text: "Status", value: "alive", sortable: false },
        { text: "Uptime", value: "uptime", sortable: false },
        { text: "TTL", value: "ttl", sortable: false },
        { text: "Enabled", value: "status", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
    newSnackbar(text, color, icon) {
      this.snackbar = true;
      this.textSnackbar = text;
      this.colorSnackbar = color;
      this.iconSnackbar = icon;
    },

    saveTutorial() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
      };

      if (!this.tutorial.title || !this.tutorial.description) {
        this.newSnackbar("Error: empty field", "error", "mdi-close-circle");
      } else {
        TutorialDataService.create(data)
          .then((response) => {
            this.tutorial.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });

        this.refreshList();
        this.newSnackbar(
          "Success: New host added",
          "success",
          "mdi-check-circle"
        );
      }
    },

    newTutorial() {
      this.submitted = false;
      this.tutorial = {};
      this.$refs.form.reset();
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

    retrieveTutorials() {
      TutorialDataService.getAll()
        .then((response) => {
          this.tutorials = response.data.map(this.getDisplayTutorial);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveTutorials();
    },

    removeAllTutorials() {
      TutorialDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /*     searchTitle() {
      TutorialDataService.findByTitle(this.title)
        .then((response) => {
          this.tutorials = response.data.map(this.getDisplayTutorial);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
 */
    editTutorial(id) {
      this.$router.push({ name: "tutorial-details", params: { id: id } });
    },

    deleteTutorial(id) {
      TutorialDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayTutorial(tutorial) {
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
    this.retrieveTutorials();

    window.setInterval(() => {
      this.retrieveTutorials();
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
