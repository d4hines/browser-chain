import { loop, Cmd, liftState, CmdType } from "redux-loop";
import { isP2PAction, P2PActionsType } from "../actions/p2pActions";
import {
  isProtocolAction,
  ProtocolActions,
  ProtocolActionsTypes as ProtocolActionsType,
} from "../actions/protocolActions";
import * as P2PReducer from "./p2pReducer";
import * as ProtocolReducer from "./protocolReducer";

export type State = {
  p2p: P2PReducer.State;
  protocol: ProtocolReducer.State;
};

const initialState: State = {
  p2p: P2PReducer.initialState,
  protocol: ProtocolReducer.initialState,
};

type Actions = P2PActionsType | ProtocolActionsType;

const mapAction = (state: State, cmd: CmdType, action: Actions) =>
  loop(state, Cmd.list([cmd, Cmd.action(action)]));

export function reducer(state = initialState, action: Actions) {
  switch (true) {
    case isP2PAction(action): {
      const [p2p, cmd] = P2PReducer.reducer(
        state.p2p,
        action as P2PActionsType
      );
      const newState = { ...state, p2p };
      switch ((action as P2PActionsType).type) {
        case "P2P/INIT_SUCCESS": {
          return mapAction(
            newState,
            cmd,
            ProtocolActions["PROTOCOL/SET_IDENTITY"](action.payload)
          );
        }
        case "P2P/CONNECT_PEER_SUCCESS": {
          return mapAction(
            newState,
            cmd,
            ProtocolActions["PROTOCOL/ADD_VALIDATOR"](action.payload)
          );
        }
        default: {
          return loop({ ...state, p2p }, cmd);
        }
      }
    }
    case isProtocolAction(action): {
      const [protocol, cmd] = ProtocolReducer.reducer(
        state.protocol,
        action as ProtocolActionsType
      );
      return loop({ ...state, protocol }, cmd);
    }
    default: {
      return liftState(state);
    }
  }
}
