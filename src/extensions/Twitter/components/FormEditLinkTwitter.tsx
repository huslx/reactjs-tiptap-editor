/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from 'react';

import { Button, Input, Label } from '@/components';
import { Twitter } from '@/extensions/Twitter/Twitter';
import { useLocale } from '@/locales';

interface IPropsFormEditLinkTwitter {
  editor: any
  onSetLink: (src: string) => void
}

function FormEditLinkTwitter(props: IPropsFormEditLinkTwitter) {
  const { t } = useLocale();

  const [src, setSrc] = useState('');

  useEffect(() => {
    if (props?.editor) {
      const { src: srcInit } = props.editor?.getAttributes(Twitter.name);

      if (srcInit) {
        setSrc(srcInit);
      }
    }
  }, [props?.editor]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(src);
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
              onChange={e => setSrc(e.target.value)}
              placeholder="Text"
              required
              type="text"
              value={src}
            />
          </div>
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

export default FormEditLinkTwitter;
