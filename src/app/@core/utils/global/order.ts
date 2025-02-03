export function orderByField(value: Array<any>, field: any) { 
  if (value == null) {
  return null;
}
if (field.startsWith('-')) {
  field = field.substring(1);
  if (typeof value[field] === 'string' || value[field] instanceof String) {
    return [...value].sort((a, b) => b[field].localeCompare(a[field]));
  }
  return [...value].sort(
    (a, b) => sortAlphaNum(a[field], b[field]) /*b[field] - a[field]*/
  );
} else {
  if (typeof value[field] === 'string' || value[field] instanceof String) {
    return [...value].sort((a, b) => -b[field].localeCompare(a[field]));
  }
  return [...value].sort(
    (a, b) => sortAlphaNum(a[field], b[field]) /*a[field] - b[field]*/
  );
} }

// // must cast as any to set property on window
// const _global = (window /* browser */ || global /* node */) as any
// _global.s = orderByField;

function sortAlphaNum(a, b) {
  let reA = /[^a-zA-Z]/g;
let reN = /[^0-9]/g;
  let AInt = parseInt(a, 10);
  let BInt = parseInt(b, 10);

  if (isNaN(AInt) && isNaN(BInt)) {
    let aA = a.replace(reA, '');
    let bA = b.replace(reA, '');
    if (aA === bA) {
      let aN = parseInt(a.replace(reN, ''), 10);
      let bN = parseInt(b.replace(reN, ''), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  } else if (isNaN(AInt)) {
    // A is not an Int
    return 1;
    // to make alphanumeric sort first return -1 here
  } else if (isNaN(BInt)) {
    // B is not an Int
    return -1; // to make alphanumeric sort first return 1 here
  } else {
    return AInt > BInt ? 1 : -1;
  }
}