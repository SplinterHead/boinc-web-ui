<template>
  <div>
    <div v-if="activeClient.name">
      <div v-if="allProjects.length == 0">No Projects found</div>
      <div v-else id="project-list">
        <ProjectCard
          v-for="project in allProjects"
          :key="project.name"
          :project="project"
          class="project-card"
        />
      </div>
    </div>
    <div v-else>Please choose a client</div>
  </div>
</template>

<script>
import axios from "axios";

import ProjectCard from "@/components/project/ProjectCard.vue";

export default {
  name: "ProjectList",
  components: {
    ProjectCard,
  },
  props: {
    activeClient: Object,
  },
  data() {
    return {
      allProjects: [],
    };
  },
  mounted() {
    if (this.activeClient.name) {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/project/all?client=${this.activeClient.id}`
        )
        .then((response) => {
          this.allProjects = response.data.projects;
        });
    }
  },
};
</script>

<style scoped>
.project-card {
  margin-bottom: 3px;
}
</style>
