<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Add Host</p>

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

      <v-btn class="mr-2 mt-3" color="light" to="/tutorials">
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <v-btn color="primary" class="mt-3" @click="saveTutorial">Submit</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title> Submitted successfully! </v-card-title>

        <v-card-subtitle> Click the "add" button to add new Host. </v-card-subtitle>

        <v-card-actions>
          <v-btn class="mr-2" color="light" to="/tutorials">
            <v-icon>mdi-arrow-left-bold</v-icon>
          </v-btn>
          <v-btn color="primary" @click="newTutorial">Add</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "add-tutorial",
  data() {
    return {
      tutorial: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      submitted: false,
    };
  },
  methods: {
    saveTutorial() {
      var data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
      };

      TutorialDataService.create(data)
        .then((response) => {
          this.tutorial.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newTutorial() {
      this.submitted = false;
      this.tutorial = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>
