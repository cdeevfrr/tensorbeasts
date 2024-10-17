
export interface Block {
    color: number,
    // If unmasked, is color shown?
    colorVisible?: boolean,
    shape: number,
    // if unmasked, is shape shown?
    shapeVisible?: boolean,
    number: number,
    // if unmasked, is number shown?
    numberVisible?: boolean,

    masked?: boolean
}