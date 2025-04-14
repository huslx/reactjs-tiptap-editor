/* eslint-disable react/display-name */
import React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { Button, Tooltip, TooltipContent, TooltipTrigger, icons } from '@/components';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

export interface ActionMenuButtonProps {
  /** Icon name to display */
  icon?: any
  /** Button title text */
  title?: string
  /** Tooltip text */
  tooltip?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Keyboard shortcut keys */
  shortcutKeys?: string[]
  /** Button color */
  color?: string
  /** Click action handler */
  action?: ButtonViewReturnComponentProps['action']
  /** Active state checker */
  isActive?: ButtonViewReturnComponentProps['isActive']
  /** Whether to render as child */
  asChild?: boolean
}

const ActionMenuButton = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(
  ({ asChild, ...props }, ref) => {
    const Icon = icons[props.icon];
    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            className="h-[32px] min-w-24 overflow-hidden px-[5px]  py-0"
            disabled={props?.disabled}
            ref={ref}
            variant="ghost"
            {...props}
          >
            <div className="flex h-full items-center font-normal">
              {props?.title && (
                <div className="grow truncate text-left text-sm">
                  {props?.title}
                </div>
              )}

              {Icon && <Icon className="ml-1 size-3 shrink-0 text-zinc-500" />}
            </div>
          </Comp>
        </TooltipTrigger>

        <TooltipContent>
          <div className="flex max-w-24 flex-col items-center text-center">
            {props?.tooltip && <div>
              {props?.tooltip}
            </div>}

            <div className="flex">
              {!!props?.shortcutKeys?.length && <span>
                {getShortcutKeys(props?.shortcutKeys)}
              </span>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  },
);

export { ActionMenuButton };
