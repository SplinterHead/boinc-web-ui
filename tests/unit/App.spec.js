import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import App from "@/App.vue";
import ClientSelectList from "@/components/navigation/ClientSelectList.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

const sampleClient = {
  name: "test client",
  id: "123456",
};

let wrapper;

const clientSelectComponent = () => wrapper.getComponent(ClientSelectList);

function createWrapper(propsData) {
  wrapper = mount(App, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("App.vue", () => {
  it("gets active client state on change", () => {
    createWrapper({});
    clientSelectComponent().vm.$emit("select-client", sampleClient);

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/state\?client=123456/)
    );
  });
});
