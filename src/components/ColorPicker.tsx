import React, { useEffect, useMemo, useState } from 'react';

import { Plus } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import { Button, Input, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components';
import { NoFill } from '@/components/icons/NoFill';
import { COLORS_LIST as DEFAULT_COLORS_LIST } from '@/constants';
import { useLocale } from '@/locales';

export interface ColorPickerProps {
  highlight?: boolean
  disabled?: boolean
  colors?: string[]
  defaultColor?: string
  children: React.ReactNode
  onChange?: (color: string | undefined) => void
  setSelectedColor?: (color: string | undefined) => void
  selectedColor?: string
}

function ColorPicker(props: ColorPickerProps) {
  const { t } = useLocale();

  const {
    highlight = false,
    disabled = false,
    selectedColor,
    setSelectedColor,
    onChange,
    colors = DEFAULT_COLORS_LIST,
  } = props;

  const chunkedColors = useMemo(() => {
    const colorsArray = colors;
    const chunked: string[][] = [];
    for (let i = 0; i < colorsArray.length; i += 10) {
      chunked.push(colorsArray.slice(i, i + 10));
    }
    return chunked;
  }, [colors]);

  const [recentColorsStore, setRecentColorsStore] = useState<string[]>([]);

  const setRecentColor = (color: string) => {
    const newRecentColors = [...recentColorsStore];
    const index = newRecentColors.indexOf(color);
    if (index !== -1) {
      newRecentColors.splice(index, 1);
    }
    newRecentColors.unshift(color);
    if (newRecentColors.length > 10) {
      newRecentColors.pop();
    }
    setRecentColorsStore(newRecentColors);
  };

  function setColor(color: string | undefined) {
    if (color === undefined) {
      // clear color
      setSelectedColor?.(color);
      onChange?.(color);
      return;
    }
    // check if color is correct
    const isCorrectColor = /^#([\da-f]{3}){1,2}$/i.test(color);
    if (isCorrectColor) {
      setSelectedColor?.(color);
      onChange?.(color);
      setRecentColor(color);
    }
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild
        className="!p-0"
        disabled={disabled}
      >
        {props?.children}
      </PopoverTrigger>

      <PopoverContent align="start"
        className="size-full p-2"
        hideWhenDetached
        side="bottom"
      >
        <div className="flex flex-col">
          {highlight
            ? (
              <div
                className="rd-1 flex cursor-pointer items-center gap-[4px] p-1 hover:bg-accent"
                onClick={() => setColor(undefined)}
              >
                <NoFill />

                <span className="ml-1 text-sm">
                  {t('editor.nofill')}
                </span>
              </div>
            )
            : (
              <div
                className="rd-1 flex cursor-pointer items-center gap-[4px] p-1 hover:bg-accent"
                onClick={() => {
                  setColor(undefined);
                }}
              >
                <NoFill />

                <span className="ml-1 text-sm">
                  {t('editor.default')}
                </span>
              </div>
            )}

          {chunkedColors.map((items: string[], index: number) => {
            return (
              <span className="relative flex h-auto w-full p-0 last:pb-2"
                key={index}
              >
                {items.map((item: string, idx) => {
                  return (
                    <span
                      className="inline-block size-6 flex-[0_0_auto] cursor-pointer rounded-sm !border border-transparent p-0.5 hover:border-border hover:shadow-sm"
                      key={`sub-color-${idx}`}
                      onClick={() => setColor(item)}
                    >
                      <span
                        className="relative block size-[18px] rounded-[2px] border-transparent"
                        style={{
                          backgroundColor: item,
                        }}
                      >
                        {item === selectedColor
                          ? (
                            <svg
                              className="absolute -top-px left-px block size-3"
                              viewBox="0 0 18 18"
                              style={{
                                fill: 'rgb(255, 255, 255)',
                              }}
                            >
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                            </svg>
                          )
                          : (
                            <svg
                              viewBox="0 0 18 18"
                              style={{
                                fill: 'rgb(255, 255, 255)',
                                display: 'none',
                              }}
                            >
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                            </svg>
                          )}
                      </span>
                    </span>
                  );
                })}
              </span>
            );
          })}

          <div>
            <div className="my-1 text-sm">
              {t('editor.recent')}
            </div>

            <span className="relative flex h-auto w-full p-0 last:pb-2">
              {recentColorsStore?.map((item, index) => {
                return (
                  <span
                    className="inline-block size-6 flex-[0_0_auto] cursor-pointer rounded-sm !border border-transparent p-0.5 hover:border-border hover:shadow-sm"
                    key={`sub-color-recent-${index}`}
                    onClick={() => setColor(item)}
                  >
                    <span
                      className="relative block size-[18px] rounded-[2px] border-transparent"
                      style={{
                        backgroundColor: item,
                      }}
                    >
                      <svg
                        viewBox="0 0 18 18"
                        style={{
                          fill: 'rgb(255, 255, 255)',
                          display: 'none',
                        }}
                      >
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                      </svg>
                    </span>
                  </span>
                );
              })}
            </span>
          </div>

          <AddMoreColor setColor={setColor} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AddMoreColorProps {
  setColor: (color: string) => void
}

function AddMoreColor({ setColor }: AddMoreColorProps) {
  const [colorMore, setColorMore] = useState('#000000');
  const [openColorMore, setOpenColorMore] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    return () => {
      setOpenColorMore(false);
    };
  }, []);

  return (
    <Popover open={openColorMore}>
      <PopoverTrigger asChild>
        <div
          className="p-1.5 text-sm hover:cursor-pointer hover:bg-accent"
          onClick={(e) => {
            e.preventDefault();
            setOpenColorMore(true);
          }}
        >
          {t('editor.color.more')}
          ...
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex flex-col items-center justify-center">
          <HexColorPicker color={colorMore}
            onChange={setColorMore}
          />

          <Input
            className="mt-[8px] w-full"
            type="text"
            value={colorMore.slice(1)}
            onChange={(e) => {
              e.preventDefault();
              setColorMore(`#${e.target.value}`);
            }}
          />
        </div>

        <Separator className="my-[10px]" />

        <Button
          className="w-full"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setColor(colorMore);
            setOpenColorMore(false);
          }}
        >
          <Plus size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker };
