<template>
  <!-- <v-row align="center" class="list px-3 mx-auto"> -->

  <v-row class="mx-auto">
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
            <v-chip v-if="item.title == 'titi'" small color="green" dark>
              UP
            </v-chip>
            <v-chip v-else small color="red" dark> DOWN </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="editTutorial(item.id)"
              >mdi-pencil</v-icon
            >
            <v-icon @click="deleteTutorial(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Commands</v-card-title>

        <v-card-actions>
          <v-btn color="orange" dark @click="removeAllTutorials">
            Remove All
          </v-btn>

          <v-btn color="primary" to="/add"> Add Host</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "tutorials-list",
  data() {
    return {
      tutorials: [],
      title: "",
      headers: [
        { text: "Hostname", align: "start", sortable: true, value: "title" },
        { text: "IP", value: "description", sortable: true },
        { text: "Status", value: "alive", sortable: true },
        { text: "Uptime", value: "uptime", sortable: true },
        { text: "TTL", value: "ttl", sortable: true },
        { text: "Enabled", value: "status", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
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
