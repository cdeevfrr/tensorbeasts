import React from "react";

export interface Tile {
    opaque: boolean;
    walkable: boolean;
    image: React.JSX.Element
}