export function insertionSorted<T>(list: T[], key: (objA: T) => number): T[]{
    const newList = [...list]

    for (let i = 1; i < newList.length; i++){
        let idx = i;
        while(idx > 0 && key(newList[idx]) < key(newList[idx-1])){
            const temp = newList[idx]
            newList[idx] = newList[idx-1]
            newList[idx-1] = temp

            idx--;
        }
    }

    return newList
}