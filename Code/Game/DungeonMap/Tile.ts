import React from "react";

export interface Tile {
    opaque: boolean;
    walkable: boolean;
    // Make this a function so that someome that just wants to know if it's opaque or not
    // doesn't need to load the whole image.
    image: () => React.JSX.Element
}