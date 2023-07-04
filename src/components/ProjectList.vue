<template>
  <div>
    <h1>Projects</h1>
    <div v-show="activeClientId">
      <div v-show="allProjects.length == 0">No Projects found</div>
      <div v-show="allProjects.length > 0" id="projects">
        <b-navbar id="filter-bar" toggleable="lg" variant="light">
          <b-navbar-nav>
            <b-nav-text id="category-label">Categories:</b-nav-text>
            <b-nav-item-dropdown
              id="category-select"
              :text="
                filters.category == ''
                  ? 'Select...'
                  : filters.category.toString()
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
            <b-nav-text
              v-show="filters.category.toString() != ''"
              id="subcategory-label"
              >Sub-Categories:</b-nav-text
            >
            <b-nav-item-dropdown
              v-show="filters.category.toString() != ''"
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
              <b-dropdown-item @click="setSubCategory('')"
                >Reset</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input
                id="text-filter"
                placeholder="Search"
                v-model="filters.searchString"
              ></b-form-input>
            </b-nav-form>
            <b-nav-form id="platform-select">
              <b-form-checkbox
                v-model="filters.platform"
                id="platform-toggle"
                :value="true"
              >
                Only Compatible
              </b-form-checkbox>
            </b-nav-form>
          </b-navbar-nav>
        </b-navbar>
        <div id="project-list">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :clientId="activeClientId"
            :project="project"
            class="project-card"
          />
        </div>
      </div>
    </div>
    <div v-show="!activeClientId">Please choose a client</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import ProjectCard from "@/components/project/ProjectCard.vue";

export default {
  name: "ProjectList",
  components: {
    ProjectCard,
  },
  data() {
    return {
      allProjects: [],
      filters: {
        category: "",
        subCategory: "",
        searchString: "",
        platform: false,
      },
      timer: "",
      unsubscribe: "",
    };
  },
  created() {
    this.timer = setInterval(this.getClientProjects, 5000);
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === "clients/setActiveClientId") {
        this.getClientProjects();
      }
    });
  },
  mounted() {
    this.getClientProjects();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.unsubscribe();
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
      let projectsToRtn = this.allProjects;

      if (this.filters.searchString != "") {
        let searchQuery = this.filters.searchString.toLowerCase();
        projectsToRtn = projectsToRtn.filter(
          (project) =>
            project.name.toLowerCase().includes(searchQuery) ||
            project.description.toLowerCase().includes(searchQuery)
        );
      }
      if (this.filters.category != "") {
        projectsToRtn = projectsToRtn.filter(
          (project) => project.general_area == this.filters.category
        );
        if (this.filters.subCategory != "") {
          projectsToRtn = projectsToRtn.filter(
            (project) => project.specific_area == this.filters.subCategory
          );
        }
      }
      if (this.filters.platform) {
        projectsToRtn = projectsToRtn.filter((project) =>
          project.platforms
            .map((platform) => platform.name)
            .includes(this.activeClient.platform)
        );
      }
      return projectsToRtn;
    },
    ...mapGetters("clients", ["activeClient", "activeClientId"]),
  },
  methods: {
    getClientProjects() {
      if (this.activeClientId) {
        console.log("Getting client projects");
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/projects/all?client=${this.activeClientId}`
          )
          .then((response) => {
            this.allProjects = response.data.projects;
          });
      }
    },
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

<style>
.nav-bar,
nav li {
  list-style-type: none;
  padding-left: 5px;
  padding-right: 5px;
}

#filter-bar {
  justify-content: space-between;
}
.project-card {
  margin-bottom: 3px;
}
</style>
