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
          <span class="platform-icon">
            <AppleIcon
              title="Works on Apple clients"
              id="platform-apple"
              :class="
                translatedPlatforms.includes('apple') ? 'enabled' : 'disabled'
              "
            />
            <LinuxIcon
              title="Works on Linux clients"
              id="platform-linux"
              :class="
                translatedPlatforms.includes('linux') ? 'enabled' : 'disabled'
              "
            />
            <MicrosoftWindowsIcon
              title="Works on Windows clients"
              id="platform-windows"
              :class="
                translatedPlatforms.includes('windows') ? 'enabled' : 'disabled'
              "
            />
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

import AppleIcon from "vue-material-design-icons/Apple.vue";
import LinuxIcon from "vue-material-design-icons/Linux.vue";
import MicrosoftWindowsIcon from "vue-material-design-icons/MicrosoftWindows.vue";

import ProjectAuthModal from "@/components/project/ProjectAuthModal.vue";

export default {
  name: "ProjectCard",
  components: {
    ProjectAuthModal,
    AppleIcon,
    LinuxIcon,
    MicrosoftWindowsIcon,
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
.platform-icon svg {
  padding-left: 5px;
}

.disabled svg {
  fill: lightgrey !important;
}

.project-actions {
  text-align: center;
  vertical-align: middle;
  margin: auto;
}
</style>
