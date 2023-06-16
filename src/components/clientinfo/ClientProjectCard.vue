<template>
  <b-card :title="project.project_name" />
</template>

<script>
export default {
  name: "ClientProjectCard",
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
};
</script>
