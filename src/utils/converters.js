export function convertBytes(bytes, decimalPlaces = 2) {
  let bytes_fl = parseFloat(bytes);
  let pb = bytes_fl / 10 ** 15;
  let tb = bytes_fl / 10 ** 12;
  let gb = bytes_fl / 10 ** 9;
  let mb = bytes_fl / 10 ** 6;
  let kb = bytes_fl / 10 ** 3;
  if (kb < 1) {
    return `${parseFloat(bytes_fl.toFixed(decimalPlaces))} B`;
  } else if (mb < 1) {
    return `${parseFloat(kb.toFixed(decimalPlaces))} KB`;
  } else if (gb < 1) {
    return `${parseFloat(mb.toFixed(decimalPlaces))} MB`;
  } else if (tb < 1) {
    return `${parseFloat(gb.toFixed(decimalPlaces))} GB`;
  } else if (pb < 1) {
    return `${parseFloat(tb.toFixed(decimalPlaces))} TB`;
  } else {
    return `${parseFloat(pb.toFixed(decimalPlaces))} PB`;
  }
}
