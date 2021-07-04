export default function (text: string, length: number): string {
  if (text.length <= length) {
    return text;
  } else {
    return text.slice(0, length - 3) + "...";
  }
}
