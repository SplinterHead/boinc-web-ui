<template>
  <div>
    <h1>Task List</h1>
    <div id="message-div" v-show="tasks.length == 0">
      <span id="no-client" v-show="!activeClientId">
        Please select a client to see it's tasks
      </span>
      <span id="no-tasks" v-show="activeClientId">
        This client has no work to do
        <br />
        Check it is attached to projects and that they aren't paused
      </span>
    </div>
    <b-table
      id="task-table"
      v-show="activeClientId && tasks.length > 0"
      small
      :fields="fields"
      :items="tasks"
      sort-by="active_task.fraction_done"
      :sort-desc="true"
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    >
      <template v-slot:cell(project)="data">
        {{
          data.item.project_url
            ? getProjectName(data.item.project_url).project_name
            : "Unknown Project"
        }}
      </template>
      <template v-slot:cell(progress)="data">
        <b-progress
          v-if="data.item.active_task"
          :value="data.item.active_task.fraction_done * 100"
          precision="2"
          max="100"
          show-progress
          :animated="data.item.active_task.active_task_state != 9"
          :variant="
            decodeActiveState(data.item.active_task.active_task_state).variant
          "
        />
        <span v-if="!data.item.active_task">
          {{ decodeTaskState(data.item.state).state }}
        </span>
      </template>
      <template v-slot:cell(remaining_time)="data">
        {{
          data.item.active_task
            ? secondsToHms(data.item.estimated_cpu_time_remaining)
            : ""
        }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ClientResults",
  data() {
    return {
      fields: [
        { key: "name", sortable: true },
        { key: "project", sortable: true },
        "progress",
        "remaining_time",
      ],
      projects: [],
      tasks: [],
    };
  },
  created() {
    this.timer = setInterval(this.getClientTasks, 5000);
  },
  mounted() {
    this.getClientTasks();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters("clients", ["activeClientId"]),
  },
  methods: {
    getClientTasks() {
      if (this.activeClientId) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClientId}`
          )
          .then((response) => {
            this.projects = response.data.projects;
            this.tasks = response.data.results;
          });
      }
    },
    getProjectName(projectUrl) {
      return this.projects.find((project) => project.master_url == projectUrl);
    },
    decodeTaskState(state) {
      // NEW = 0  # New result
      // FILES_DOWNLOADING = (
      //     1  # Input files for result (WU, app version) are being downloaded
      // )
      // FILES_DOWNLOADED = 2  # Files are downloaded, result can be (or is being) computed
      // COMPUTE_ERROR = 3  # computation failed; no file upload
      // FILES_UPLOADING = 4  # Output files for result are being uploaded
      // FILES_UPLOADED = 5  # Files are uploaded, notify scheduling server at some point
      // ABORTED = 6  # result was aborted
      // UPLOAD_FAILED = 7  # some output file permanent failure
      switch (state) {
        case 0:
          return { state: "Assigned" };
        case 1:
          return { state: "Downloading..." };
        case 2:
          return { state: "Queued" };
        case 3:
          return { state: "Execution Error" };
        case 4:
          return { state: "Uploading..." };
        case 5:
          return { state: "Complete" };
        case 6:
          return { state: "Aborted" };
        case 7:
          return { state: "Failed Upload" };
        default:
          return { state: "Unknown" };
      }
    },
    decodeActiveState(state) {
      // UNINITIALIZED = 0  # process doesn't exist yet
      // EXECUTING = 1  # process is running, as far as we know
      // ABORT_PENDING = 5  # process exceeded limits; send "abort" message, waiting to exit
      // QUIT_PENDING = 8  # we've sent it a "quit" message, waiting to exit
      // SUSPENDED = 9  # we've sent it a "suspend" message
      // COPY_PENDING = 10  # waiting for async file copies to finish
      switch (state) {
        case 0:
          return { state: "Initialising", variant: "light" };
        case 1:
          return { state: "Running", variant: "primary" };
        case 5:
          return { state: "Aborting", variant: "warning" };
        case 8:
          return { state: "Quitting", variant: "danger" };
        case 9:
          return { state: "Suspended", variant: "secondary" };
        case 10:
          return { state: "Copying", variant: "success" };
      }
    },
    secondsToHms(seconds) {
      let sec = Number(seconds);
      let h = String(Math.floor(sec / 3600)).padStart(2, "0");
      let m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      let s = String(Math.floor((sec % 3600) % 60)).padStart(2, "0");
      return `${h}:${m}:${s}`;
    },
  },
  watch: {
    activeClientId() {
      this.getClientTasks();
    },
  },
};
</script>
