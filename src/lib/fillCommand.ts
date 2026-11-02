// Replacement callbacks preserve literal dollars and never replace inserted values again.
export function getPlaceholders(command: string): string[] {
  return [
    ...new Set(Array.from(command.matchAll(/\{\{([a-zA-Z][\w]*)\}\}/g), (match) => match[1])),
  ];
}
export function commandParts(
  command: string,
  values: Record<string, string>,
): { text: string; unresolved: boolean }[] {
  return command.split(/(\{\{[a-zA-Z][\w]*\}\})/g).map((part) => {
    const match = /^\{\{([a-zA-Z][\w]*)\}\}$/.exec(part);
    if (match) {
      const value = values[match[1]];
      if (value) {
        return { text: value, unresolved: false };
      }
      return { text: part, unresolved: true };
    }
    return { text: part, unresolved: false };
  });
}
export function fillCommand(command: string, values: Record<string, string>): string {
  return commandParts(command, values)
    .map((part) => part.text)
    .join('');
}
