<template>
  <div>
    <h1>Projects</h1>
    <b-navbar id="new-project-bar" toggleable="lg" variant="light">
      <b-navbar-nav>
        <router-link id="new-project" to="/addproject" tag="b-button">
          Add Project
        </router-link>
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
      v-show="statefulProjects.length > 0"
      :fields="fields"
      :items="statefulProjects"
      sort-by="project_name"
    >
      <template v-slot:cell(expand)="data">
        <div id="project-expand">
          <ChevronRightIcon
            title="More details"
            v-show="!data.item._showDetails"
            @click="toggleExpandedRow(data.item.cross_project_id)"
          />
          <ChevronDownIcon
            title="Less details"
            v-show="data.item._showDetails"
            @click="toggleExpandedRow(data.item.cross_project_id)"
          />
        </div>
      </template>
      <template #row-details="row">
        <b-row class="mb-2">
          <b-col cols="2" class="text-end">Links:</b-col>
          <b-col v-for="link in row.item.gui_urls" :key="link.name">
            <a :href="link.url" target="_blank">{{ link.name }}</a>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2" class="text-end">Project member since:</b-col>
          <b-col>{{ convertEpoch(row.item.user_create_time) }}</b-col>
        </b-row>
        <b-row>
          <b-col cols="2" class="text-end">Client active since:</b-col>
          <b-col>{{ convertEpoch(row.item.host_create_time) }}</b-col>
        </b-row>
      </template>
      <template v-slot:cell(resource_share)="data">
        {{ data.value }}%
      </template>
      <template v-slot:cell(user_total_credit)="data">
        {{ data.value.toFixed(2) }}
      </template>
      <template v-slot:cell(operations)="data">
        <PauseIcon
          title="Suspend"
          v-if="!data.item.suspended_via_gui"
          @click="suspendProject(data.item.master_url)"
        />
        <PlayIcon
          title="Resume"
          v-if="data.item.suspended_via_gui"
          @click="resumeProject(data.item.master_url)"
        />
        <AutorenewIcon
          title="Reset"
          @click="resetProject(data.item.master_url)"
        />
        <RefreshIcon
          title="Update"
          @click="updateProject(data.item.master_url)"
        />
        <TrashCanOutlineIcon
          title="Detach"
          @click="detachProject(data.item.master_url)"
        />
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import ChevronDownIcon from "vue-material-design-icons/ChevronDown.vue";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight.vue";

import AutorenewIcon from "vue-material-design-icons/Autorenew.vue";
import PauseIcon from "vue-material-design-icons/Pause.vue";
import PlayIcon from "vue-material-design-icons/Play.vue";
import RefreshIcon from "vue-material-design-icons/Refresh.vue";
import TrashCanOutlineIcon from "vue-material-design-icons/TrashCanOutline.vue";

export default {
  name: "ClientProjects",
  components: {
    ChevronDownIcon,
    ChevronRightIcon,
    AutorenewIcon,
    PauseIcon,
    PlayIcon,
    RefreshIcon,
    TrashCanOutlineIcon,
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
      expandedRows: [],
      fields: [
        { key: "expand", label: "" },
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
    statefulProjects() {
      return this.projects.map((project) => ({
        ...project,
        _showDetails: this.expandedRows.includes(project.cross_project_id),
      }));
    },
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
    toggleExpandedRow(rowId) {
      if (this.expandedRows.includes(rowId)) {
        this.expandedRows.pop(rowId);
      } else {
        this.expandedRows.push(rowId);
      }
    },
    convertEpoch(epoch) {
      return new Date(epoch * 1000).toLocaleDateString();
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
