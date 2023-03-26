export function req(name: string): never {
  throw new Error('Parameter "' + name + '" is required');
}
