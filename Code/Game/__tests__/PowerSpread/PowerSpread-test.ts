import { calculateAttack, PowerSpread } from "@/Game/Dungeon/PowerSpread"
import { matchToString } from "@/Game/Dungeon/PowerSpread"

it('Works with the example in comments', () => {
    const p: PowerSpread = {
        [matchToString({
            color: 3,
        })]: 1,
        [matchToString({
            color: 3,
            number: 2
        })]: .5,
        [matchToString({
            color: 3,
            shape: 4
        })]: 1.5,
    }

    const beast1 = {
        colors: [1]
    }
    const beast2 = {
        colors: [3],
        numbers: [1],
        shapes: [1],
    }
    const beast3 = {
        colors: [3],
        numbers: [2],
        shapes: [1],
    }
    const beast4 = {
        colors: [3],
        numbers: [2],
        shapes: [4],
    }
    expect(calculateAttack(p, beast1)[0].power).toBe(0)
    expect(calculateAttack(p, beast2)[0].power).toBe(1)
    expect(calculateAttack(p, beast3)[0].power).toBe(.5)
    expect(calculateAttack(p, beast4)[0].power).toBe(.75)

})

it('Handles beasts with multiple colors/shapes/numbers', () => {
    const p: PowerSpread = {
        [matchToString({
            color: 1,
        })]: 2,
        [matchToString({
            color: 2,
            number: 2
        })]: 3,
        [matchToString({
            color: 3,
            shape: 4
        })]: 5,
        [matchToString({
            color: 3,
            shape: 4,
            number: 5
        })]: 7,
    }

    expect(calculateAttack(p, {
        colors: [1, 2]
    })).toEqual([
        {match: {color: 1,}, power: 2},
        {match: {color: 2,}, power: 0}
    ])

    expect(calculateAttack(p, {
        colors: [1, 2],
        numbers: [1, 2]
    })).toEqual([
        {match: {color: 1, number: 1}, power: 2},
        {match: {color: 2, number: 1}, power: 0},
        {match: {color: 1, number: 2}, power: 2},
        {match: {color: 2, number: 2}, power: 3},
    ])

    expect(calculateAttack(p, {
        colors: [3],
        shapes: [4],
        numbers: [5, 6]
    })).toEqual([
        {match: {color: 3, number: 5, shape: 4}, power: 5 * 7},
        {match: {color: 3, number: 6, shape: 4}, power: 5},
    ])

})