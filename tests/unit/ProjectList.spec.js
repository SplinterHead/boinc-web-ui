import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BDropdownItem, BootstrapVue } from "bootstrap-vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";

library.add([faApple, faLinux, faWindows]);

import ProjectList from "@/components/ProjectList.vue";
import ProjectCard from "@/components/project/ProjectCard.vue";
import mockAxios from "jest-mock-axios";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);
localVue.component("font-awesome-icon", FontAwesomeIcon);

const sampleProjects = [
  {
    description: "Study drugs to fight SARS-CoV-2",
    general_area: "Biology and Medicine",
    home: "The COVID.SI project and the Karelian Research Center of the Russian Academy of Sciences",
    id: 51,
    image: "https://boinc.berkeley.edu/images/sidock.png",
    keywords: "9 13 64 20 44",
    name: "SIDock@home",
    platforms: [
      {
        name: "windows_x86_64",
      },
    ],
    specific_area: "Biomedicine",
    summary: "Study drugs to fight SARS-CoV-2",
    url: "https://www.sidock.si/sidock/",
    web_url: "https://www.sidock.si/sidock/",
  },
  {
    description:
      "RNA World seeks to identify, analyze, structurally predict and design RNA molecules on the basis of established bioinformatics software.",
    general_area: "Biology and Medicine",
    home: "Rechenkraft.net e.V.",
    id: 5,
    image: "https://boinc.berkeley.edu/images/rna4.png",
    keywords: "9 12 20 21",
    name: "RNA World",
    platforms: [
      {
        name: "windows_x86_64",
      },
    ],
    specific_area: "Molecular biology",
    summary: "Study and design RNA molecules",
    url: "https://www.rnaworld.de/rnaworld/",
    web_url: "https://www.rnaworld.de/rnaworld/",
  },
  {
    description:
      "The goal of Cosmology@Home is to search for the model that best describes our Universe and to find the range of models that agree with the available astronomical particle physics data.",
    general_area: "Physical Science",
    home: "University of Illinois at Urbana-Champaign",
    id: 12,
    image: "https://boinc.berkeley.edu/images/cosmo.jpg",
    keywords: "1 5 23 24 56",
    name: "Cosmology@Home",
    platforms: [
      {
        name: "windows_x86_64",
      },
    ],
    specific_area: "Astronomy",
    summary: "Study the evolution of the Universe",
    url: "http://www.cosmologyathome.org/",
    web_url: "http://www.cosmologyathome.org/",
  },
];

let wrapper;

const filterBar = () => wrapper.get("#filter-bar");
const categorySelect = () => wrapper.get("#category-select");
const categorySelectItems = () =>
  categorySelect().findAllComponents(BDropdownItem);
const subCategorySelect = () => wrapper.get("#subcategory-select");
const subCategorySelectItems = () =>
  subCategorySelect().findAllComponents(BDropdownItem);
const projectCards = () => wrapper.findAllComponents(ProjectCard);

function createWrapper(propsData) {
  wrapper = shallowMount(ProjectList, {
    localVue,
    propsData: propsData,
  });
}

function createFullWrapper(propsData) {
  wrapper = mount(ProjectList, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("ProjectList.vue", () => {
  describe("No projects returned from the API", () => {
    const noProjects = { status: 200, data: { projects: [] } };

    it("displays 'Please choose a client' message when no client is active", () => {
      createWrapper({ activeClient: {} });

      expect(wrapper.text()).toBe("Please choose a client");
    });

    it("display 'No Projects found' message", () => {
      createWrapper({ activeClient: { name: "test client", id: "123" } });

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*=123/)
      );
      mockAxios.mockResponse(noProjects);
      expect(wrapper.text()).toBe("No Projects found");
    });
  });

  describe("projects can be filtered", () => {
    const sampleProjectsResponse = {
      status: 200,
      data: { projects: sampleProjects },
    };

    it("displays a bar for filtering projects", async () => {
      createWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      expect(filterBar().isVisible()).toBe(true);
    });

    it("builds a list of categories from the projects", async () => {
      createWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      expect(categorySelect().isVisible()).toBe(true);
      expect(categorySelect().attributes("text")).toBe("Select...");
      expect(categorySelect().findAllComponents(BDropdownItem).length).toBe(3); // Allow for "reset" option
      expect(
        categorySelect().findAllComponents(BDropdownItem).at(0).text()
      ).toBe("Biology and Medicine");
    });

    it("builds a list of sub-categories from the projects once main category is selected", async () => {
      createWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      expect(subCategorySelect().isVisible()).toBe(false);
      categorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;

      expect(subCategorySelect().isVisible()).toBe(true);
      expect(subCategorySelect().attributes("text")).toBe("Select...");
      expect(subCategorySelect().findAllComponents(BDropdownItem).length).toBe(
        3
      ); // Allow for "reset" option
      expect(
        subCategorySelect().findAllComponents(BDropdownItem).at(0).text()
      ).toBe("Biomedicine");
    });

    it("maintains the full list of subcategories when one is selected", async () => {
      createWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      categorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      subCategorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;

      expect(subCategorySelectItems().length).toBe(3);
    });

    it("only displays the projects that match the selected category", async () => {
      createFullWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      // Category with 2 entries
      categorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      expect(projectCards().length).toBe(2);

      // Category with 1 entry
      categorySelectItems().at(1).vm.$emit("click");
      await wrapper.vm.$nextTick;
      expect(projectCards().length).toBe(1);

      // Reset to remove any category filter
      categorySelectItems().at(2).vm.$emit("click");
      await wrapper.vm.$nextTick;
      expect(projectCards().length).toBe(3);
    });

    it("only displays the projects that match the category and subcategory", async () => {
      createFullWrapper({ activeClient: { name: "test client", id: "123" } });
      mockAxios.mockResponse(sampleProjectsResponse);
      await wrapper.vm.$nextTick;

      categorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      subCategorySelectItems().at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;

      expect(projectCards().length).toBe(1);
    });
  });
});