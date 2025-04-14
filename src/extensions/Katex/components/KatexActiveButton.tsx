import { useCallback, useEffect, useMemo, useState } from 'react';

import katex from 'katex';
import { HelpCircle } from 'lucide-react';

import { ActionButton, Button, Label, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { Textarea } from '@/components/ui/textarea';
import type { IKatexAttrs } from '@/extensions/Katex/Katex';
import { Katex } from '@/extensions/Katex/Katex';
import { useAttributes } from '@/hooks/useAttributes';
import { useLocale } from '@/locales';

function KatexActiveButton({ editor, ...props }: any) {
  const { t } = useLocale();

  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  });
  const { text, defaultShowPicker } = attrs;

  const [currentValue, setCurrentValue] = useState('');

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run();
    setCurrentValue('');
  }, [editor, currentValue]);

  useEffect(() => {
    if (defaultShowPicker) {
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker]);

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
          <span contentEditable={false}
            dangerouslySetInnerHTML={{ __html: formatText || '' }}
          >
          </span>
        );
      }

      return null;
    },
    [currentValue, formatText],
  );

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <ActionButton
          icon={props?.icon}
          tooltip={props?.tooltip}
        />
      </PopoverTrigger>

      <PopoverContent align="start"
        className="size-full p-2"
        hideWhenDetached
        side="bottom"
      >
        <Label className="mb-[6px]">
          {t('editor.formula.dialog.text')}
        </Label>

        <div className="mb-[16px] flex w-full max-w-sm items-center gap-1.5">
          <div className="relative w-full max-w-sm">
            <Textarea
              autoFocus
              className="w-full"
              defaultValue={text}
              onChange={e => setCurrentValue(e.target.value)}
              placeholder="Text"
              required
              rows={3}
              value={currentValue}
            />
          </div>
        </div>

        {previewContent && (
          <div className="my-[10px] max-w-[286px] overflow-auto whitespace-nowrap rounded-[6px] !border p-[10px]">
            {previewContent}
          </div>
        )}

        <div className="flex items-center justify-between gap-[6px]">
          <Button className="flex-1"
            onClick={submit}
          >
            Submit
          </Button>

          <a href="https://katex.org/docs/supported"
            rel="noreferrer noopener"
            target="_blank"
          >
            <HelpCircle size={16} />
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default KatexActiveButton;
