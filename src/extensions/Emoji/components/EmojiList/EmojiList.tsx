/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import clsx from 'clsx';
import scrollIntoView from 'scroll-into-view-if-needed';

import { useLocale } from '@/locales';

interface IProps {
  items: Array<{ name: string, emoji: string, fallbackImage?: string }>
  command: any
}

export const EmojiList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container: any = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLocale();

  const selectItem = (index: any) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useEffect(() => {
    if (Number.isNaN(selectedIndex + 1))
      return;
    const el = $container.current.querySelector(`span:nth-of-type(${selectedIndex + 1})`);
    el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="max-h-[320px] w-[200px] overflow-y-auto overflow-x-hidden rounded-sm !border bg-popover p-1 text-popover-foreground shadow-md outline-none">
      <div ref={$container}>
        {props.items.length > 0
          ? (
            props.items.map((item, index) => (
              <span
                className={clsx(' relative flex  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent  focus:text-accent-foreground', index === selectedIndex ? 'bg-accent' : '')}
                key={`emoji-list-code-${index}`}
                onClick={() => selectItem(index)}
              >
                {item.fallbackImage ? <img className="size-[1em]"
                  src={item.fallbackImage}
                /> : item.emoji}
                :

                {item.name}
                :
              </span>
            ))
          )
          : (
            <div className="relative flex  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors">
              <span>
                {t('no_result_found')}
              </span>
            </div>
          )}
      </div>
    </div>
  );
});

EmojiList.displayName = 'EmojiList';
