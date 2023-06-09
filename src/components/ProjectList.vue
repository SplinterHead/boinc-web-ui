<template>
  <div>
    <div v-if="activeClient.name">
      <div v-if="allProjects.length == 0">No Projects found</div>
      <div v-else id="projects">
        <b-nav id="filter-bar">
          <b-nav-item disabled>Categories:</b-nav-item>
          <b-nav-item-dropdown
            id="category-select"
            :text="
              filters.category == '' ? 'Select...' : filters.category.toString()
            "
          >
            <b-dropdown-item
              v-for="category in categories"
              :key="category"
              @click="setCategory(category)"
            >
              {{ category }}
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="setCategory('')">Reset</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
        <div id="project-list">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            class="project-card"
          />
        </div>
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
      filters: {
        category: "",
      },
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
  computed: {
    categories() {
      return new Set(this.allProjects.map((proj) => proj.general_area));
    },
    filteredProjects() {
      if (this.filters.category == "") {
        return this.allProjects;
      } else {
        return this.allProjects.filter(
          (project) => project.general_area == this.filters.category
        );
      }
    },
  },
  methods: {
    setCategory(category) {
      this.filters.category = category;
    },
  },
};
</script>

<style scoped>
.project-card {
  margin-bottom: 3px;
}
</style>
