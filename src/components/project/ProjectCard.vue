<template>
  <b-card :title="project.name" :sub-title="project.description">
    <div id="project-platforms" v-show="translatedPlatforms.size > 0">
      Platforms:
      <span
        v-for="platform in translatedPlatforms"
        :key="platform"
        :id="'platform-' + platform"
      >
        {{ platform }}
      </span>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "ProjectCard",
  props: {
    project: {
      type: Object,
      required: true,
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
      return new Set(platformArr);
    },
  },
};
</script>
