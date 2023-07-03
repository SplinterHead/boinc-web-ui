<template>
  <div>
    <h1>Messages</h1>
    <div id="message-div" v-show="Object.keys(messages).length == 0">
      No messages for this client
    </div>
    <b-table
      id="message-table"
      v-show="Object.keys(messages).length > 0"
      :fields="fields"
      :items="messagesArr"
      small
      sort-by="time"
      :sort-desc="false"
      sort-icon-left
      label-sort-asc=""
      label-sort-desc=""
      label-sort-clear=""
    >
      <template v-slot:cell(time)="data">
        <div class="text-nowrap">{{ convertEpoch(data.value * 1000) }}</div>
      </template>
      <template v-slot:cell(project)="data">
        <div class="text-nowrap">{{ data.value }}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "MessageList",
  data() {
    return {
      fields: [
        { key: "time", sortable: true },
        "project",
        { key: "body", title: "" },
      ],
      messages: {},
    };
  },
  methods: {
    convertEpoch(epoch) {
      return new Date(epoch).toLocaleString();
    },
  },
  computed: {
    messagesArr() {
      let messageArr = [];
      Object.keys(this.messages).forEach((key) => {
        messageArr.push(this.messages[key]);
      });
      return messageArr;
    },
    ...mapGetters("clients", ["activeClientId"]),
  },
  mounted() {
    axios
      .get(
        `${process.env.VUE_APP_API_URL}/messages/all?client=${this.activeClientId}`
      )
      .then((response) => {
        this.messages = response.data.messages;
      });
  },
};
</script>
