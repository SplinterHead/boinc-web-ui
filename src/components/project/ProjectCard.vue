<template>
  <b-card>
    <b-row>
      <b-col md="11">
        <h4 class="card-title">{{ project.name }}</h4>
        <b-card-text class="card-description">{{
          project.description
        }}</b-card-text>
      </b-col>
      <b-col md="1" class="project-actions">
        <div id="project-platforms" v-show="translatedPlatforms.length > 0">
          <span
            v-for="platform in translatedPlatforms"
            :key="platform"
            :id="'platform-' + platform"
            class="platform-icon"
          >
            <font-awesome-icon :icon="'fa-brands fa-' + platform" />
          </span>
        </div>
        <b-button
          variant="primary"
          size="sm"
          v-b-modal:[`project-${project.name}`]
          >Add</b-button
        >
        <ProjectAuthModal
          :project="project"
          @project-auth="handleProjectAuth"
        />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import axios from "axios";

import ProjectAuthModal from "@/components/project/ProjectAuthModal.vue";

export default {
  name: "ProjectCard",
  components: {
    ProjectAuthModal,
  },
  props: {
    clientId: {
      type: String,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleProjectAuth(auth) {
      axios.post(
        `${process.env.VUE_APP_API_URL}/projects/attach?client=${this.clientId}`,
        {
          name: this.project.name,
          url: this.project.web_url,
          key: auth,
        }
      );
    },
  },
  computed: {
    translatedPlatforms() {
      let platformArr = [];
      this.project.platforms.forEach((platform) => {
        if (platform.name.includes("windows")) {
          platformArr.push("windows");
        } else if (platform.name.includes("linux")) {
          platformArr.push("linux");
        } else if (platform.name.includes("darwin")) {
          platformArr.push("apple");
        }
      });
      const translatedSet = new Set(platformArr);
      return [...translatedSet].sort();
    },
  },
};
</script>

<style scoped>
.platform-icon {
  padding-left: 5px;
}

.project-actions {
  text-align: center;
  vertical-align: middle;
  margin: auto;
}
</style>
