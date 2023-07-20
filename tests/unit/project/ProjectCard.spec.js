import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import ProjectCard from "@/components/project/ProjectCard.vue";
import ProjectAuthModal from "@/components/project/ProjectAuthModal.vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);

let wrapper;

const cardTitle = () => wrapper.get(".card-title");
const cardDescription = () => wrapper.get(".card-description");
const platforms = () => wrapper.get("#project-platforms");
const registerBtn = () => wrapper.find("button");
const childWrapper = () => wrapper.getComponent(ProjectAuthModal);

function createWrapper(propsData) {
  wrapper = mount(ProjectCard, {
    localVue,
    propsData: {
      clientId: "123",
      project: propsData,
    },
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ProjectCard.vue", () => {
  describe("render a project", () => {
    it("displays the formatted list of projects", () => {
      createWrapper({
        name: "Test Project",
        description: "Test Project Description",
        platforms: [],
      });
      expect(cardTitle().text()).toBe("Test Project");
      expect(cardDescription().text()).toBe("Test Project Description");
      expect(platforms().isVisible()).toBe(false);
    });

    it("shows the 'Windows' platform when present in the platform list", () => {
      createWrapper({
        name: "Test Project",
        description: "Test Project Description",
        platforms: [{ name: "windows_x86_64" }],
      });
      expect(platforms().isVisible()).toBe(true);
      expect(platforms().find("#platform-apple").attributes("class")).toContain(
        "disabled"
      );
      expect(platforms().find("#platform-linux").attributes("class")).toContain(
        "disabled"
      );
      expect(
        platforms().find("#platform-windows").attributes("class")
      ).toContain("enabled");
    });

    it("shows the 'Linux' and 'Windows' platforms when present in the platform list", () => {
      createWrapper({
        name: "Test Project",
        description: "Test Project Description",
        platforms: [
          { name: "windows_x86_64" },
          { name: "x86_64-pc-linux-gnu" },
        ],
      });
      expect(platforms().isVisible()).toBe(true);
      expect(platforms().find("#platform-apple").attributes("class")).toContain(
        "disabled"
      );
      expect(platforms().find("#platform-linux").attributes("class")).toContain(
        "enabled"
      );
      expect(
        platforms().find("#platform-windows").attributes("class")
      ).toContain("enabled");
    });

    describe("allow the user to register a project on their client", () => {
      it("displays a button to start the registration process", () => {
        createWrapper({
          name: "Test Project",
          description: "Test Project Description",
          platforms: [],
        });
        expect(registerBtn().isVisible()).toBe(true);
        expect(registerBtn().text()).toBe("Add");
      });

      it("calls the API with the relevant project details to attach", async () => {
        const testProject = {
          name: "Test Project",
          description: "Test Project Description",
          web_url: "https://tesproject.com/test/",
          platforms: [],
        };
        createWrapper(testProject);

        await childWrapper().vm.$emit("project-auth", "token_1234");

        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.stringMatching(/projects\/attach\?client=123/),
          {
            name: "Test Project",
            url: "https://tesproject.com/test/",
            key: "token_1234",
          }
        );
      });
    });
  });
});
