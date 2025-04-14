import { useCallback, useState } from 'react';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';

import { ActionButton } from '@/components/ActionButton';
import { Twitter } from '@/extensions';
import FormEditLinkTwitter from '@/extensions/Twitter/components/FormEditLinkTwitter';
import { useLocale } from '@/locales';
import { deleteNode } from '@/utils/delete-node';

export interface BubbleMenuTwitterProps {
  editor: Editor
  disabled?: boolean
}

function BubbleMenuTwitter({ editor, disabled }: BubbleMenuTwitterProps) {
  const [showEdit, setShowEdit] = useState(false);
  const { t } = useLocale();

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive(Twitter.name);
    return isActive;
  }, []);

  const onSetLink = (src: string) => {
    editor.commands.updateTweet({ src });
    setShowEdit(false);
  };

  const deleteMe = useCallback(() => deleteNode(Twitter.name, editor), [editor]);

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={shouldShow}
        tippyOptions={{
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
          placement: 'bottom-start',
          offset: [-2, 16],
          zIndex: 9999,
          onHidden: () => {
            setShowEdit(false);
          },
        }}
      >
        {disabled
          ? (
            <></>
          )
          : (
            <>
              {showEdit
                ? (
                  <FormEditLinkTwitter
                    editor={editor}
                    onSetLink={onSetLink}
                  />
                )
                : (
                  <div className="flex items-center gap-2 rounded-lg !border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-black">
                    <div className="flex flex-nowrap">
                      <ActionButton
                        icon="Pencil"
                        tooltip={t('editor.link.edit.tooltip')}
                        tooltipOptions={{ sideOffset: 15 }}
                        action={() => {
                          setShowEdit(true);
                        }}
                      />

                      <ActionButton
                        action={deleteMe}
                        icon="Trash"
                        tooltip={t('editor.delete')}
                        tooltipOptions={{ sideOffset: 15 }}
                      />
                    </div>
                  </div>
                )}
            </>
          )}
      </BubbleMenu>
    </>
  );
}

export { BubbleMenuTwitter };
