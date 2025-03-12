interface GameColor {
    text: string,
    background: string,
    border: string,
}

export const GameColors = {
    1: {
        text: '#11181C',
        background: '#663399',
        border: '#16171b'
    } as GameColor,
    2: {
        text: '#11181C',
        background: '#3366ff',
        border: '#002080'
    } as GameColor,
    3: {
        text: '#11181C',
        background: '#990033',
        border: '#4d0019'
    } as GameColor,
    4: {
        text: '#11181C',
        background: '#00e64d',
        border: '#006622'
    } as GameColor,
    5: {
        text: '#11181C',
        background: '#ff9900',
        border: '#995c00'
    } as GameColor,
    default: {
        text: '#11181C',
        background: '#808080',
        border: '#0f0f0f'
    } as GameColor
}

export const maxColor = 5
export const maxShape = 5
export const maxNumber = 5