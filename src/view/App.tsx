import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { P2PActions } from "../actions/p2pActions";
import { useSelector } from "../store";

function useInput() {
  const [value, setValue] = useState("");
  const input = (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  );
  return [value, input];
}

function App() {
  const { p2p, protocol } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [connectID, connectInput] = useInput();
  console.log(p2p.connections);
  if (p2p.peer) {
    return (
      <div>
        <div>Your Network ID: {p2p.peer?.id}</div>
        <p>
          Enter an ID you want to connect to: {connectInput}{" "}
          <button
            onClick={() =>
              dispatch(
                P2PActions["P2P/CONNECT_PEER_REQUEST"](connectID as string)
              )
            }
          >
            Connect to Peer
          </button>
        </p>
        Connected Peers:
        <ul>
          {p2p.connections.map((peer, i) => (
            <li key={i}>{peer}</li>
          ))}
        </ul>
        Validators:
        <ul>
          {protocol.validators.map((validator, i) => (
            <li key={i}>{validator}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <button onClick={() => dispatch(P2PActions["P2P/INIT_REQUEST"]())}>
        Connect to Network
      </button>
    );
  }
}

export default App;
