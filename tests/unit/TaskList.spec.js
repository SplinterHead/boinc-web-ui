import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import TaskList from "@/components/TaskList.vue";

let getters;
let state;
let store;
let wrapper;

const localVue = createLocalVue();
const testProjects = [
  {
    project_name: "Test Project",
    master_url: "https://testproject.org/",
  },
];

localVue.use(BootstrapVue);
localVue.use(Vuex);

const titleText = () => wrapper.get("h1").text();
const messageDiv = () => wrapper.get("#message-div");
const noClientMsg = () => messageDiv().get("#no-client");
const noTasksMsg = () => messageDiv().get("#no-tasks");
const resultTable = () => wrapper.get("#task-table");
const resultTableRows = () => resultTable().get("tbody").findAll("tr");
const firstRow = () => resultTableRows().at(0);
const secondRow = () => resultTableRows().at(1);
const firstRowProjectName = () => firstRow().findAll("td").at(1);
const firstRowProgressBar = () => firstRow().findAll("td").at(2);
const firstRowTimeRemaining = () => firstRow().findAll("td").at(3);
const secondRowTimeRemaining = () => secondRow().findAll("td").at(3);

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
    wrapper = shallowMount(TaskList, {
      localVue,
      store,
    });
  } else {
    wrapper = mount(TaskList, {
      localVue,
      store,
    });
  }
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("TaskList.vue", () => {
  it("has a title for the pane", () => {
    createWrapper({});

    expect(titleText()).toBe("Task List");
  });

  it("displays the 'select client' message when no client is active", () => {
    createWrapper({ shallow: false });

    expect(resultTable().isVisible()).toBe(false);
    expect(messageDiv().isVisible()).toBe(true);
    expect(noClientMsg().isVisible()).toBe(true);
    expect(noTasksMsg().isVisible()).toBe(false);
  });

  it("displays the 'no tasks' message when there is no work", () => {
    createWrapper({ shallow: false, clientId: "123" });

    expect(resultTable().isVisible()).toBe(false);
    expect(messageDiv().isVisible()).toBe(true);
    expect(noClientMsg().isVisible()).toBe(false);
    expect(noTasksMsg().isVisible()).toBe(true);
  });

  it("calls the client state API endpoint", () => {
    createWrapper({ clientId: "123" });

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/state\?client=123/)
    );
  });

  describe("renders the tasks", () => {
    it("each task is displayed in a table", () => {
      const testResults = [
        { name: "test_work_unit_name", state: 0 },
        { name: "test_work_unit_name_2", state: 0 },
      ];
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { results: testResults, projects: testProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
        expect(resultTable().isVisible()).toBe(true);
        expect(resultTableRows().length).toBe(2);

        expect(firstRow().findAll("td").at(0).text()).toBe(
          "test_work_unit_name"
        );
        expect(secondRow().findAll("td").at(0).text()).toBe(
          "test_work_unit_name_2"
        );
      });
    });

    it("displays the project name for the task", () => {
      const testResults = [
        {
          name: "test_work_unit_name",
          state: 0,
          project_url: "https://testproject.org/",
        },
      ];
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { results: testResults, projects: testProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowProjectName().text()).toBe(testProjects[0].project_name);
      });
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
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { results: testResult, projects: testProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          expect(firstRowProgressBar().text()).toBe(stateStr);
        });
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
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { results: testResults, projects: testProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowProgressBar().text()).toBe("Queued");
        expect(secondRow().get("div[role='progressbar']").isVisible()).toBe(
          true
        );
      });
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
        createWrapper({ shallow: false, clientId: "123" });
        mockAxios.mockResponse({
          data: { results: testResult, projects: testProjects },
        });

        wrapper.vm.$nextTick().then(() => {
          expect(
            firstRow().get("div[role='progressbar']").attributes("class")
          ).toContain(`bg-${variantName}`);
        });
      }
    );

    it("displays the active task time remaining", () => {
      const testResults = [
        {
          name: "test_work_unit_name_2",
          state: 2,
          active_task: { active_task_state: 0 },
          estimated_cpu_time_remaining: 60,
        },
      ];
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { results: testResults, projects: testProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowTimeRemaining().text()).toBe("00:01:00");
      });
    });

    it("does not display the time remaining for inactive tasks", () => {
      const testResults = [
        {
          name: "test_work_unit_name",
          state: 2,
          estimated_cpu_time_remaining: 60,
        },
        {
          name: "test_work_unit_name_2",
          state: 5,
          estimated_cpu_time_remaining: 60,
        },
      ];
      createWrapper({ shallow: false, clientId: "123" });
      mockAxios.mockResponse({
        data: { results: testResults, projects: testProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowTimeRemaining().text()).toBe("");
        expect(secondRowTimeRemaining().text()).toBe("");
      });
    });
  });
});
