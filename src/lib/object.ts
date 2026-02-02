export const isObjectEqual = <T,>(first: T, second: T): boolean => {
    return JSON.stringify(first) === JSON.stringify(second)
}