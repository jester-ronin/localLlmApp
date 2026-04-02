export default function extractAnswer(text: string) {
  const parts = text.split('</think>');
  if (parts.length > 1) {
    return parts.slice(1).join('</think>').trim(); 
  }
  return text.trim();
}