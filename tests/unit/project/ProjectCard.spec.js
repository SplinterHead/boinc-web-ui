import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";

library.add([faApple, faLinux, faWindows]);

import ProjectCard from "@/components/project/ProjectCard.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);
localVue.component("font-awesome-icon", FontAwesomeIcon);

let wrapper;

const cardTitle = () => wrapper.get(".card-title");
const cardDescription = () => wrapper.get(".card-description");
const platforms = () => wrapper.get("#project-platforms");

function createWrapper(propsData) {
  wrapper = mount(ProjectCard, {
    localVue,
    propsData: { project: propsData },
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
      expect(platforms().find("#platform-apple").exists()).toBe(false);
      expect(platforms().find("#platform-linux").exists()).toBe(false);
      expect(platforms().find("#platform-windows").exists()).toBe(true);
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
      expect(platforms().find("#platform-apple").exists()).toBe(false);
      expect(platforms().find("#platform-linux").exists()).toBe(true);
      expect(platforms().find("#platform-windows").exists()).toBe(true);
    });
  });
});
