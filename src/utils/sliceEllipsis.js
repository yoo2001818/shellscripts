export default function sliceEllipsis(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '…';
}
