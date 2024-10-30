import { ReactNode } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";


// The percentage overhang from a 3D grid when one block is on top of another block.
// Also, the offset down and right for the above block relative to the below block.
// Percent of block width, not container width (so, eg if each block is 10px and
// this const is 40, show 4px of the 'beneath' block.)
const threeDGridOverhang = 40
// The minimum percent margin allowed between grids (vertically or horizontally)
// in terms of percent of the overall parent container.
const minimumMargin = 2

// Render the elements in a 5D arrangement.
// It's recommended to add about a 5% margin to your components, since
// it's not otherwise included.
export function FiveDContainer({
    elements
}:{
    elements: Array<{
        component: ReactNode, 
        location: Array<number>,
        location2?: Array<number>,
        animationPercentage?: number,
    }>
}){
    // Game plan:
    // Figure out how many dimensions/items there are in each dimension.
    // Use that to calculate absolute locations (in terms of percentages).
    // 
    // 1:
    //    x
    //    x
    //    x

    // 2:
    //  x x x
    //  x x x
    //  x x x

    // 3:
    //  x x x   x x x   x x x
    //  x x x   x x x   x x x
    //  x x x   x x x   x x x

    // 4:
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x

    // 5:
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x
    //
    //  x x x   vxvxvx   x x x
    //  vxvxvx  vxvxvx   xvxvx
    //  x x x   vxvxvx   x x x

    if (elements.length === 0){
        throw new Error("Don't render this with no elements. I don't want to consider the edge cases.")
    }

    const mins = [Infinity,Infinity,Infinity,Infinity,Infinity]
    const maxes = [-Infinity,-Infinity,-Infinity,-Infinity,-Infinity]
    for (const element of elements) {
        const location  = element.location
        for (const i of [0,1,2,3,4]){
            // TODO: Take into account location2 dimesions here.
            mins[i] = Math.min(mins[i], location[i])
            maxes[i] = Math.max(maxes[i], location[i])
        }
    }
    const lengths = maxes.map((x, index) => {
        return x - mins[index] + 1
    })

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

    const ld1 = lengths[0]
    const ld2 = lengths[1]
    const ld3 = lengths[2]
    const ld4 = lengths[3]
    const ld5 = lengths[4]

    const bestFound = solveWM1M2({
        d1: ld1,
        d2: ld2,
        d3: ld3,
        d4: ld4,
        d5: ld5,
    })

    console.log("Using margins " + JSON.stringify(bestFound))

    const m1 = bestFound.m1
    const m2 = bestFound.m2
    const w = bestFound.w


    const gridHeight = w * ld1 + (ld4 - 1) * ( threeDGridOverhang / 100 ) * w
    const gridLength = w * ld2 + (ld4 - 1) * ( threeDGridOverhang / 100 ) * w

    // Sort by d4 so that things with higher values in the 4th dimension
    // are rendered last.
    elements.sort((element1, element2) => {
        return element1.location[3] - element2.location[3]
    })

    return <View style={styles.container}>
        {
        elements.map((element, index) => {
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

            const d1 = element.location[0] - mins[0]
            const d2 = element.location[1] - mins[1]
            const d3 = element.location[2] - mins[2]
            const d4 = element.location[3] - mins[3]
            const d5 = element.location[4] - mins[4]

            // For sending things 'backwards' into the screen
            const zScale = Math.pow(.95, d4)

            const left = 
                // Find the right grid left & right
                m1 + d3 * (m1 + gridLength)
                // Go to your index in the grid
                + d2 * w 
                // Offset by 3DGridOverhang rightwards
                + d4 * w * threeDGridOverhang / 100
                // Offset for z scale width change
                +  (w * (1-zScale) / 2)
                // Convert to string & tell typescript it's a percentage.
                +  "%" as DimensionValue
            const top = 
                // Find the right grid up & down
                m2 + d5 * (m2 + gridHeight) 
                // Go to your index in the grid
                + d1 * w 
                // Offset by 3DGridOverhang downwards
                + d4 * w * threeDGridOverhang / 100
                // Offset for z scale width change
                + (w * (1-zScale) / 2)
                // Convert to string & tell typescript it's a percentage.
                + "%" as DimensionValue
            const width = (w * zScale) + "%" as DimensionValue
            const height = (w * zScale) + "%" as DimensionValue

            console.log(JSON.stringify({
                d1,d2,d3,d4,d5
            }))
            console.log(JSON.stringify({
                gridHeight,
                gridOffset: m2 + d5 * (m2 + gridHeight) ,
                indexOffset: d1 * w ,
                fourDOffset: d4 * w * threeDGridOverhang,
                fourDRescaleOffset: (w * (1-zScale) / 2),
            }))
            console.log(JSON.stringify({
                left, 
                top,
                width,
                height,
            }))

            return <View 
              style={StyleSheet.flatten([
                styles.child, 
                {
                    top,
                    left,
                    width,
                    height,
                },
              ])}
              key={JSON.stringify(element.location)}
            >
                {element.component}
            </View>
        })}
    </View>
}

function solveWM1M2({
    d1,
    d2,
    d3,
    d4,
    d5,
}:{d1: number, d2: number, d3: number, d4: number, d5: number }){
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
            w: w1,
            m1: minimumMargin,
            m2: (w1 * (d5 * (d1  + (d4 - 1)* (threeDGridOverhang/100))) - 100) / (-d5 - 1)
        }
    } else {
        // Solve for m1:
        // w = (100% - m1 * (d3 + 1)) / (d3(d2  + (d4 - 1)* 3dGridOverhang/100))
        // m1 = (w * (d3 * (d2  + (d4 - 1)* 3dGridOverhang/100))) - 100) / (-d3 - 1)
        return {
            w: w2,
            m1: (w2 * (d3 * (d2  + (d4 - 1)* threeDGridOverhang/100)) - 100) / (-d3 - 1),
            m2: minimumMargin,
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 100,
        position: 'relative',
        width: '90%',
        height: '90%',
        backgroundColor: 'grey',
    },
    child: {
        backgroundColor: 'yellow',
        position: 'absolute',
    }
})