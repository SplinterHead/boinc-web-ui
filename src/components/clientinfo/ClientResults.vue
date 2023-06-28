<template>
  <b-card title="Tasks">
    <div id="no-projects-msg" v-if="results.length == 0">
      This client has no work to do
      <p />
      Check it is attached to projects and that they aren't paused
    </div>
    <b-table
      v-else
      :fields="fields"
      :items="results"
      sort-by="active_task.fraction_done"
      :sort-desc="true"
      small
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
        <span v-else>{{ decodeTaskState(data.item.state).state }}</span>
      </template>
    </b-table>
  </b-card>
</template>

<script>
export default {
  name: "ClientResults",
  props: {
    projects: {
      type: Array,
      required: false,
      default: () => [],
    },
    results: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      fields: [
        { key: "name", sortable: true },
        { key: "project", sortable: true },
        "progress",
      ],
    };
  },
  methods: {
    getProjectName(projectUrl) {
      return this.projects.find((project) => project.master_url == projectUrl);
      // return projectUrl;
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
  },
};
</script>
