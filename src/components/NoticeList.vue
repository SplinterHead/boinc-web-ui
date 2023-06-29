<template>
  <div>
    <h1>Notices</h1>
    <div id="message-div" v-show="Object.keys(notices).length == 0">
      No notices for this client
    </div>
    <b-table
      v-show="Object.keys(notices).length > 0"
      id="notice-table"
      :fields="fields"
      :items="noticesArr"
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
import axios from "axios";

export default {
  name: "NoticeList",
  props: {
    activeClient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        { key: "create_time", label: "Time" },
        { key: "project_name", label: "Project" },
        { key: "description", label: "Notice" },
      ],
      notices: {},
    };
  },
  methods: {
    convertEpoch(epoch) {
      return new Date(epoch).toLocaleString();
    },
  },
  computed: {
    noticesArr() {
      let noticeArr = [];
      Object.keys(this.notices).forEach((key) => {
        noticeArr.push(this.notices[key]);
      });
      return noticeArr;
    },
  },
  mounted() {
    axios
      .get(
        `${process.env.VUE_APP_API_URL}/notices/all?client=${this.activeClient.id}`
      )
      .then((response) => {
        this.notices = response.data.notices;
      });
  },
};
</script>
