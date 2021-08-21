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

        <div v-if="currentTutorial" class="edit-form">
          <p class="headline my-4"></p>

          <v-form ref="form" lazy-validation>
            <v-row class="mt-6">
              <v-col cols="12" sm="12" lg="6">
                <v-text-field
                  v-model="currentTutorial.title"
                  :rules="[(v) => !!v || 'Title is required']"
                  label="Hostname"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="currentTutorial.description"
                  :rules="[(v) => !!v || 'Description is required']"
                  label="IP"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12" lg="6">
                <v-text-field
                  :value="currentTutorial.published ? 'Yes' : 'No'"
                  label="Enabled"
                  readonly
                ></v-text-field>

                <br />

                <v-btn
                  v-if="currentTutorial.published"
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

                <v-btn
                  outlined
                  color="error"
                  class="mr-2"
                  @click="deleteTutorial"
                >
                  Delete
                </v-btn>

                <v-btn outlined color="success" @click="updateTutorial">
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <p class="mt-3">{{ message }}</p>
        </div>

        <div v-else>
          <p>Please click on a Tutorial...</p>
        </div>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import DataService from "../services/DataService";

export default {
  name: "home-details",
  data() {
    return {
      currentTutorial: null,
      message: "",
      switch1: false,
    };
  },
  methods: {
    getTutorial(id) {
      DataService.get(id)
        .then((response) => {
          this.currentTutorial = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.currentTutorial.id,
        title: this.currentTutorial.title,
        description: this.currentTutorial.description,
        published: status,
      };

      DataService.update(this.currentTutorial.id, data)
        .then((response) => {
          this.currentTutorial.published = status;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateTutorial() {
      DataService.update(this.currentTutorial.id, this.currentTutorial)
        .then((response) => {
          console.log(response.data);
          this.message = "The home was updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteTutorial() {
      DataService.delete(this.currentTutorial.id)
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
    this.getTutorial(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 650px;
  margin: auto;
}
</style>
