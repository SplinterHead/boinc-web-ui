import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ClientProjects from "@/components/clientinfo/ClientProjects.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

const testPropsNoProjects = {
  activeClient: {
    name: "Test Server",
    id: "123456",
  },
  activeClientState: {
    projects: [],
  },
};

const testPropsWithProjects = {
  activeClient: {
    name: "Test Server",
    id: "123456",
  },
  activeClientState: {
    projects: [
      {
        project_name: "World Community Grid",
        master_url: "https://www.worldcommunitygrid.org/",
      },
      {
        project_name: "Space Community Grid",
        master_url: "https://www.spacecommunitygrid.org/",
      },
    ],
  },
};

let wrapper;

function createWrapper(propsData) {
  wrapper = shallowMount(ClientProjects, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientProjects.vue", () => {
  it("renders the 'no projects' message when client has no projects", () => {
    createWrapper(testPropsNoProjects);

    expect(wrapper.text()).toBe("This client is not attached to any projects");
  });
});
