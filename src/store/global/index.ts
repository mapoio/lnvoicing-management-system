import { createStore } from 'react-state-manage';

type sideBar = 'dark' | 'light';

interface IState {
  sideBarTheme: sideBar;
  sideBarCollapsed: boolean;
  navOpenKeys: string[];
}

const cache = JSON.parse(localStorage.getItem('GlobalStore') || '{}');

const initState: IState = {
  sideBarTheme: cache.sideBarTheme || 'light',
  sideBarCollapsed: cache.sideBarCollapsed || false,
  navOpenKeys: cache.navOpenKeys || []
};

const { useStore, dispatch, getState } = createStore({
  state: initState,
  reducers: {
    changeSiderTheme(state, payload: sideBar) {
      state.sideBarTheme = payload;
      localStorage.setItem('GlobalStore', JSON.stringify(getState()));
    },
    setOpenKeys(state, payload: string[]) {
      state.navOpenKeys = payload;
      localStorage.setItem('GlobalStore', JSON.stringify(getState()));
    },
    toggleSideBarCollapsed(state) {
      state.sideBarCollapsed = !state.sideBarCollapsed;
      localStorage.setItem('GlobalStore', JSON.stringify(getState()));
    }
  }
});

export const GlobalStore = { useStore, dispatch };
