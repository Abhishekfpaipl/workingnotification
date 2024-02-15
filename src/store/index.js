import { createStore } from "vuex";

export default createStore({
  state: {
    datasets: [
      {
        label: 'Month Chart',
        data: [10, 10, 10, 10, 10, 10, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',  // Color for January
          'rgba(255, 159, 64, 1)',  // Color for February
          'rgba(255, 205, 86, 1)',  // Color for March
          'rgba(75, 192, 192, 1)',  // Color for April
          'rgba(54, 162, 235, 1)',  // Color for May
          'rgba(252, 102, 65, 1)',  // Color for June
          'rgba(40, 92, 65, 2)',  // Color for July
        ],
      },
      {
        label: 'Month Chart',
        data: [30, 30, 30, 30, 30, 30, 30],
        backgroundColor: [
          'rgba(255, 99, 12, 1)',  // Color for January
          'rgba(255, 59, 64, 1)',  // Color for February
          'rgba(25, 205, 86, 1)',  // Color for March
          'rgba(75, 12, 192, 1)',  // Color for April
          'rgba(54, 162, 25, 1)',  // Color for May
          'rgba(252, 102, 65, 1)',  // Color for June
          'rgba(4, 2, 65, 2)',  // Color for July
        ],
      },
    ],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
