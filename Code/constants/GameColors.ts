interface GameColor {
    text: string,
    background: string,
    border: string,
}

export const GameColors: {[key: string]: GameColor} = {
    1: {
        text: '#11181C',
        background: '#663399',
        border: '#16171b'
    },
    2: {
        text: '#11181C',
        background: '#3366ff',
        border: '#002080'
    },
    3: {
        text: '#11181C',
        background: '#990033',
        border: '#4d0019'
    },
    4: {
        text: '#11181C',
        background: '#00e64d',
        border: '#006622'
    },
    5: {
        text: '#11181C',
        background: '#ff9900',
        border: '#995c00'
    },
    default: {
        text: '#11181C',
        background: '#808080',
        border: '#0f0f0f'
    }
}

export const maxColor = 5
export const maxShape = 5
export const maxNumber = 5