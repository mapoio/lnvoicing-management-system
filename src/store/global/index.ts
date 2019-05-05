import { createStore } from 'react-state-manage';

type sideBar = 'dark' | 'light';

interface IState {
  sideBarTheme: sideBar;
  sideBarCollapsed: boolean;
  navOpenKeys: string[];
}

const initState: IState = {
  sideBarTheme: 'light',
  sideBarCollapsed: false,
  navOpenKeys: []
};

const { useStore, dispatch } = createStore({
  state: initState,
  reducers: {
    changeSiderTheme(state, payload: sideBar) {
      state.sideBarTheme = payload;
    },
    setOpenKeys(state, payload: string[]) {
      state.navOpenKeys = payload;
    },
    toggleSideBarCollapsed(state) {
      state.sideBarCollapsed = !state.sideBarCollapsed;
    }
  }
});

export const GlobalStore = { useStore, dispatch };
