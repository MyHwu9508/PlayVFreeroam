//Generates an array of numbers, with each number representing a flag. Used with adding all activated flags together to get the total flag value.
export function generateFlagNumberArray(flagAmount: number) {
    const arr: number[] = [];
    for (let i = 0; i < flagAmount; i++) {
        arr.push(1 << i);
    }
    return arr;
}

//Generates an array of objects, with each object containing a title and a data value. Used with the menu to display the flag options.
export function generateFlagOptionArray(options: string[]) {
    const arr: { title: string; data: number }[] = [];
    for (let i = 0; i < options.length; i++) {
        arr.push({ title: options[i], data: 1 << i });
    }
    return arr;
}

//Generates an array of numbers, with each number representing a flag. The counterpart to generateFlagNumberArray. Generating all active flags for an flag value.
export function generateFlagValueArray(flag: number) {
    const arr: number[] = [];
    const maxBitsNeeded = Math.log2(flag) + 1;
    for (let i = 0; i < maxBitsNeeded; i++) {
        if ((flag & (1 << i)) != 0) {
            arr.push(1 << i);
        }
    }
    return arr;
}

//Generates the flag value for an array of indeces. Generating the flag value for all active flags.
export function generateFlagValueFromIndeces(indeces: number[]) {
    let flag = 0;
    for (let i = 0; i < indeces.length; i++) {
        flag += 1 << indeces[i];
    }
    return flag;
}

//Generates an array of indeces, with each index representing a flag.
export function generateFlagIndexArray(flag: number) {
    const arr: number[] = [];
    const maxBitsNeeded = Math.log2(flag) + 1;
    for (let i = 0; i < maxBitsNeeded; i++) {
        if ((flag & (1 << i)) != 0) {
            arr.push(i);
        }
    }
    return arr;
}
