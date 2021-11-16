import { User } from "@/typings";
import Vuex from "vuex";
import Vue from "vue";
import { getUserInfo as getUserInfo2 } from "@/api/user";
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {} as User,
  },
  mutations: {
    updateUserInfo(state, value) {
      state.userInfo = { ...state.userInfo, ...value };
    },
  },
  actions: {
    getUserInfo({ commit }) {
      getUserInfo2().then((res) => {
        commit("updateUserInfo",res.data);
      });
    },
  },
});
export default store;
