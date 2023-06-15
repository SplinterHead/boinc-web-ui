import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BCard, BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

const sampleBasicInfo = { version: { major: 1, minor: 2, patch: 3 }, host_info: { os_name: "Windows" } };

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
  mockAxios.reset();
  wrapper.destroy();
});

describe("BasicClientInfo.vue", () => {
  describe("renders basic client info in a card", () => {
    const basicProps = { name: "Test Server", id: "123456" };
    it("includes the user-supplied server name", () => {
      createWrapper({ activeClient: basicProps });

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*\/client\/basicinfo\?client=123456/)
      );
      expect(clientCardTitle()).toBe("Test Server");
    });

    it("includes the client's version number", async () => {
      createWrapper({ activeClient: basicProps });
      mockAxios.mockResponse({ status: 200, data: sampleBasicInfo });
      await wrapper.vm.$nextTick();

      expect(clientVersion().isVisible()).toBeTruthy();
      expect(clientVersion().text()).toBe("v1.2.3");
    });

    it("includes the client's platform", async () => {
      createWrapper({ activeClient: basicProps });
      mockAxios.mockResponse({ status: 200, data: sampleBasicInfo });
      await wrapper.vm.$nextTick();

      expect(clientPlatform().text()).toBe("Windows");
    });
  });
});
