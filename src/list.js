
export const updateById = (value, set, list) => 
    list.map(item => (
        item.id === value ? { ...item, ...set(item) } : item
    ))