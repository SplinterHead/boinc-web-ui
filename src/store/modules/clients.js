import axios from "axios";

export default {
  namespaced: true,
  state: {
    activeClientId: "",
    allClients: [],
  },
  getters: {
    activeClient: (state) => {
      if (state.activeClientId == "") {
        return {};
      } else {
        return state.allClients
          .filter((client) => client.id == state.activeClientId)
          .at(0);
      }
    },
    activeClientId: (state) => {
      return state.activeClientId;
    },
    allClients: (state) => {
      return state.allClients;
    },
  },
  actions: {
    setActiveClient({ commit }, clientId) {
      commit("setActiveClientId", clientId);
    },
    updateClients({ commit }) {
      axios
        .get(`${process.env.VUE_APP_API_URL}/clients/getall`)
        .then((response) => {
          commit("setClientList", response.data);
        });
    },
  },
  mutations: {
    setActiveClientId(state, clientId) {
      state.activeClientId = clientId;
    },
    setClientList(state, clients) {
      state.allClients = clients;
    },
  },
};
