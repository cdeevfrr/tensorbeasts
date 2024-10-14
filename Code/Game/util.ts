

export function randInt({
    min, 
    maxExclusive
}: {
    min: number,
    maxExclusive: number,
}) {
    return Math.floor((Math.random() * (maxExclusive - min))) + min
}

