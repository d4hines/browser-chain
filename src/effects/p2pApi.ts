import Peer from "peerjs";

export const initialize = () : Promise<Peer> =>
  new Promise((res, rej) => {
    const peer = new Peer();
    peer.on("open", () => res(peer));
    peer.on("error", rej);
  });

export const connectToPeer = (
  peer: Peer,
  id: string,
  cb: (data: any) => void
): Promise<void> => {
  console.log("connectToPeer", peer, id);
  return new Promise((res, rej) => {
    const conn = peer.connect(id);
    conn.on("open", () => {
      console.log(id, "opened successfully");
      res();
    });
    conn.on("error", rej);
    conn.on("data", cb);
  });
};
