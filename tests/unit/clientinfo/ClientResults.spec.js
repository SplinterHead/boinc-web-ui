import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ClientResults from "@/components/clientinfo/ClientResults.vue";

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

const resultTable = () => wrapper.get("table");
const resultTableRows = () => wrapper.get("tbody").findAll("tr");
const firstRow = () => resultTableRows().at(0);
const secondRow = () => resultTableRows().at(1);
const firstRowProjectName = () => firstRow().findAll("td").at(1);
const firstRowProgressBar = () => firstRow().findAll("td").at(2);

function createWrapper(propsData) {
  wrapper = shallowMount(ClientResults, {
    localVue,
    propsData: propsData,
  });
}

function createFullWrapper(propsData) {
  wrapper = mount(ClientResults, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientResults.vue", () => {
  it("renders the card title", () => {
    createWrapper({ projects: [testProject] });

    expect(wrapper.attributes("title")).toBe("Tasks");
  });

  describe("renders the work units", () => {
    it("each work unit is displayed in a table", () => {
      const testResults = [
        { name: "test_work_unit_name", state: 0 },
        { name: "test_work_unit_name_2", state: 0 },
      ];
      createFullWrapper({ projects: [testProject], results: testResults });

      expect(resultTable().exists()).toBe(true);
      expect(resultTableRows().length).toBe(2);

      expect(firstRow().findAll("td").at(0).text()).toBe("test_work_unit_name");
      expect(secondRow().findAll("td").at(0).text()).toBe(
        "test_work_unit_name_2"
      );
    });

    it("displays the project name for the task", () => {
      const testResults = [
        {
          name: "test_work_unit_name",
          state: 0,
          project_url: "http://www.worldcommunitygrid.org/",
        },
      ];
      createFullWrapper({ projects: [testProject], results: testResults });

      expect(firstRowProjectName().text()).toBe(testProject.project_name);
    });

    test.each([
      { stateInt: 0, stateStr: "Assigned" },
      { stateInt: 1, stateStr: "Downloading..." },
      { stateInt: 2, stateStr: "Queued" },
      { stateInt: 3, stateStr: "Execution Error" },
      { stateInt: 4, stateStr: "Uploading..." },
      { stateInt: 5, stateStr: "Complete" },
      { stateInt: 6, stateStr: "Aborted" },
      { stateInt: 7, stateStr: "Failed Upload" },
      { stateInt: 8, stateStr: "Unknown" },
    ])(
      'displays "$stateStr" message when task state is $stateInt',
      ({ stateInt, stateStr }) => {
        const testResult = [{ name: "test_work_unit_name", state: stateInt }];
        createFullWrapper({ projects: [testProject], results: testResult });

        expect(firstRowProgressBar().text()).toBe(stateStr);
      }
    );

    it("displays active tasks with a progress bar", () => {
      const testResults = [
        { name: "test_work_unit_name", state: 2 },
        {
          name: "test_work_unit_name_2",
          state: 2,
          active_task: { active_task_state: 0 },
        },
      ];
      createFullWrapper({ projects: [testProject], results: testResults });

      expect(firstRowProgressBar().text()).toBe("Queued");
      expect(
        secondRow()
          .findAll("td")
          .at(2)
          .get("div[role='progressbar']")
          .isVisible()
      ).toBe(true);
    });

    test.each([
      { stateInt: 0, variantName: "light" }, // Initilising
      { stateInt: 1, variantName: "primary" }, // Running
      { stateInt: 5, variantName: "warning" }, // Aborting
      { stateInt: 8, variantName: "danger" }, // Quittung
      { stateInt: 9, variantName: "secondary" }, // Suspended
      { stateInt: 10, variantName: "success" }, // Copying
    ])(
      "displays $variantName progress bar when active task state is $stateInt",
      ({ stateInt, variantName }) => {
        const testResult = [
          {
            name: "test_work_unit_name",
            state: 2,
            active_task: { active_task_state: stateInt },
          },
        ];
        createFullWrapper({ projects: [testProject], results: testResult });

        expect(
          firstRow().get("div[role='progressbar']").attributes("class")
        ).toContain(`bg-${variantName}`);
      }
    );
  });
});
