<template>
  <b-card title="Projects">
    <div id="no-projects-msg" v-if="activeClientState.projects.length == 0">
      This client is not attached to any projects
    </div>
    <b-table
      v-else
      :fields="fields"
      :items="activeClientState.projects"
      small
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    >
      <template v-slot:cell(operations)="data">
        <font-awesome-icon
          icon="fa-solid fa-pause"
          v-if="!data.item.suspended_via_gui"
          @click="suspendProject(data.item.master_url)"
        />
        <font-awesome-icon
          icon="fa-solid fa-play"
          v-if="data.item.suspended_via_gui"
          @click="resumeProject(data.item.master_url)"
        />
      </template>
    </b-table>
  </b-card>
</template>

<script>
import axios from "axios";

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
  data() {
    return {
      fields: [
        { key: "project_name", sortable: true },
        { key: "operations", label: "", class: "project-controls" },
      ],
    };
  },
  methods: {
    resumeProject(projectUrl) {
      axios.post(
        `${process.env.VUE_APP_API_URL}/projects/resume?client=${this.activeClient.id}`,
        { url: projectUrl }
      );
    },
    suspendProject(projectUrl) {
      axios.post(
        `${process.env.VUE_APP_API_URL}/projects/suspend?client=${this.activeClient.id}`,
        { url: projectUrl }
      );
    },
  },
};
</script>

<style>
.project-controls {
  text-align: right !important;
}
</style>
