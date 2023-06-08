import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BDropdownItem, BootstrapVue } from "bootstrap-vue";

import ClientSelectList from "@/components/navigation/ClientSelectList.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

let wrapper;

const clientDropDown = () => wrapper.find("#client-dropdown");
const newClientBtn = () => wrapper.find("#new-client-btn");

function createWrapper(propsData) {
  wrapper = shallowMount(ClientSelectList, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientSelectList.vue", () => {
  it("renders as a button when no clients are configured", () => {
    createWrapper({
      activeClient: {},
      clients: [],
    });
    expect(clientDropDown().exists()).toBe(false);
    expect(newClientBtn().exists()).toBe(true);
  });

  it("renders as a dropdown when clients are configured", () => {
    createWrapper({
      activeClient: {},
      clients: [
        { name: "test client" },
        { name: "test client" },
        { name: "test client" },
      ],
    });
    expect(newClientBtn().exists()).toBe(false);
    expect(clientDropDown().exists()).toBe(true);
    expect(clientDropDown().attributes("text")).toBe("Select Client...");

    const dropdownItems = clientDropDown().findAllComponents(BDropdownItem);
    expect(dropdownItems.length).toBe(4); // 4 accounts for the "Add New Client..." option
    expect(dropdownItems.at(-1).text()).toBe("Add New Client...");
  });

  it("truncates a long name", () => {
    createWrapper({
      activeClient: { name: "thisisareallylongnamethatistoolongtodisplay" },
      clients: [{ name: "thisisareallylongnamethatistoolongtodisplay" }],
    });
    expect(clientDropDown().attributes("text")).toBe(
      "thisisareallylongname..."
    );
  });
});
