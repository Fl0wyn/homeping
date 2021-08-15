<template>
  <div class="submit-form mx-auto mt-6">
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
      {{ newTutorial() }}
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "add-tutorial",
  data() {
    return {
      text: `Submitted successfully!`,
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
