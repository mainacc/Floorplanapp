const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

export function nanoid(length = 10) {
  let id = '';
  const n = alphabet.length;
  for (let i = 0; i < length; i += 1) {
    id += alphabet[Math.floor(Math.random() * n)];
  }
  return id;
}
