import {
  createLocalVue,
  mount,
  RouterLinkStub,
  shallowMount,
} from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import ClientProjects from "@/components/ClientProjects.vue";

let getters;
let state;
let store;
let wrapper;

const localVue = createLocalVue();
const testPropsSuspendedProjects = [
  {
    master_url: "http://www.worldcommunitygrid.org/",
    suspended_via_gui: true,
    team_name: "team_name",
    user_name: "user_name",
    user_total_credit: 341094.533876,
  },
];
const testPropsWithProjects = [
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
        description: "Learn about the projects hosted at World Community Grid",
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
    team_name: "team_name",
    teamid: 0,
    user_create_time: 1665410370.0,
    user_expavg_credit: 2900.946548,
    user_name: "user_name",
    user_total_credit: 341094.533876,
    userid: 1156486,
  },
];

localVue.use(BootstrapVue);
localVue.use(Vuex);
localVue.use(VueRouter);

const titleText = () => wrapper.get("h1").text();
const messageDiv = () => wrapper.get("#message-div");
const noClientMsg = () => messageDiv().get("#no-client");
const noProjectMsg = () => messageDiv().get("#no-projects");
const addProjectBtn = () => wrapper.get("#new-project");

const projectTable = () => wrapper.get("#project-table");
const projectTableRows = () => projectTable().get("tbody").findAll("tr");
const firstRow = () => projectTableRows().at(0);
const firstRowCols = () => firstRow().findAll("td");
const firstRowExpand = () => firstRowCols().at(0);
const firstRowProjectName = () => firstRowCols().at(1);
const firstRowUserName = () => firstRowCols().at(2);
const firstRowTeamName = () => firstRowCols().at(3);
const firstRowResourceShare = () => firstRowCols().at(4);
const firstRowUserCredit = () => firstRowCols().at(5);
const firstRowProjectControls = () => firstRowCols().at(6).findAll("span");

function createWrapper({ shallow = true, clientId = "" }) {
  state = {
    activeClientId: clientId,
  };
  getters = {
    activeClientId: () => state.activeClientId,
  };
  store = new Vuex.Store({
    modules: {
      clients: {
        state,
        getters,
        namespaced: true,
      },
    },
  });

  if (shallow) {
    wrapper = shallowMount(ClientProjects, {
      store,
      localVue,
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  } else {
    wrapper = mount(ClientProjects, {
      store,
      localVue,
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  }
}

beforeEach(() => {
  process.env.BOOTSTRAP_VUE_NO_WARN = true;
});

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("ClientProjects.vue", () => {
  it("renders with the correct card title", () => {
    createWrapper({});

    expect(titleText()).toBe("Projects");
  });

  describe("message div", () => {
    it("displays the 'select client' message when no client is active", () => {
      createWrapper({});

      expect(projectTable().isVisible()).toBe(false);
      expect(messageDiv().isVisible()).toBe(true);
      expect(noClientMsg().isVisible()).toBe(true);
      expect(noProjectMsg().isVisible()).toBe(false);
    });
    it("displays the 'no projects' message when client has no projects", () => {
      createWrapper({ clientId: "123" });

      expect(messageDiv().isVisible()).toBe(true);
      expect(noClientMsg().isVisible()).toBe(false);
      expect(noProjectMsg().isVisible()).toBe(true);
    });
  });

  it("calls the projects API endpoint", () => {
    createWrapper({ clientId: "123" });

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/projects\/attached\?client=123/)
    );
  });

  describe("add project", () => {
    it("displays a button for adding a new project", () => {
      createWrapper({ shallow: false, clientId: "123" });

      expect(addProjectBtn().isVisible()).toBe(true);
    });
  });

  describe("project table", () => {
    it("displays a table for the results", () => {
      createWrapper({ clientId: "123" });
      mockAxios.mockResponse({
        data: { project_status: testPropsWithProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
        expect(projectTable().isVisible()).toBe(true);
      });
    });
  });

  it("displays the project details", () => {
    createWrapper({ shallow: false, clientId: "123" });
    mockAxios.mockResponse({
      data: { project_status: testPropsWithProjects },
    });

    wrapper.vm.$nextTick().then(() => {
      expect(projectTableRows().length).toBe(1);
      expect(firstRowProjectName().text()).toBe("World Community Grid");
      expect(firstRowUserName().text()).toBe("user_name");
      expect(firstRowTeamName().text()).toBe("team_name");
      expect(firstRowResourceShare().text()).toBe("100%");
      expect(firstRowUserCredit().text()).toBe("341094.53");
    });
  });

  describe("project controls", () => {
    describe("are rendered correctly", () => {
      it("displays the default set of icons when the project is active", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsWithProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          expect(firstRowProjectControls().at(0).attributes("class")).toContain(
            "pause-icon"
          );
          expect(firstRowProjectControls().at(1).attributes("class")).toContain(
            "autorenew-icon"
          );
          expect(firstRowProjectControls().at(2).attributes("class")).toContain(
            "refresh-icon"
          );
          expect(firstRowProjectControls().at(3).attributes("class")).toContain(
            "trash-can-outline-icon"
          );
        });
      });

      it("displays a resume button when the project is suspended", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsSuspendedProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          expect(firstRowProjectControls().at(0).attributes("class")).toContain(
            "play-icon"
          );
        });
      });
    });

    describe("are interactive", () => {
      it("calls the suspend API endpoint when the pause button is clicked", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsWithProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          firstRowProjectControls().at(0).trigger("click");

          expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringMatching(/projects\/suspend\?client=123/),
            {
              url: "http://www.worldcommunitygrid.org/",
            }
          );
        });
      });

      it("calls the resume API endpoint when the play button is clicked", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsSuspendedProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          firstRowProjectControls().at(0).trigger("click");

          expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringMatching(/projects\/resume\?client=123/),
            {
              url: "http://www.worldcommunitygrid.org/",
            }
          );
        });
      });

      it("calls the reset API endpoint when the reset button is clicked", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsWithProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          firstRowProjectControls().at(1).trigger("click");

          expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringMatching(/projects\/reset\?client=123/),
            {
              url: "http://www.worldcommunitygrid.org/",
            }
          );
        });
      });

      it("calls the update API endpoint when the update button is clicked", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsWithProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          firstRowProjectControls().at(2).trigger("click");

          expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringMatching(/projects\/update\?client=123/),
            {
              url: "http://www.worldcommunitygrid.org/",
            }
          );
        });
      });

      it("calls the detach API endpoint when the remove button is clicked", () => {
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { project_status: testPropsWithProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          firstRowProjectControls().at(3).trigger("click");

          expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringMatching(/projects\/detach\?client=123/),
            {
              url: "http://www.worldcommunitygrid.org/",
            }
          );
        });
      });
    });
  });

  describe("expanded project details", () => {
    it("displays an icon for exanding the project details", () => {
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { project_status: testPropsWithProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowExpand().isVisible()).toBe(true);
        expect(firstRowExpand().get("span").attributes("class")).toContain(
          "chevron-right-icon"
        );
      });
    });
  });
});
