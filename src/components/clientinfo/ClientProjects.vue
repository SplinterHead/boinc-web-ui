<template>
  <b-card title="Projects">
    <div id="no-projects-msg" v-show="projects.length == 0">
      This client is not attached to any projects
    </div>
    <b-table
      v-show="projects.length > 0"
      :fields="fields"
      :items="projects"
      sort-by="project_name"
      :sort-desc="true"
      small
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    >
      <template v-slot:cell(resource_share)="data">
        {{ data.value }}%
      </template>
      <template v-slot:cell(operations)="data">
        <font-awesome-icon
          id="project-suspend"
          icon="fa-solid fa-pause"
          :class="`${disabledIcons.pause ? 'disabledIcon' : 'active'}`"
          v-if="!data.item.suspended_via_gui"
          @click="suspendProject(data.item.master_url)"
        />
        <b-tooltip target="project-suspend" triggers="hover">
          Suspend
        </b-tooltip>
        <font-awesome-icon
          id="project-resume"
          icon="fa-solid fa-play"
          :class="`${disabledIcons.play ? 'disabledIcon' : 'active'}`"
          v-if="data.item.suspended_via_gui"
          @click="resumeProject(data.item.master_url)"
        />
        <b-tooltip target="project-resume" triggers="hover"> Resume </b-tooltip>
        <font-awesome-icon
          id="project-reset"
          icon="fa-solid fa-arrow-rotate-left"
          @click="resetProject(data.item.master_url)"
        />
        <b-tooltip target="project-reset" triggers="hover"> Reset </b-tooltip>
        <font-awesome-icon
          id="project-update"
          icon="fa-solid fa-rotate"
          @click="updateProject(data.item.master_url)"
        />
        <b-tooltip target="project-update" triggers="hover"> Update </b-tooltip>
        <font-awesome-icon
          id="project-detach"
          icon="fa-solid fa-trash-can"
          @click="detachProject(data.item.master_url)"
        />
        <b-tooltip target="project-detach" triggers="hover"> Detach </b-tooltip>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import axios from "axios";

export default {
  name: "ClientProjects",
  props: {
    activeClientId: {
      type: String,
      required: true,
    },
    projects: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      disabledIcons: {
        bin: false,
        play: false,
        pause: false,
        reset: false,
        rotate: false,
      },
      fields: [
        "project_name",
        "resource_share",
        { key: "operations", label: "", class: "project-controls" },
      ],
    };
  },
  methods: {
    callProjectEndpoint(endpointUrl, projectUrl) {
      axios
        .post(
          `${process.env.VUE_APP_API_URL}/${endpointUrl}?client=${this.activeClientId}`,
          { url: projectUrl }
        )
        .catch((msg) => {
          console.log(msg);
        });
    },
    detachProject(projectUrl) {
      this.disabledIcons.bin = true;
      this.callProjectEndpoint("projects/detach", projectUrl);
      this.disabledIcons.bin = false;
    },
    resetProject(projectUrl) {
      this.disabledIcons.reset = true;
      this.callProjectEndpoint("projects/reset", projectUrl);
      this.disabledIcons.reset = false;
    },
    resumeProject(projectUrl) {
      this.disabledIcons.play = true;
      this.callProjectEndpoint("projects/resume", projectUrl);
      this.disabledIcons.play = false;
    },
    suspendProject(projectUrl) {
      this.disabledIcons.pause = true;
      this.callProjectEndpoint("projects/suspend", projectUrl);
      this.disabledIcons.pause = false;
    },
    updateProject(projectUrl) {
      this.disabledIcons.rotate = true;
      this.callProjectEndpoint("projects/update", projectUrl);
      this.disabledIcons.rotate = false;
    },
  },
};
</script>

<style>
.project-controls {
  text-align: right !important;
}

.project-controls svg {
  cursor: pointer;
  margin: 4px;
}

.project-controls .disabledIcon path {
  color: grey;
}
</style>
