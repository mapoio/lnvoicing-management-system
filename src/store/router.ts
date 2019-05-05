import { createStore } from 'react-state-manage';
import { History, Location, createHashHistory } from 'history';

interface IState {
  history: History;
  location: Location;
}

export const hashHistory = createHashHistory();

const initState: IState = {
  history: hashHistory,
  location: hashHistory.location
};

export const RoutersStore = createStore({
  state: initState,
  reducers: {
    updateHistory(state, history: History) {
      state.history = history;
    },
    updateLocation(state, location: Location) {
      state.location = location;
    },
    push(state, location: Location) {
      state.history.push(location);
      hashHistory.push(location);
    },
    replace(state, location: Location) {
      state.history.replace(location);
      hashHistory.replace(location);
    },
    go(state, n: number) {
      state.history.go(n);
      hashHistory.go(n);
    },
    goBack(state) {
      state.history.goBack();
      hashHistory.goBack();
    },
    goForward(state) {
      state.history.goForward();
      hashHistory.goForward();
    }
  }
});

const handleLocationChange = (location: Location) => {
  RoutersStore.dispatch('updateLocation', location);
};

export const unlisten = hashHistory.listen(handleLocationChange);
