import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ProjectList from "@/components/ProjectList.vue";
import axios from "axios";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

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
});
