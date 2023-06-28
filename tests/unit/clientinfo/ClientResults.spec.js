import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ClientResults from "@/components/clientinfo/ClientResults.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

const testProject = {
  project_name: "Test Project",
  master_url: "https://testproject.org/",
};
// install plugins as normal
localVue.use(BootstrapVue);

let wrapper;

const resultTable = () => wrapper.find("table");
const resultTableRows = () => resultTable().get("tbody").findAll("tr");
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
    it("displays the 'no tasks' message when there is no work", () => {
      createFullWrapper({ projects: [testProject], results: [] });

      expect(resultTable().exists()).toBe(false);
      expect(wrapper.text()).toContain("This client has no work to do");
      expect(wrapper.text()).toContain(
        "Check it is attached to projects and that they aren't paused"
      );
    });
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
          project_url: "https://testproject.org/",
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
