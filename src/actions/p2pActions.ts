import { ofType, unionize } from "unionize";
import Peer from "peerjs";

export const P2PActions = unionize(
  {
    "P2P/INIT_REQUEST": ofType<{}>(),
    "P2P/INIT_SUCCESS": ofType<Peer>(),
    // TODO: add error handling for init failure
    "P2P/CONNECT_PEER_REQUEST": ofType<string>(),
    "P2P/CONNECT_PEER_SUCCESS": ofType<string>(),
    "P2P/RECEIVE_DATA": ofType<any>(),
    // TODO: add failure case
  },
  {
    tag: "type",
    value: "payload",
  }
);

export type P2PActionsType = typeof P2PActions._Union;
export const isP2PAction = (action: {
  type: string;
  payload: any;
}): action is P2PActionsType => action.type.startsWith("P2P");
