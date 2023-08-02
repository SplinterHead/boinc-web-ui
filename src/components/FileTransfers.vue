<template>
  <div>
    <h1>File Transfers</h1>
    <div id="message-div" v-show="fileTransfers.length == 0">
      <span id="no-transfers">No file transfers for this client</span>
    </div>
    <b-table
      id="transfer-table"
      v-show="fileTransfers.length > 0"
      :fields="transferTableFields"
      :items="fileTransfers"
    >
      <template v-slot:cell(icon)="data">
        <div
          id="transfer-download-icon"
          v-show="data.item.persistent_file_xfer.is_upload == 0"
        >
          <TrayArrowDownIcon />
        </div>
        <div
          id="transfer-upload-icon"
          v-show="data.item.persistent_file_xfer.is_upload == 1"
        >
          <TrayArrowUpIcon />
        </div>
      </template>
      <template v-slot:cell(nbytes)="data">
        {{ convertBytes(data.value) }}
      </template>
      <template v-slot:cell(progress)="data">
        <b-progress
          :value="
            (data.item.persistent_file_xfer.last_bytes_xferred /
              data.item.nbytes) *
            100
          "
          precision="2"
          max="100"
          show-progress
        />
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { convertBytes } from "@/utils/converters.js";

import TrayArrowDownIcon from "vue-material-design-icons/TrayArrowDown.vue";
import TrayArrowUpIcon from "vue-material-design-icons/TrayArrowUp.vue";

export default {
  name: "FileTransfers",
  components: {
    TrayArrowDownIcon,
    TrayArrowUpIcon,
  },
  data() {
    return {
      fileTransfers: [],
      transferTableFields: [
        { key: "icon", label: "" },
        { key: "name", label: "Filename" },
        "project_name",
        { key: "nbytes", label: "Size" },
        { key: "progress", label: "Progress" },
      ],
    };
  },
  mounted() {
    this.getFileTransfers();
  },
  computed: {
    ...mapGetters("clients", ["activeClientId"]),
  },
  methods: {
    getFileTransfers() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/transfers/all?client=${this.activeClientId}`
        )
        .then((response) => {
          this.fileTransfers = response.data.file_transfers;
        });
    },
    convertBytes(bytes) {
      return convertBytes(bytes);
    },
  },
  watch: {
    activeClientId() {
      this.getFileTransfers();
    },
  },
};
</script>
