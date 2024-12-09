import { ReactNode } from "react";
import { Animated, DimensionValue, StyleSheet, View } from "react-native";


// The percentage overhang from a 3D grid when one block is on top of another block.
// Also, the offset down and right for the above block relative to the below block.
// Percent of block width, not container width (so, eg if each block is 10px and
// this const is 40, show 4px of the 'beneath' block.)
const threeDGridOverhang = 40
// The minimum percent margin allowed between grids (vertically or horizontally)
// in terms of percent of the overall parent container.
const minimumMargin = 2

// Helpful
const toPercentInterpolation = {
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
}

// Render the elements in a 5D arrangement.
// It's recommended to add about a 5% margin to your components, since
// it's not otherwise included.
export function FiveDContainer({
    elements,
    animationPercentage,
}:{
    elements: Array<{
        component: ReactNode, 
        location: Array<number>  | "up" | "right",
        location2?: Array<number>  | "up" | "right",
    }>,
    animationPercentage?: Animated.Value,
}){
    // Game plan:
    // 
    // We're gonna draw one of these things based on the dimensions used in the inputs:
    // 
    // 1:
    //    x
    //    x
    //    x
    //
    // 2:
    //  x x x
    //  x x x
    //  x x x
    //
    // 3:
    //  x x x   x x x   x x x
    //  x x x   x x x   x x x
    //  x x x   x x x   x x x
    //
    // 4:
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    // 
    // 5:
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //
    //
    // If location2s and an animationPercentage are included,
    // calculate each element's location&widths twice;
    // interpolate the values.
    // 

    if (elements.length === 0){
        throw new Error("Don't render this with no elements. I don't want to consider the edge cases.")
    }

    const sharedConstants1 = calculateSharedConstants(elements.map(e => e.location))

    // Sort by d4 so that things with higher values in the 4th dimension
    // are rendered last. 
    elements.sort((element1, element2) => {
        if (element1.location != "up" && element1.location != "right"
            && element2.location != "up" && element2.location != "right"
        ) {
            return element1.location[3] - element2.location[3]
        } else {
            return 0
        }
    })
    
    if (!animationPercentage){
        return <View style={styles.container}>
            {
            elements.map((element, index) => {
                const {top, left, width, height} = calculateScreenLocation({
                    location: element.location,
                    sharedMeasurements: sharedConstants1
                })
                return <View 
                style={StyleSheet.flatten([
                    styles.child, 
                    {
                        top: top + "%" as DimensionValue,
                        left: left + "%" as DimensionValue,
                        width: width + "%" as DimensionValue,
                        height: height + "%" as DimensionValue,
                    },
                ])}
                key={index}
                >
                    {element.component}
                </View>
            })}
        </View>
    } else {
        const sharedConstants2 = calculateSharedConstants(elements.map(e => (e.location2 || "up")))
        return <View style={styles.container}>
            {
            elements.map((element, index) => {
                const {top, left, width, height} = calculateScreenLocation({
                    location: element.location,
                    sharedMeasurements: sharedConstants1
                })
                const secondScreenLocation = calculateScreenLocation({
                    location: element.location2 || "up",
                    sharedMeasurements: sharedConstants2
                })
                return <Animated.View 
                    style={StyleSheet.flatten([
                        styles.child, 
                        {
                            top: animationPercentage.interpolate({
                                inputRange: [0, 1],
                                outputRange: [top, secondScreenLocation.top]
                            }).interpolate(toPercentInterpolation),
                            left: animationPercentage.interpolate({
                                inputRange: [0, 1],
                                outputRange: [left, secondScreenLocation.left]
                            }).interpolate(toPercentInterpolation),
                            width: animationPercentage.interpolate({
                                inputRange: [0, 1],
                                outputRange: [width, secondScreenLocation.width]
                            }).interpolate(toPercentInterpolation),
                            height: animationPercentage.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, secondScreenLocation.height]
                            }).interpolate(toPercentInterpolation),
                        },
                    ])}
                    key={index}
                    >
                        {element.component}
                </Animated.View>
            })}
        </View>
    }
}

