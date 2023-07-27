import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BCard, BootstrapVue } from "bootstrap-vue";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);

const testProps = {
  activeClient: {
    name: "Test Server",
    id: "123456",
  },
  activeClientState: {
    version: { major: 1, minor: 2, patch: 3 },
    host_info: { os_name: "Windows" },
  },
};

let wrapper;

const clientCard = () => wrapper.getComponent(BCard);
const clientCardTitle = () => clientCard().attributes("title");
const clientVersion = () => clientCard().get("#client-version");
const clientPlatform = () => clientCard().get("#client-platform");

function createWrapper(propsData) {
  wrapper = shallowMount(BasicClientInfo, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("BasicClientInfo.vue", () => {
  describe("renders basic client info in a card", () => {
    it("includes the user-supplied server name", () => {
      createWrapper(testProps);

      expect(clientCardTitle()).toBe("Test Server");
    });

    it("includes the client's version number", () => {
      createWrapper(testProps);

      expect(clientVersion().isVisible()).toBeTruthy();
      expect(clientVersion().text()).toBe("v1.2.3");
    });

    it("includes the client's platform", () => {
      createWrapper(testProps);

      expect(clientPlatform().text()).toBe("Windows");
    });
  });
});
