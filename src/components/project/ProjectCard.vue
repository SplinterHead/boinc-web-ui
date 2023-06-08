<template>
  <b-card :title="project.name" :sub-title="project.description">
    <div id="project-platforms" v-show="translatedPlatforms.length > 0">
      Platforms:
      <span
        v-for="platform in translatedPlatforms"
        :key="platform"
        :id="'platform-' + platform"
        class="platform-icon"
      >
        <font-awesome-icon :icon="'fa-brands fa-' + platform" />
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
</style>
