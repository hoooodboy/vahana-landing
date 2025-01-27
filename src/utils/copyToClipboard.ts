async function copyToClipboard(str: string) {
  return await navigator.clipboard.writeText(str);
}

export default copyToClipboard;
