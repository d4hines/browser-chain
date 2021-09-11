export type ProtoBlock = {
    level: number,
    data: number
    previousBlockHash: string
    author: string
}
export type Block = ProtoBlock & {
    hash: string
    signatures: string[]
};
