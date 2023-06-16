<template>
  <b-card title="Projects">
    <div id="no-projects-msg" v-show="activeClientState.projects.length == 0">
      This client is not attached to any projects
    </div>
    <div id="projects" v-show="activeClientState.projects.length > 0">
      <ClientProjectCard
        v-for="project in activeClientState.projects"
        :key="project.name"
        :project="{ project: project }"
      />
    </div>
  </b-card>
</template>

<script>
import ClientProjectCard from "@/components/clientinfo/ClientProjectCard.vue";

export default {
  name: "ClientProjects",
  components: {
    ClientProjectCard,
  },
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
