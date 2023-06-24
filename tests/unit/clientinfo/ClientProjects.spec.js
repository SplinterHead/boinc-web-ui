import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import ClientProjects from "@/components/clientinfo/ClientProjects.vue";
import ClientProjectCard from "@/components/clientinfo/ClientProjectCard.vue";

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
    results: [
      {
        wu_name: "test_result_001",
        project_url: "https://www.worldcommunitygrid.org/",
      },
      {
        wu_name: "test_result_002",
        project_url: "https://www.worldcommunitygrid.org/",
      },
      {
        wu_name: "test_result_003",
        project_url: "https://www.spacecommunitygrid.org/",
      },
    ],
  },
};

let wrapper;

const projectCards = () => wrapper.findAllComponents(ClientProjectCard);

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

  it("renderd a list of ClientProjectCards when client has projects", () => {
    createWrapper(testPropsWithProjects);

    expect(projectCards().length).toBe(2);
  });
});
