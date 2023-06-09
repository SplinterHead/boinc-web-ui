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
import axios from "axios";

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

describe("ProjectList.vue", () => {
  describe("No projects returned from the API", () => {
    const noProjects = { status: 200, data: { projects: [] } };
    jest.spyOn(axios, "get").mockResolvedValue(noProjects);

    it("displays 'Please choose a client' message when no client is active", () => {
      const wrapper = shallowMount(ProjectList, {
        localVue,
        propsData: {
          activeClient: {},
        },
      });
      expect(wrapper.text()).toBe("Please choose a client");
    });

    it("display 'No Projects found' message", async () => {
      const wrapper = await shallowMount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/.*=123/));
      expect(wrapper.text()).toBe("No Projects found");
    });
  });

  describe("projects can be filtered", () => {
    const sampleProjectsResponse = {
      status: 200,
      data: { projects: sampleProjects },
    };
    jest.spyOn(axios, "get").mockResolvedValue(sampleProjectsResponse);

    it("displays a bar for filtering projects", async () => {
      const wrapper = await shallowMount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });

      await wrapper.vm.$nextTick;
      expect(wrapper.find("#filter-bar").exists()).toBe(true);
    });

    it("builds a list of categories from the projects", async () => {
      const wrapper = await shallowMount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });

      await wrapper.vm.$nextTick;
      const categorySelect = wrapper.get("#category-select");
      expect(categorySelect.exists()).toBe(true);
      expect(categorySelect.attributes("text")).toBe("Select...");
      expect(categorySelect.findAllComponents(BDropdownItem).length).toBe(3); // Allow for "reset" option
      expect(categorySelect.findAllComponents(BDropdownItem).at(0).text()).toBe(
        "Biology and Medicine"
      );
    });

    it("builds a list of sub-categories from the projects once main category is selected", async () => {
      const wrapper = await shallowMount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });

      await wrapper.vm.$nextTick;
      expect(wrapper.find("#subcategory-select").exists()).toBe(false);

      const categorySelect = wrapper.find("#category-select");
      const dropdownItems = categorySelect.findAllComponents(BDropdownItem);

      dropdownItems.at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      expect(wrapper.find("#subcategory-select").exists()).toBe(true);
      const subCategorySelect = wrapper.get("#subcategory-select");
      expect(subCategorySelect.attributes("text")).toBe("Select...");
      expect(subCategorySelect.findAllComponents(BDropdownItem).length).toBe(3); // Allow for "reset" option
      expect(
        subCategorySelect.findAllComponents(BDropdownItem).at(0).text()
      ).toBe("Biomedicine");
    });

    it("only displays the projects that match the selected category", async () => {
      const wrapper = await mount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });

      await wrapper.vm.$nextTick;

      const categorySelect = wrapper.find("#category-select");
      const dropdownItems = categorySelect.findAllComponents(BDropdownItem);

      let projects;

      // Category with 2 entries
      dropdownItems.at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      projects = wrapper.findAllComponents(ProjectCard);
      expect(projects.length).toBe(2);

      // Category with 1 entry
      dropdownItems.at(1).vm.$emit("click");
      await wrapper.vm.$nextTick;
      projects = wrapper.findAllComponents(ProjectCard);
      expect(projects.length).toBe(1);

      // Reset to remove any category filter
      dropdownItems.at(2).vm.$emit("click");
      await wrapper.vm.$nextTick;
      projects = wrapper.findAllComponents(ProjectCard);
      expect(projects.length).toBe(3);
    });

    it("only displays the projects that match the category and subcategory", async () => {
      const wrapper = await mount(ProjectList, {
        localVue,
        propsData: {
          activeClient: { name: "test client", id: "123" },
        },
      });

      await wrapper.vm.$nextTick;

      const categorySelect = wrapper.find("#category-select");
      const dropdownItems = categorySelect.findAllComponents(BDropdownItem);

      dropdownItems.at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;

      const subCategorySelect = wrapper.find("#subcategory-select");
      const subDropdownItems =
        subCategorySelect.findAllComponents(BDropdownItem);

      // Category with 2 entries
      subDropdownItems.at(0).vm.$emit("click");
      await wrapper.vm.$nextTick;
      const projects = wrapper.findAllComponents(ProjectCard);
      expect(projects.length).toBe(1);
    });
  });
});
