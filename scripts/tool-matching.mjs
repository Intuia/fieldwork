import registry from '../src/data/toolRegistry.json' with { type: 'json' };
export function matchTools(text) {
  return registry
    .filter((tool) =>
      tool.aliases.some((alias) => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|[^a-z0-9_])' + escaped + '(?=$|[^a-z0-9_])', 'i').test(text);
      }),
    )
    .map((tool) => tool.tool);
}
