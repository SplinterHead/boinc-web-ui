<template>
  <b-card title="Disk Stats">
    <b-table id="overall-stats" :fields="tableFields" :items="[diskStats]" />
    <div
      id="message-div"
      v-show="diskStats.projects && diskStats.projects.length == 0"
    >
      Client not attached to any projects
    </div>
    <div id="chart-container">
      <Doughnut :data="diskGraphData" :options="diskGraphOptions" />
    </div>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Legend, Tooltip);

export default {
  name: "DiskInfo",
  components: {
    Doughnut,
  },
  data() {
    return {
      diskStats: {
        projects: [],
      },
      tableFields: [
        { key: "d_total", label: "Disk Size" },
        { key: "d_free", label: "Free Space" },
        { key: "d_boinc", label: "Used by BOINC" },
      ],
      diskGraphOptions: {
        plugins: {
          legend: {
            position: "left",
          },
        },
        responsive: true,
      },
    };
  },
  mounted() {
    this.getDiskInfo();
  },
  methods: {
    getDiskInfo() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/client/diskstats?client=${this.activeClientId}`
        )
        .then((response) => {
          this.diskStats = response.data.disk_stats;
        });
    },
  },
  computed: {
    diskGraphData() {
      return {
        labels: this.graphLabels,
        datasets: [
          {
            data: this.graphDataSet,
            backgroundColor: [
              "rgb(55, 162, 235)",
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 159, 64)",
              "rgb(153, 102, 255)",
              "rgb(255, 205, 86)",
            ],
          },
        ],
      };
    },
    graphLabels() {
      return this.diskStats.projects.map((project) => project.master_url);
    },
    graphDataSet() {
      return this.diskStats.projects.map((project) => project.disk_usage);
    },
    ...mapGetters("clients", ["activeClientId"]),
  },
  watch: {
    activeClientId() {
      this.getDiskInfo();
    },
  },
};
</script>

<style scoped>
canvas {
  max-height: 240px;
}
</style>
