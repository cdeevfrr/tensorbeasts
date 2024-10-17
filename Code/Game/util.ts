

export function randInt({
    min, 
    maxExclusive
}: {
    min: number,
    maxExclusive: number,
}) {
    return Math.floor((Math.random() * (maxExclusive - min))) + min
}

export function randChoice<T>({
    array,
    probabilities
}:{
    array: Array<T>,
    probabilities?: Array<number>
}): T {
    if (!probabilities){
        probabilities = array.map(() => 1)
    }
    if (probabilities.length != array.length || array.length < 1){
        throw new Error("Cannot choose from these args:" + JSON.stringify({array, probabilities}))
    }
    const sum = probabilities.reduce((a, b) => a+b, 0)
    const choice = Math.random() * sum
    let index = 0;
    let partialSum = 0;
    while (partialSum < choice){
        partialSum += probabilities[index];
        index += 1
    }
    return array[index-1]
}

// Copied from 
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// Standard Normal variate using Box-Muller transform.
export function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

