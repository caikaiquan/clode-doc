export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map
  }, {})
}


export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}

export const findParentDom = (element, parentClass) => {
  while(element){
    if(element.classList.contains(parentClass)){
      return element
    }
    element = element.parentNode
  }
  return false
}