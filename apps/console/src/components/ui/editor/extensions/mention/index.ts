import Mention from '@tiptap/extension-mention';

export const MentionExtension = Mention.configure({
  HTMLAttributes: {
    class: 'mention'
  },
  suggestion: {
    items: ({ query }) => {
      return [
        'User1',
        'User2',
        'User3',
        'User4',
        'User5',
        'User6',
        'User7',
        'User8',
        'User9',
        'User10'
      ]
        .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },
    render: () => {
      // Simplified version - would need a proper component in real implementation
      return {
        onStart: () => {},
        onUpdate: () => {},
        onKeyDown: () => false,
        onExit: () => {}
      };
    }
  }
});
