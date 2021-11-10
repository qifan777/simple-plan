import { User } from "@/typings";
import Vuex from "vuex";
import Vue from "vue";
import { getUserInfo as getUserInfo2 } from "@/api/user";
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    counter: 0,
    userInfo: {} as User,
  },
  mutations: {
    add(state) {
      state.counter++;
    },
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
