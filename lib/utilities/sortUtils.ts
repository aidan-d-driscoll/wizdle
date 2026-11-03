export function insertionSorted<Type>(list: Type[], key: (objA: Type, objB: Type) => number, reversed: boolean = false): Type[]{
    const newList = [...list]

    insertionSort(newList, key, reversed)

    return newList
}

export function insertionSort<Type>(list: Type[], key: (objA: Type, objB: Type) => number, reversed: boolean = false): void{
    if (!reversed){
        for (let i = 1; i < list.length; i++){
            let idx = i;
            while(idx > 0 && key(list[idx], list[idx-1]) > 0){
                const temp = list[idx]
                list[idx] = list[idx-1]
                list[idx-1] = temp
    
                idx--;
            }
        }
    }
    else {
        for (let i = 1; i < list.length; i++){
            let idx = i;
            while(idx > 0 && key(list[idx], list[idx-1]) < 0){
                const temp = list[idx]
                list[idx] = list[idx-1]
                list[idx-1] = temp
    
                idx--;
            }
        }
    }
}