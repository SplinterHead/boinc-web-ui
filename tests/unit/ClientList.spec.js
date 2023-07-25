import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BCard, BootstrapVue } from "bootstrap-vue";

import ClientList from "@/components/ClientList.vue";

const localVue = createLocalVue();
const testClients = [
  { name: "test client", id: "1", hostname: "test.client" },
  { name: "test client", id: "2", hostname: "localhost" },
  { name: "test client", id: "3", hostname: "192.168.0.2" },
];

localVue.use(BootstrapVue);
localVue.use(Vuex);

let wrapper;
let state;
let getters;
let actions;

const newClientBtn = () => wrapper.get("#new-client-btn");
const clientCards = () => wrapper.findAllComponents(BCard);

function createWrapper({ shallow = true, clients }) {
  state = {
    allClients: clients,
  };
  getters = {
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
  if (shallow) {
    wrapper = shallowMount(ClientList, {
      localVue,
      store,
    });
  } else {
    wrapper = mount(ClientList, {
      localVue,
      store,
    });
  }
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientList.vue", () => {
  it("contains a button for adding a new client", () => {
    createWrapper({ clients: [] });

    expect(newClientBtn().isVisible()).toBe(true);
    expect(newClientBtn().text()).toBe("Add Client");
  });

  it("calls the client API endpoint to get the current clients", () => {
    createWrapper({ clients: [] });

    expect(actions.updateClients).toHaveBeenCalled();
  });

  it("renders a list of clients", () => {
    createWrapper({ clients: testClients });

    expect(clientCards().length).toBe(testClients.length);
  });

  describe("renders a card for each client", () => {
    it("has as an icon on the card", () => {
      createWrapper({ shallow: false, clients: [testClients[0]] });

      expect(
        clientCards().at(0).get(".client-icon").attributes("class")
      ).toContain("server-icon");
    });
    it("has the client's details on the card", () => {
      createWrapper({ clients: [testClients[0]] });

      expect(clientCards().at(0).text()).toContain("test client");
      expect(clientCards().at(0).text()).toContain("test.client");
    });
  });
});
