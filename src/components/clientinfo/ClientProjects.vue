<template>
  <b-card title="Projects">
    <div id="no-projects-msg" v-show="activeClientState.projects.length == 0">
      This client is not attached to any projects
    </div>
  </b-card>
</template>

<script>
export default {
  name: "ClientProjects",
  props: {
    activeClient: {
      type: Object,
      required: true,
    },
    activeClientState: {
      type: Object,
      required: true,
    },
  },
};
</script>
