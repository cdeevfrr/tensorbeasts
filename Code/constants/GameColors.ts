interface GameColor {
    text: string,
    background: string,
    border: string,
}

export const GameColors: {[key: string]: GameColor} = {
    1: {
        text: '#11181C',
        background: '#fff',
        border: '#1050f0'
    },
    2: {
        text: '#11181C',
        background: '#0ff',
        border: '#f05010'
    },
    default: {
        text: '#11181C',
        background: '#020',
        border: '#f0f0f0'
    }
}