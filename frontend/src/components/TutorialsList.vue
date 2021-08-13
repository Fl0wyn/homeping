<template>
  <v-container>
    <!-- <v-row align="center" class="list px-3 mx-auto"> -->

    <v-row>
      <!--     <v-col cols="12" md="8">
      <v-text-field v-model="title" label="Search by Title"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="searchTitle"> Search </v-btn>
    </v-col>
 -->
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
              <v-chip v-if="item.title == 'aa'" small color="green" dark>
                <b> UP </b>
              </v-chip>
              <v-chip v-else small color="red" dark> <b> DOWN</b> </v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="editTutorial(item.id)">
                <v-icon color="black">mdi-playlist-edit</v-icon>
              </v-btn>

              <!--             <v-icon
              color="blue-grey"
              class="mr-2"
              @click="editTutorial(item.id)"
              >mdi-pencil</v-icon
            >
 -->
              <!--             <v-icon color="blue-grey" @click="deleteTutorial(item.id)"
              >mdi-delete</v-icon
            > -->
              <!--             <v-dialog v-model="dialog" max-width="300">
              <v-card>
                <v-card-title class="text-h5">
                  Delete {{ item.title }} ?
                </v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="success" text @click="deleteTutorial(item.id)">
                    Yes
                  </v-btn>

                  <v-btn color="error" outlined dark @click="dialog = false">
                    No
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog> -->
            </template>
          </v-data-table>

          <!--  <v-divider class="mb-4"></v-divider> -->

          <!--         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on"> -->
          <!--         <router-link to="/add">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="text-center">
                    <v-icon color="blue-grey">mdi-plus-circle</v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </router-link> -->
          <!--             </span>
          </template>
          <span>Add a new host</span>
        </v-tooltip> -->
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>div</v-card-title>
          <v-card-actions> 0 </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6" sm="12">
        <v-card class="mx-auto" tile>
          <!-- <v-card-title class="">Actions</v-card-title> -->

          <v-toolbar dense flat>
            <template>
              <v-btn-toggle borderless group>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" to="/add">
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Add host</span>
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

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                      <v-icon>mdi-cloud-upload</v-icon>
                    </v-btn>
                  </template>
                  <span>Import</span>
                </v-tooltip>
              </v-btn-toggle>
            </template>
          </v-toolbar>

          <!--  <v-card-actions> </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
import axios from "axios";

export default {
  name: "tutorials-list",
  data() {
    return {
      /* dialog: false, */

      tutorials: [],
      title: "",
      headers: [
        { text: "Hostname", align: "start", sortable: true, value: "title" },
        { text: "IP", value: "description", sortable: true },
        { text: "Status", value: "alive", sortable: true },
        { text: "Uptime", value: "uptime", sortable: true },
        { text: "TTL", value: "ttl", sortable: true },
        { text: "Enabled", value: "status", sortable: true },
        { text: "Edit", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
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
</style>
