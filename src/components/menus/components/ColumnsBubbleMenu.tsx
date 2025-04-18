import { useCallback } from 'react';

import { BubbleMenu } from '@tiptap/react';
import { ActionButton } from '@/components/ActionButton';
import { deleteNode } from '@/utils/delete-node';
import { MultiColumn } from '@/extensions';
import { useLocale } from '@/locales';

export function ColumnsBubbleMenu({ editor }: any) {
  const { t } = useLocale();

  const shouldShow = useCallback(() => editor.isActive(MultiColumn.name), [editor]);
  const deleteMe = useCallback(() => deleteNode(MultiColumn.name, editor), [editor]);
  const addColBefore = useCallback(() => editor.chain().focus().addColBefore().run(), [editor]);
  const addColAfter = useCallback(() => editor.chain().focus().addColAfter().run(), [editor]);
  const deleteCol = useCallback(() => editor.chain().focus().deleteCol().run(), [editor]);

  return (
    <BubbleMenu
      pluginKey="columns-bubble-menu"
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        // onHidden: () => {
        //   toggleVisible(false)
        // },
      }}
    >
      <div className="w-auto px-3 py-2 transition-all !border rounded-sm shadow-sm pointer-events-auto select-none border-neutral-200 dark:border-neutral-800 bg-background">
        <ActionButton
          action={addColBefore}
          icon="ColumnAddLeft"
          tooltip={t('editor.table.menu.insertColumnBefore')}
        />
        <ActionButton
          action={addColAfter}
          icon="ColumnAddRight"
          tooltip={t('editor.table.menu.insertColumnAfter')}
        />
        <ActionButton
          action={deleteCol}
          icon="DeleteColumn"
          tooltip={t('editor.table.menu.deleteColumn')}
        />
        <ActionButton
          action={deleteMe}
          icon="Trash2"
          tooltip={t('editor.table.menu.delete_column')}
        />
      </div>
    </BubbleMenu>
  );
}
