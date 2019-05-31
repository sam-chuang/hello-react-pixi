
export const randomIntegerFromRange = (min, max) => 
    Math.floor(Math.random() * (max - min + 1) + min)

export const randomFloatFromRange = (min, max) => 
    Math.random() * (max - min) + min