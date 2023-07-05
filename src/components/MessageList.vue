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
      timer: "",
    };
  },
  created() {
    this.timer = setInterval(this.getClientMessages, 5000);
  },
  mounted() {
    this.getClientMessages();
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
  methods: {
    getClientMessages() {
      if (this.activeClientId) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/messages/all?client=${this.activeClientId}`
          )
          .then((response) => {
            this.messages = response.data.messages;
          });
      }
    },
    convertEpoch(epoch) {
      return new Date(epoch).toLocaleString();
    },
  },
  watch: {
    activeClientId() {
      this.getClientMessages();
    },
  },
};
</script>