function calculateSharedConstants(locations: Array< Array<number> | "up" | "right" >) {
    const mins = [Infinity,Infinity,Infinity,Infinity,Infinity]
    const maxes = [-Infinity,-Infinity,-Infinity,-Infinity,-Infinity]
    for (const location of locations) {
        for (const i of [0,1,2,3,4]){
            if (location && location != "up" && location != "right"){
                mins[i] = Math.min(mins[i], location[i])
                maxes[i] = Math.max(maxes[i], location[i])
            }
        }
    }

    for (const i of [0, 1, 2, 3, 4]){
        if (!isFinite(mins[i])){
            mins[i] = 0
        }
        if (!isFinite(maxes[i])){
            maxes[i] = 0
        }
    }

    const lengths = maxes.map((x, index) => {
        return x - mins[index] + 1
    })

    const ld1 = lengths[0]
    const ld2 = lengths[1]
    const ld3 = lengths[2]
    const ld4 = lengths[3]
    const ld5 = lengths[4]

    const bestFound = CalcMarginsAndWidths({
        d1: ld1,
        d2: ld2,
        d3: ld3,
        d4: ld4,
        d5: ld5,
    })

    const marginHorizontal = bestFound.marginHorizontal
    const marginVertical = bestFound.marginVertical
    const sharedWidth = bestFound.width


    const gridHeight = sharedWidth * ld1 + (ld4 - 1) * ( threeDGridOverhang / 100 ) * sharedWidth
    const gridLength = sharedWidth * ld2 + (ld4 - 1) * ( threeDGridOverhang / 100 ) * sharedWidth

    return {
        mins,
        maxes,
        lengths,
        sharedWidth,
        marginHorizontal,
        marginVertical,
        gridHeight,
        gridLength,
    }
}

function CalcMarginsAndWidths({
    d1,
    d2,
    d3,
    d4,
    d5,
}:{d1: number, d2: number, d3: number, d4: number, d5: number }){
    // Now, we need to solve for the width/height of a block, call it w.
    // The 5D case should show us all the variables we need, and the other
    // cases should happen by setting some variable values to 1.
    // 5:
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //
    // Call each of the 6 block-looking things above "grids".
    // Each grid is a 3d collection of 'blocks'.
    // one x is one block.
    // the intent is that the 'v's are 'x's hidden 'behind' another x, 
    //   and slightly smaller (to make it
    //   look 3d).
    // We'll make an equally spaced margin between grids, different for vertical/horizontal.
    //
    // 5:
    // m1     m1      m1       m1  m2
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //                             m2
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //                             m2
    //
    // We'll let di indicate the size of dimenison i. So if the locations are
    //  [0,0,0,0,0] and [0,0,0,2,0], then d4 is 3 and d1 = d2 = d3 = d5 = 1
    //
    // An intermediate value which will be useful is the grid size, 
    // the distance between m1s above, aka the distance from the first 'v' in a grid
    // to the end of the last x in that grid. Call this dg.
    //
    // With these numbers, we can write the formula for the whole length (100%)
    // 
    // length = m1 * (d3 + 1) + dg * d3
    // height = m2 * (d5 + 1) + dg * d5
    //
    // dg = EITHER:
    //        d2 * w + (d4 - 1) * 3dGridOverhang/100 * w
    //      OR:
    //        d1 * w + (d4 - 1) * 3dGridOverhang/100 * w
    // depending on whether we're looking at height or length.
    //
    // Substituting, we want to solve for w, m1, and m2. 
    //
    // 
    // 100% = m1 * (d3 + 1) + (d2 * w + (d4 - 1) * 3dGridOverhang/100 * w) * d3
    // 100% = m2 * (d5 + 1) + (d1 * w + (d4 - 1) * 3dGridOverhang/100 * w) * d5
    // Need to maximize w subject to m1, m2 >= 2
    // 
    //
    // 100% - m1 * (d3 + 1) = w(d3(d2  + (d4 - 1)* 3dGridOverhang/100))
    // w = (100% - m1 * (d3 + 1)) / (d3(d2  + (d4 - 1)* 3dGridOverhang/100))
    //
    // 100% - m2 * (d5 + 1) = w * (d5 ( d1  + (d4 - 1) * 3dGridOverhang/100 ) )
    // w = (100% - m2 * (d5 + 1)) / (d5 ( d1  + (d4 - 1) * 3dGridOverhang/100 ) )
    // 
    // So, we'll need to plug in m1 = 2 and m2 = 2; see which w falls out as smaller;
    // and then set that m value to 2. The other m value can be calculated 
    // once we have w.


    // w = (100% - m1 * (d3 + 1)) / (d3(d2  + (d4 - 1)* 3dGridOverhang/100))
    // w = (100% - m2 * (d5 + 1)) / (d5(d1  + (d4 - 1)* 3dGridOverhang/100))
    // 
    // setting m1 to minMargin
    const w1 = (100 - minimumMargin * (d3 + 1)) / (d3 * (d2 + (d4 - 1) * (threeDGridOverhang / 100)))
    const w2 = (100 - minimumMargin * (d5 + 1)) / (d5 * (d1 + (d4 - 1) * (threeDGridOverhang / 100)))
    if (w1 < w2) {
        // Solve for m2:
        // w = (100% - m2 * (d5 + 1)) / (d5(d1  + (d4 - 1)* 3dGridOverhang/100))
        // m2 = (w(d5(d1  + (d4 - 1)* 3dGridOverhang/100)) - 100) / (d5 + 1) * -1
        return {
            width: w1,
            marginHorizontal: minimumMargin,
            marginVertical: (w1 * (d5 * (d1  + (d4 - 1)* (threeDGridOverhang/100))) - 100) / (-d5 - 1)
        }
    } else {
        // Solve for m1:
        // w = (100% - m1 * (d3 + 1)) / (d3(d2  + (d4 - 1)* 3dGridOverhang/100))
        // m1 = (w * (d3 * (d2  + (d4 - 1)* 3dGridOverhang/100))) - 100) / (-d3 - 1)
        return {
            width: w2,
            marginHorizontal: (w2 * (d3 * (d2  + (d4 - 1)* threeDGridOverhang/100)) - 100) / (-d3 - 1),
            marginVertical: minimumMargin,
        }
    }
}


