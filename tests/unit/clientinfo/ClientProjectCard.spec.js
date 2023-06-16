import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ClientProjectCard from "@/components/clientinfo/ClientProjectCard.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

const testProject = {
  master_url: "http://www.worldcommunitygrid.org/",
  project_name: "World Community Grid",
  symstore: "",
  user_name: "user_name",
  team_name: "",
  host_venue: "",
  email_hash: "35cfa58b4e0b46de6a651ce508082d61",
  cross_project_id: "037befc40287d29bb9590d8e0edd8198",
  external_cpid: "192792945b257453b6da6c7cad1c1381",
  cpid_time: 1665410370.0,
  user_total_credit: 341094.533876,
  user_expavg_credit: 2900.946548,
  user_create_time: 1665410370.0,
  rpc_seqno: 655,
  userid: 1156486,
  teamid: 0,
  hostid: 8667640,
  host_total_credit: 339691.861332,
  host_expavg_credit: 2900.71544,
  host_create_time: 1665650589.0,
  nrpc_failures: 0,
  master_fetch_failures: 0,
  min_rpc_time: 1677187523.062822,
  next_rpc_time: 1677446601.862822,
  rec: 4267.417546,
  rec_time: 1677189666.165,
  resource_share: 100.0,
  disk_usage: 1410613248.0,
  disk_share: 410497975500.800049,
  desired_disk_usage: 0.0,
  duration_correction_factor: 1.0,
  sched_rpc_pending: 0,
  send_time_stats_log: 0,
  send_job_log: 0,
  njobs_success: 3872,
  njobs_error: 86,
  elapsed_time: 43580057.333979,
  last_rpc_time: 1677187401.862822,
  dont_use_dcf: false,
  master_url_fetch_pending: false,
  scheduler_rpc_in_progress: false,
  rsc_backoff_time: { name: "CPU", value: 0.0 },
  rsc_backoff_interval: { name: "CPU", value: 0.0 },
  gui_urls: [
    {
      name: "Research Overview",
      description: "Learn about the projects hosted at World Community Grid",
      url: "https://www.worldcommunitygrid.org/research/viewAllProjects.do",
    },
  ],
  sched_priority: -1.041667,
  project_files_downloaded_time: 0.0,
  project_dir: "/var/lib/boinc/projects/www.worldcommunitygrid.org",
  suspended_via_gui: false,
};

// install plugins as normal
localVue.use(BootstrapVue);

let wrapper;

function createWrapper(propsData) {
  wrapper = shallowMount(ClientProjectCard, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientProjectCard.vue", () => {
  it("renders the project title", () => {
    createWrapper({ project: testProject });

    expect(wrapper.attributes("title")).toBe("World Community Grid");
  });
});
