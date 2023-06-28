import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import ClientProjects from "@/components/clientinfo/ClientProjects.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowRotateLeft,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
library.add([faArrowRotateLeft, faPause, faPlay]);
localVue.component("font-awesome-icon", FontAwesomeIcon);
localVue.use(BootstrapVue);

const testPropsNoProjects = {
  projects: [],
};

const testPropsWithProjects = {
  projects: [
    {
      cpid_time: 1665410370.0,
      cross_project_id: "037befc40287d29bb9590d8e0edd8198",
      desired_disk_usage: 0.0,
      disk_share: 410497975500.800049,
      disk_usage: 1410613248.0,
      dont_use_dcf: false,
      duration_correction_factor: 1.0,
      elapsed_time: 43580057.333979,
      email_hash: "35cfa58b4e0b46de6a651ce508082d61",
      external_cpid: "192792945b257453b6da6c7cad1c1381",
      gui_urls: [
        {
          name: "Research Overview",
          description:
            "Learn about the projects hosted at World Community Grid",
          url: "https://www.worldcommunitygrid.org/research/viewAllProjects.do",
        },
      ],
      host_create_time: 1665650589.0,
      host_expavg_credit: 2900.71544,
      host_total_credit: 339691.861332,
      host_venue: "",
      hostid: 8667640,
      last_rpc_time: 1677187401.862822,
      master_fetch_failures: 0,
      master_url_fetch_pending: false,
      master_url: "http://www.worldcommunitygrid.org/",
      min_rpc_time: 1677187523.062822,
      next_rpc_time: 1677446601.862822,
      njobs_error: 86,
      njobs_success: 3872,
      nrpc_failures: 0,
      project_dir: "/var/lib/boinc/projects/www.worldcommunitygrid.org",
      project_files_downloaded_time: 0.0,
      project_name: "World Community Grid",
      rec_time: 1677189666.165,
      rec: 4267.417546,
      resource_share: 100.0,
      rpc_seqno: 655,
      rsc_backoff_interval: { name: "CPU", value: 0.0 },
      rsc_backoff_time: { name: "CPU", value: 0.0 },
      sched_priority: -1.041667,
      sched_rpc_pending: 0,
      scheduler_rpc_in_progress: false,
      send_job_log: 0,
      send_time_stats_log: 0,
      suspended_via_gui: false,
      symstore: "",
      team_name: "",
      teamid: 0,
      user_create_time: 1665410370.0,
      user_expavg_credit: 2900.946548,
      user_name: "user_name",
      user_total_credit: 341094.533876,
      userid: 1156486,
    },
  ],
};

const testPropsSuspendedProjects = {
  projects: [
    {
      master_url: "http://www.worldcommunitygrid.org/",
      suspended_via_gui: true,
    },
  ],
};

let wrapper;

const projectTable = () => wrapper.get("table");
const projectTableRows = () => wrapper.get("tbody").findAll("tr");
const firstRow = () => projectTableRows().at(0);
const firstRowProjectName = () => firstRow().findAll("td").at(0);
const firstRowProjectControls = () =>
  firstRow().findAll("td").at(1).findAllComponents(FontAwesomeIcon);

function createWrapper(propsData) {
  wrapper = shallowMount(ClientProjects, {
    localVue,
    propsData: {
      activeClient: {
        name: "Test Server",
        id: "123",
      },
      activeClientState: propsData,
    },
  });
}

function createFullWrapper(propsData) {
  wrapper = mount(ClientProjects, {
    localVue,
    propsData: {
      activeClient: {
        name: "Test Server",
        id: "123",
      },
      activeClientState: propsData,
    },
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientProjects.vue", () => {
  it("renders with the correct card title", () => {
    createWrapper(testPropsNoProjects);

    expect(wrapper.attributes("title")).toBe("Projects");
  });

  describe("project details are renedered", () => {
    it("the 'no projects' message when client has no projects", () => {
      createWrapper(testPropsNoProjects);

      expect(wrapper.text()).toBe(
        "This client is not attached to any projects"
      );
    });

    it("the list of project names", () => {
      createFullWrapper(testPropsWithProjects);

      expect(projectTable().exists()).toBe(true);
      expect(projectTableRows().length).toBe(1);
      expect(firstRowProjectName().text()).toBe("World Community Grid");
    });
  });

  describe("project controls", () => {
    describe("are rendered correctly", () => {
      it("displays a pause button when the project is active", () => {
        createFullWrapper(testPropsWithProjects);

        expect(firstRowProjectControls().at(0).attributes("class")).toContain(
          "fa-pause"
        );
      });

      it("displays a resume button when the project is suspended", () => {
        createFullWrapper(testPropsSuspendedProjects);

        expect(firstRowProjectControls().at(0).attributes("class")).toContain(
          "fa-play"
        );
      });

      it("displays a reset button for the project", () => {
        createFullWrapper(testPropsWithProjects);

        expect(firstRowProjectControls().at(1).attributes("class")).toContain(
          "fa-arrow-rotate-left"
        );
      });
    });

    describe("are interactive", () => {
      it("calls the suspend API endpoint when the pause button is clicked", () => {
        createFullWrapper(testPropsWithProjects);

        firstRowProjectControls().at(0).trigger("click");

        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.stringMatching(/projects\/suspend\?client=123/),
          {
            url: "http://www.worldcommunitygrid.org/",
          }
        );
      });

      it("calls the resume API endpoint when the play button is clicked", () => {
        createFullWrapper(testPropsSuspendedProjects);

        firstRowProjectControls().at(0).trigger("click");

        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.stringMatching(/projects\/resume\?client=123/),
          {
            url: "http://www.worldcommunitygrid.org/",
          }
        );
      });

      it("calls the reset API endpoint when the reset button is clicked", () => {
        createFullWrapper(testPropsWithProjects);

        firstRowProjectControls().at(1).trigger("click");

        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.stringMatching(/projects\/reset\?client=123/),
          {
            url: "http://www.worldcommunitygrid.org/",
          }
        );
      });
    });
  });
});
