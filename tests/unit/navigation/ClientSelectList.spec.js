import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BDropdownItem, BootstrapVue } from "bootstrap-vue";

import ClientSelectList from "@/components/navigation/ClientSelectList.vue";

let wrapper;
let state;
let getters;
let actions;

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(Vuex);

const clientDropDown = () => wrapper.find("#client-dropdown");
const clientDropDownItems = () =>
  clientDropDown().findAllComponents(BDropdownItem);
const newClientBtn = () => wrapper.find("#new-client-nav");

function createWrapper(activeClient, clients) {
  state = {
    activeClientId: activeClient,
    allClients: clients,
  };
  getters = {
    activeClient: () => (state.activeClientId ? state.allClients.at(0) : {}),
    allClients: () => state.allClients,
  };
  actions = { updateClients: jest.fn() };

  let store = new Vuex.Store({
    modules: {
      clients: {
        state,
        actions,
        getters,
        namespaced: true,
      },
    },
  });

  wrapper = shallowMount(ClientSelectList, {
    store,
    localVue,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientSelectList.vue", () => {
  it("calls updateClients", () => {
    createWrapper("", []);
    expect(actions.updateClients).toHaveBeenCalled();
  });

  it("renders as a button when no clients are configured", () => {
    createWrapper("", []);
    expect(clientDropDown().isVisible()).toBe(false);
    expect(newClientBtn().isVisible()).toBe(true);
    expect(newClientBtn().text()).toBe("Add New Client...");
  });

  it("renders as a dropdown when clients are configured", () => {
    createWrapper("", [
      { name: "test client", id: "1" },
      { name: "test client", id: "2" },
      { name: "test client", id: "3" },
    ]);
    expect(newClientBtn().isVisible()).toBe(false);
    expect(clientDropDown().isVisible()).toBe(true);
    expect(clientDropDown().attributes("text")).toBe("Select Client...");

    expect(clientDropDownItems().length).toBe(4); // 4 accounts for the "Add New Client..." option
    expect(clientDropDownItems().at(-1).text()).toBe("Add New Client...");
  });

  it("truncates a long name", () => {
    createWrapper("1", [
      { name: "thisisareallylongnamethatistoolongtodisplay", id: "1" },
    ]);
    expect(clientDropDown().attributes("text")).toBe(
      "thisisareallylongname..."
    );
  });
});
