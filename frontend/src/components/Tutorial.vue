<template>
  <div v-if="currentTutorial" class="edit-form py-3">
    <p class="headline">Edit Host</p>

    <v-form ref="form" lazy-validation>
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

      <label><strong>Enabled:</strong></label>
      {{ currentTutorial.published ? "Yes" : "No" }}

      <v-divider class="my-5"></v-divider>

      <v-btn small class="mr-2" color="light" to="/">
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>

      <v-btn
        v-if="currentTutorial.published"
        @click="updatePublished(false)"
        small
        color="primary"
        class="mr-2"
      >
        Disabled
      </v-btn>

      <v-btn
        v-else
        @click="updatePublished(true)"
        small
        color="primary"
        class="mr-2"
      >
        Enabled
      </v-btn>

      <v-btn small color="error" class="mr-2" @click="deleteTutorial">
        Delete
      </v-btn>

      <v-btn small color="success" @click="updateTutorial"> Update </v-btn>
    </v-form>

    <p class="mt-3">{{ message }}</p>
  </div>

  <div v-else>
    <p>Please click on a Tutorial...</p>
  </div>
</template>

<script>
import DataService from "../services/DataService";

export default {
  name: "home-details",
  data() {
    return {
      currentTutorial: null,
      message: "",
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
  max-width: 300px;
  margin: auto;
}
</style>
