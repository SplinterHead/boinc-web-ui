<template>
  <div>
    <h1>Projects</h1>
    <b-navbar id="new-project-bar" toggleable="lg" variant="light">
      <b-navbar-nav>
        <router-link to="/addproject" tag="b-button">Add Project</router-link>
      </b-navbar-nav>
    </b-navbar>
    <div id="message-div" v-show="projects.length == 0">
      <div id="no-client" v-show="!activeClientId">
        Please select a client to see it's projects
      </div>
      <div id="no-projects" v-show="activeClientId">
        This client is not attached to any projects
        <br />
        Please add some so it's not twiddling it's thumbs
      </div>
    </div>
    <b-table
      small
      id="project-table"
      v-show="projects.length > 0"
      :fields="fields"
      :items="projects"
      sort-by="project_name"
    >
      <template v-slot:cell(resource_share)="data">
        {{ data.value }}%
      </template>
      <template v-slot:cell(user_total_credit)="data">
        {{ data.value.toFixed(2) }}
      </template>
      <template v-slot:cell(operations)="data">
        <font-awesome-icon
          id="project-suspend"
          icon="fa-solid fa-pause"
          :class="`${disabledIcons.pause ? 'disabledIcon' : 'active'}`"
          v-if="!data.item.suspended_via_gui"
          @click="suspendProject(data.item.master_url)"
        />
        <b-tooltip
          target="project-suspend"
          triggers="hover"
          placement="topright"
        >
          Suspend
        </b-tooltip>
        <font-awesome-icon
          id="project-resume"
          icon="fa-solid fa-play"
          :class="`${disabledIcons.play ? 'disabledIcon' : 'active'}`"
          v-if="data.item.suspended_via_gui"
          @click="resumeProject(data.item.master_url)"
        />
        <b-tooltip
          target="project-resume"
          v-if="data.item.suspended_via_gui"
          triggers="hover"
          placement="topright"
        >
          Resume
        </b-tooltip>
        <font-awesome-icon
          id="project-reset"
          icon="fa-solid fa-arrow-rotate-left"
          @click="resetProject(data.item.master_url)"
        />
        <b-tooltip target="project-reset" triggers="hover" placement="topright">
          Reset
        </b-tooltip>
        <font-awesome-icon
          id="project-update"
          icon="fa-solid fa-rotate"
          @click="updateProject(data.item.master_url)"
        />
        <b-tooltip
          target="project-update"
          triggers="hover"
          placement="topright "
        >
          Update
        </b-tooltip>
        <font-awesome-icon
          id="project-detach"
          icon="fa-solid fa-trash-can"
          @click="detachProject(data.item.master_url)"
        />
        <b-tooltip
          target="project-detach"
          triggers="hover"
          placement="topright"
        >
          Detach
        </b-tooltip>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ClientProjects",
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
        "user_name",
        "team_name",
        "resource_share",
        { key: "user_total_credit", label: "User Credit" },
        { key: "operations", label: "", class: "project-controls" },
      ],
      projects: [],
      timer: "",
    };
  },
  created() {
    this.timer = setInterval(this.getAttachedProjects, 5000);
  },
  mounted() {
    this.getAttachedProjects();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters("clients", ["activeClientId"]),
  },
  methods: {
    getAttachedProjects() {
      if (this.activeClientId) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/projects/attached?client=${this.activeClientId}`
          )
          .then((response) => (this.projects = response.data.project_status))
          .catch((msg) => {
            console.log(msg);
          });
      }
    },
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
  watch: {
    activeClientId() {
      this.getAttachedProjects();
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
>
