<template>
  <b-card title="Projects">
    <div id="no-projects-msg" v-show="activeClientState.projects.length == 0">
      This client is not attached to any projects
    </div>
    <b-table
      v-show="activeClientState.projects.length > 0"
      :fields="fields"
      :items="activeClientState.projects"
      small
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    />
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
  data() {
    return {
      fields: [{ key: "project_name", sortable: true }],
    };
  },
};
</script>
