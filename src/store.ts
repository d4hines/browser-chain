import { createStore } from "redux";
import { install } from "redux-loop";
import { useSelector as origUseSelector } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import { reducer, State } from "./reducers/toplevelReducer";

// Some weird type error requires me to bulldoze TS here.
export const store = createStore(<any>reducer, composeWithDevTools(install()));

export const useSelector: <T1>(selector: (s: State) => T1) => T1 =
  origUseSelector;
