import { Options } from 'rehype-pretty-code';

export const rehypePrettyCodeOptions: Options = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },

  keepBackground: false,

  defaultLang: 'txt',

  onVisitLine(node) {
    // Prevent empty lines from collapsing
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },

  onVisitHighlightedLine(node) {
    node.properties.className?.push('line--highlighted');
  },

  onVisitHighlightedChars(node) {
    node.properties.className = ['word--highlighted'];
  },
};
