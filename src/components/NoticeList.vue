<template>
  <div>
    <h1>Notices</h1>
    <div id="message-div" v-show="Object.keys(notices).length == 0">
      <span id="no-notices"> No notices for this client </span>
    </div>
    <b-table
      v-show="Object.keys(notices).length > 0"
      id="notice-table"
      :fields="fields"
      :items="noticesArr"
      sort-by="create_time"
      :sort-desc="false"
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    >
      <template v-slot:cell(create_time)="data">
        <div class="text-nowrap">{{ convertEpoch(data.value * 1000) }}</div>
      </template>
      <template v-slot:cell(project_name)="data">
        <div class="text-nowrap">{{ data.value }}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "NoticeList",
  data() {
    return {
      fields: [
        { key: "create_time", label: "Time", sortable: true },
        { key: "project_name", label: "Project" },
        { key: "description", label: "Notice" },
      ],
      notices: {},
      timer: "",
    };
  },
  created() {
    this.timer = setInterval(this.getClientNotices, 5000);
  },
  mounted() {
    this.getClientNotices();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    noticesArr() {
      let noticeArr = [];
      Object.keys(this.notices).forEach((key) => {
        noticeArr.push(this.notices[key]);
      });
      return noticeArr;
    },
    ...mapGetters("clients", ["activeClientId"]),
  },
  methods: {
    getClientNotices() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/notices/all?client=${this.activeClientId}`
        )
        .then((response) => {
          this.notices = response.data.notices;
        });
    },
    convertEpoch(epoch) {
      return new Date(epoch).toLocaleString();
    },
  },
  watch: {
    activeClientId() {
      this.getClientNotices();
    },
  },
};
</script>
