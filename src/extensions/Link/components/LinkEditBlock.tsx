/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from 'react';

import { Button, IconComponent, Input, Label, Switch } from '@/components';
import { useLocale } from '@/locales';

interface IPropsLinkEditBlock {
  editor: any
  onSetLink: (link: string, text?: string, openInNewTab?: boolean) => void
}

function LinkEditBlock(props: IPropsLinkEditBlock) {
  const { t } = useLocale();

  const [form, setForm] = useState({
    text: '',
    link: '',
  });
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(false);

  useEffect(() => {
    if (props?.editor) {
      const { href: link, target } = props.editor?.getAttributes('link');

      const { from, to } = props.editor.state.selection;
      const text = props.editor.state.doc.textBetween(from, to, ' ');
      setForm({
        link,
        text,
      });
      setOpenInNewTab(target === '_blank');
    }
  }, [props?.editor]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(form.link, form.text, openInNewTab);
  }

  return (
    <div className="border-neutral-200 rounded-lg !border bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-black">
      <form className="flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <Label className="mb-[6px]">
          {t('editor.link.dialog.text')}
        </Label>

        <div className="mb-[10px] flex w-full max-w-sm items-center gap-1.5">
          <div className="relative w-full max-w-sm items-center">
            <Input
              className="w-80"
              onChange={e => setForm({ ...form, text: e.target.value })}
              placeholder="Text"
              required
              type="text"
              value={form.text}
            />
          </div>
        </div>

        <Label className="mb-[6px]">
          {t('editor.link.dialog.link')}
        </Label>

        <div className="flex w-full max-w-sm items-center gap-1.5">
          <div className="relative w-full max-w-sm items-center">
            <Input
              className="pl-10"
              onChange={e => setForm({ ...form, link: e.target.value })}
              required
              type="url"
              value={form.link}
            />

            <span className="absolute inset-y-0 start-0 flex items-center justify-center px-2">
              <IconComponent className="size-5 text-muted-foreground"
                name="Link"
              />
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Label>
            {t('editor.link.dialog.openInNewTab')}
          </Label>

          <Switch
            checked={openInNewTab}
            onCheckedChange={(e) => {
              setOpenInNewTab(e);
            }}
          />
        </div>

        <Button className="mt-2 self-end"
          type="submit"
        >
          {t('editor.link.dialog.button.apply')}
        </Button>
      </form>
    </div>
  );
}

export default LinkEditBlock;
