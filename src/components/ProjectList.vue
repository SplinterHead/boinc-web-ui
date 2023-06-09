<template>
  <div>
    <div v-if="activeClient.name">
      <div v-if="allProjects.length == 0">No Projects found</div>
      <div v-else id="projects">
        <b-nav id="filter-bar">
          <b-nav-item id="category-label" disabled>Categories:</b-nav-item>
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
          <b-nav-item
            v-if="filters.category != ''"
            id="subcategory-label"
            disabled
            >Sub-Categories:</b-nav-item
          >
          <b-nav-item-dropdown
            v-if="filters.category != ''"
            id="subcategory-select"
            :text="
              filters.subCategory == ''
                ? 'Select...'
                : filters.subCategory.toString()
            "
          >
            <b-dropdown-item
              v-for="subCategory in subCategories"
              :key="subCategory"
              @click="setSubCategory(subCategory)"
            >
              {{ subCategory }}
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="setSubCategory('')">Reset</b-dropdown-item>
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
        subCategory: "",
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
    subCategories() {
      return new Set(
        this.allProjects
          .filter((proj) => proj.general_area == this.filters.category)
          .map((proj) => proj.specific_area)
      );
    },
    filteredProjects() {
      if (this.filters.category == "") {
        return this.allProjects;
      } else {
        let projectsToRtn;
        projectsToRtn = this.allProjects.filter(
          (project) => project.general_area == this.filters.category
        );
        if (this.filters.subCategory != "") {
          projectsToRtn = projectsToRtn.filter(
            (project) => project.specific_area == this.filters.subCategory
          );
        }
        return projectsToRtn;
      }
    },
  },
  methods: {
    setCategory(category) {
      this.filters.category = category;
      this.filters.subCategory = "";
    },
    setSubCategory(subCategory) {
      this.filters.subCategory = subCategory;
    },
  },
};
</script>

<style scoped>
.project-card {
  margin-bottom: 3px;
}
</style>
