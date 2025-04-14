import { BubbleMenu } from '@tiptap/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HelpCircle, Pencil, Trash2 } from 'lucide-react';
import katex from 'katex';
import { Katex } from '@/extensions';
import { deleteNode } from '@/utils/delete-node';
import { useAttributes } from '@/hooks/useAttributes';
import type { IKatexAttrs } from '@/extensions/Katex';
import { Textarea } from '@/components/ui/textarea';
import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';

function BubbleMenuKatex({ editor, ...props }: any) {
  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  });
  const { text, defaultShowPicker } = attrs;

  const [currentValue, setCurrentValue] = useState('');
  const [visible, toggleVisible] = useState(false);

  const shouldShow = useCallback(() => editor.isActive(Katex.name), [editor]);

  const deleteMe = useCallback(() => deleteNode(Katex.name, editor), [editor]);

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run();
    toggleVisible(false);
  }, [editor, currentValue]);

  useEffect(() => {
    if (defaultShowPicker) {
      toggleVisible(true);
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker, toggleVisible]);

  useEffect(() => {
    if (visible)
      setCurrentValue(text || '');
  }, [visible]);

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${currentValue}`);
    } catch {
      return currentValue;
    }
  }, [currentValue]);

  const previewContent = useMemo(
    () => {
      if (`${currentValue}`.trim()) {
        return (
          <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText || '' }}></span>
        );
      }

      return null;
    },
    [currentValue, formatText],
  );

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="Katex-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        onHidden: () => {
          toggleVisible(false);
        },
      }}
    >
      {props?.disabled
        ? (
          <></>
        )
        : (
          <div className="p-2 bg-white !border rounded-lg shadow-sm dark:bg-black border-neutral-200 dark:border-neutral-800">
            {visible
              ? (
                <>
                  <Textarea
                    value={currentValue}
                    onChange={e => setCurrentValue(e.target.value)}
                    autoFocus
                    placeholder="Formula text"
                    rows={3}
                    defaultValue={text}
                    style={{ marginBottom: 8 }}
                  />

                  {previewContent && (
                    <div className="my-[10px] p-[10px] rounded-[6px] !border-[1px] whitespace-nowrap overflow-auto">
                      {previewContent}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-[6px]">
                    <Button onClick={submit} className="flex-1">
                      Submit
                    </Button>

                    <a href="https://katex.org/docs/supported" target="_blank" rel="noreferrer noopener">
                      <HelpCircle size={16} />
                    </a>
                  </div>
                </>
              )
              : (
                <div className="flex items-center justify-center gap-[6px]">
                  <ActionButton tooltip="Edit" action={() => toggleVisible(!visible)}>
                    <Pencil size={16} />
                  </ActionButton>

                  <ActionButton tooltip="Delete" action={deleteMe}>
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              )}
          </div>
        )}

    </BubbleMenu>
  );
}

export default BubbleMenuKatex;
