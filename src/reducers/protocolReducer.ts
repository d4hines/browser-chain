import { loop, Cmd, liftState } from "redux-loop";
import * as CryptoJS from "crypto-js";
import {
  ProtocolActions,
  ProtocolActionsTypes,
} from "../actions/protocolActions";
import { Block, ProtoBlock } from "../types";

export type LedgerState = number;

export type StateRootHashOnly = { stateRootHash: string };

export type StateRootOnly = {
  stateRoot: LedgerState;
};

export type FullStateRoot = StateRootHashOnly & StateRootOnly;

export type State = {
  identity?: string;
  validators: string[];
  currentBlockProducer?: string;
  blockPool: Block[];
  blocks: Block[];
};

export const initialState: State = {
  validators: [],
  blockPool: [],
  blocks: [],
};

export const hashBlock = (block: ProtoBlock) =>
  CryptoJS.SHA256(
    block.data + block.level + block.previousBlockHash
  ).toString();

const genesisBlock: Block = {
  data: 0,
  level: 0,
  previousBlockHash: "genesis",
  hash: CryptoJS.SHA256("00genesis").toString(),
  author: "to be replaced by genesis producer",
  signatures: [],
};

export const reducer = (state: State, action: ProtocolActionsTypes) => {
  const { validators, blocks } = state;
  switch (action.type) {
    case "PROTOCOL/SET_IDENTITY":
      return liftState({ ...state, identity: action.payload });
    case "PROTOCOL/ADD_VALIDATOR":
      return liftState({
        ...state,
        validators: [...state.validators, action.payload],
      });
    case "PROTOCOL/PRODUCE_GENESIS_BLOCK":
      // Gets the chain started by producing a default block
      // Currently wipes out entire chain state if run more than once!
      const newGenesisBlock = {
        ...genesisBlock,
        author: state.identity!,
        signatures: [state.identity!],
      };
      return loop(
        state,
        Cmd.action(ProtocolActions["PROTOCOL/PRODUCE_BLOCK"](newGenesisBlock))
      );
    case "PROTOCOL/PRODUCE_BLOCK": {
      return liftState({ ...state, blocks: [...state.blocks, action.payload] });
    }
    case "PROTOCOL/RECEIVE_BLOCK": {
      const receivedBlock = action.payload;
      // If blocks are empty and receiving genesis block
      // then accept it.
      if (state.blocks.length === 0) {
        if (receivedBlock.hash === genesisBlock.hash) {
          return loop(
            {
              ...state,
              blocks: [genesisBlock],
              currentBlockProducer: receivedBlock.author,
            },
            Cmd.action(
              ProtocolActions["PROTOCOL/SIGN_BLOCK"]({
                blockHash: genesisBlock.hash,
                signature: state.identity!,
              })
            )
          );
        } else {
          // If it's not the true genesis block, ignore
          return liftState(state);
        }
      } else {
        const currentBlock = blocks[blocks.length - 1];
        // Assert block integrity
        if (
          // - Block hash is valid
          receivedBlock.hash == hashBlock(receivedBlock) &&
          // - author is current validator
          receivedBlock.author == state.currentBlockProducer
        ) {
          if (
            // If the receivedBlock level is not the current
            // level, stash it away for later.
            receivedBlock.level !=
            currentBlock.level + 1
          ) {
            // if(
            // // - Block's previousBlockHash is the hash of current level
            // receivedBlock.previousBlockHash == currentBlock.hash
            // ) {
            // // Receive and sign the block
            // return loop(
            //   { ...state, blocks: [...state.blocks, receivedBlock] },
            //   Cmd.action(
            //     ProtocolActions["PROTOCOL/SIGN_BLOCK"]({
            //       blockHash: receivedBlock.hash,
            //       signature: state.identity!,
            //     })
            //   )
            // );
            // } else {
            //   liftState(state);
            // }
          } else {
          }
        } else {
          // Otherwise do nothing
          return liftState(state);
        }
        //  else if (receivedBlock.level > currentBlock.level) {
        //   liftState({
        //     ...state,
        //     blockPool: [...state.blockPool, receivedBlock],
        //   });
        // } else {
        //   // Otherwise do nothing
        //   return liftState(state);
        // }
      }
    }
    default:
      return liftState(state);
  }
};
