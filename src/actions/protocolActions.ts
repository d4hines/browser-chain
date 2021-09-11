import { ofType, unionize } from "unionize";
import { Block } from "../types";

export const ProtocolActions = unionize(
  {
    "PROTOCOL/SET_IDENTITY": ofType<string>(),
    "PROTOCOL/TICK": ofType<{}>(),
    "PROTOCOL/ADD_VALIDATOR": ofType<string>(),
    "PROTOCOL/PRODUCE_GENESIS_BLOCK": ofType<{}>(),
    "PROTOCOL/RECEIVE_BLOCK": ofType<Block>(),
    "PROTOCOL/PRODUCE_BLOCK": ofType<Block>(),
    "PROTOCOL/SIGN_BLOCK": ofType<{ blockHash: string; signature: string }>(),
  },
  {
    tag: "type",
    value: "payload",
  }
);

export type ProtocolActionsTypes = typeof ProtocolActions._Union;

export const isProtocolAction = (action: {
  type: string;
  payload: any;
}): action is ProtocolActionsTypes => action.type.startsWith("PROTOCOL");