function calculateScreenLocation({
    location,
    sharedMeasurements,
}: {
    location: Array<number> | "right" | "up",
    sharedMeasurements: {
        mins: Array<number>,
        maxes: Array<number>,
        gridHeight: number,
        gridLength: number,
        sharedWidth: number,
        marginHorizontal: number,
        marginVertical: number,
    }
}): {top: number, left: number, width: number, height: number} {
    // Ok, now that we have w, m1, m2
    // we can solve for the left, top, width height of any given child element.
    //
    //5:
    // m1     m1      m1       m1  m2
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //                             m2
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //                             m2
    //
    // Width = height = w
    // Rescale d1, d2, d3, d4, d5 = di - min(di).
    // 
    // left = m1 + d3(m1 +gridLength) + d2 * w
    // top = m2 + d5(m2 + gridHeight) + d1 * w

    if (location === "right"){
        return {
            top: 50,
            left: 150,
            width: 0,
            height: 0,
        }
    }

    if (location === "up"){
        return {
            top: -150,
            left: 50,
            width: 0,
            height: 0,
        }
    }

    const d1 = location[0] - sharedMeasurements.mins[0]
    const d2 = location[1] - sharedMeasurements.mins[1]
    const d3 = location[2] - sharedMeasurements.mins[2]
    const d4 = location[3] - sharedMeasurements.mins[3]
    const d5 = location[4] - sharedMeasurements.mins[4]

    // For sending things 'backwards' into the screen
    const zScale = Math.pow(.95, d4)

    const left = 
        // Find the right grid left & right
        sharedMeasurements.marginHorizontal + d3 * (sharedMeasurements.marginHorizontal + sharedMeasurements.gridLength)
        // Go to your index in the grid
        + d2 * sharedMeasurements.sharedWidth 
        // Offset by 3DGridOverhang rightwards
        + d4 * sharedMeasurements.sharedWidth * threeDGridOverhang / 100
        // Offset for z scale width change (based on d4)
        +  (sharedMeasurements.sharedWidth * (1-zScale) / 2)
    const top = 
        // Find the right grid up & down
        // Vertically, d5 = 0 is the BOTTOM.
        sharedMeasurements.marginVertical + (sharedMeasurements.maxes[4] - location[4]) * (sharedMeasurements.marginVertical + sharedMeasurements.gridHeight) 
        // Go to your index in the grid
        // Vertically, d1 = 0 is the BOTTOM.
        + (sharedMeasurements.maxes[0] - location[0]) * sharedMeasurements.sharedWidth 
        // Offset by 3DGridOverhang downwards
        + d4 * sharedMeasurements.sharedWidth * threeDGridOverhang / 100
        // Offset for z scale width change (based on d4)
        + (sharedMeasurements.sharedWidth * (1-zScale) / 2)
    const width = (sharedMeasurements.sharedWidth * zScale)
    const height = (sharedMeasurements.sharedWidth * zScale)

    return {
        top,
        left,
        width,
        height,
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 5,
        position: 'relative',
        // backgroundColor: 'grey',
    },
    child: {
        position: 'absolute',
    }
})