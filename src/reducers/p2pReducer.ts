import Peer from "peerjs";
import { loop, Cmd, liftState } from "redux-loop";

import { P2PActions, P2PActionsType } from "../actions/p2pActions";
import * as Api from "../effects/p2pApi";

export type State = { peer?: Peer; connections: string[] };

export const initialState: State = {
  connections: [],
};

export function reducer(state = initialState, action: P2PActionsType) {
  switch (action.type) {
    case "P2P/INIT_REQUEST":
      return loop(
        state,
        Cmd.run(Api.initialize, {
          successActionCreator: (peer) => P2PActions["P2P/INIT_SUCCESS"](peer),
        })
      );
    case "P2P/INIT_SUCCESS": {
      return liftState({ ...state, peer: action.payload });
    }
    case "P2P/CONNECT_PEER_REQUEST": {
      return loop(
        state,
        Cmd.run(Api.connectToPeer, {
          args: [
            state.peer!,
            action.payload,
            (data) => Cmd.action(P2PActions["P2P/RECEIVE_DATA"](data)),
          ],
          successActionCreator: () =>
            P2PActions["P2P/CONNECT_PEER_SUCCESS"](action.payload),
        })
      );
    }
    case "P2P/CONNECT_PEER_SUCCESS": {
      const connections = [...state.connections, action.payload];
      console.log(connections);
      return liftState({
        ...state,
        connections
      });
    }
    default: {
      return liftState(state);
    }
  }
}
