<template>
  <b-card title="Network Stats">
    <div id="message-div" v-show="!Object.keys(networkStats).length">
      No network stats found
    </div>
    <div id="chart-container" v-show="Object.keys(networkStats).length">
      <LineChart :data="networkGraphData" :options="networkGraphOptions" />
    </div>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line as LineChart } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

export default {
  name: "NetworkStats",
  components: {
    LineChart,
  },
  data() {
    return {
      networkStats: {},
      networkGraphOptions: {
        animation: false,
      },
    };
  },
  mounted() {
    this.getNetworkStats();
  },
  methods: {
    getNetworkStats() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/client/networkstats?client=${this.activeClientId}`
        )
        .then((response) => {
          this.networkStats = response.data.network_transfers;
        });
    },
  },
  computed: {
    networkGraphData() {
      return {
        labels: this.graphXAxisLabels,
        datasets: [
          {
            label: "Download",
            data: this.graphDownloadStats,
            backgroundColor: "rgb(55, 162, 235)",
            borderColor: "rgb(55, 162, 235)",
            tension: 0.1,
          },
          {
            label: "Upload",
            data: this.graphUploadStats,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      };
    },
    graphXAxisLabels() {
      let labels = [];
      Object.keys(this.networkStats).forEach((key) => {
        labels.push(key);
      });
      return labels;
    },
    graphDownloadStats() {
      let dlStats = [];
      Object.keys(this.networkStats).forEach((key) => {
        dlStats.push(this.networkStats[key].down);
      });
      return dlStats;
    },
    graphUploadStats() {
      let upStats = [];
      Object.keys(this.networkStats).forEach((key) => {
        upStats.push(this.networkStats[key].up);
      });
      return upStats;
    },
    ...mapGetters("clients", ["activeClientId"]),
  },
  watch: {
    activeClientId() {
      this.getNetworkStats();
    },
  },
};
</script>

<style scoped>
canvas {
  max-height: 240px;
}
</style>
