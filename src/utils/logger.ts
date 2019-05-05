import { beforeDispatchFunc, beforeUpdateFunc } from 'react-state-manage/dist/typings';

const gray = 'color: gray; font-weight: lighter;';

const formatAction = <S extends any>(name: string, color: string, data: S) => {
  console.log(`%c${name}%c`, `color: ${color}; font-weight: bold;`, gray, data);
};

const formatTag = (color: string) => {
  return `background: ${color}; color: white; font-weight: bold;padding: 4px;border-radius: 4px;`;
};

export const reactStorelogger: beforeDispatchFunc = (state: any, action: any, payload?: any) => {
  try {
    console.groupCollapsed(
      `%cdispatch%c dispatch %c${action.toString()} %c@${new Date().toTimeString().split(' ')[0]}`,
      formatTag('gray'),
      gray,
      'font-weight: bold',
      gray
    );
    formatAction('state     ', 'gray', state);
    formatAction('action    ', '#32aef8', action);
    formatAction('payload   ', '#52b455', payload);
    console.groupEnd();
  } catch (e) {
    console.trace(e);
  }
};

export const reactStoreUpdatelogger: beforeUpdateFunc = (prevState: any, nextState: any, action: any) => {
  try {
    console.groupCollapsed(
      `%c update %c action in %c${action.toString()} %c@${new Date().toTimeString().split(' ')[0]}`,
      formatTag('#32aef8'),
      gray,
      'color: #32aef8; font-weight: bold',
      gray
    );
    formatAction('prev state   ', 'gray', prevState);
    formatAction('action       ', '#32aef8', action);
    formatAction('next state   ', '#983680', nextState);
    console.groupEnd();
  } catch (e) {
    console.trace(e);
  }
};
