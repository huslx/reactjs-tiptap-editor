/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';

import { Slot } from '@radix-ui/react-slot';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

import { Toggle, Tooltip, TooltipContent, TooltipTrigger, IconComponent as Icon } from '@/components';
import { cn } from '@/lib/utils';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

export interface ActionButtonProps {
  /* Icon name to display */
  icon?: string
  /* Button title */
  title?: string
  /* Tooltip text */
  tooltip?: string
  /* Whether the button is disabled */
  disabled?: boolean
  /* Keyboard shortcut keys */
  shortcutKeys?: string[]
  /* Custom CSS class */
  customClass?: string
  /* Loading state */
  loading?: boolean
  /* Tooltip options */
  tooltipOptions?: TooltipContentProps
  /* Button color */
  color?: string
  /* Click action handler */
  action?: ButtonViewReturnComponentProps['action']
  /* Active state checker */
  isActive?: ButtonViewReturnComponentProps['isActive']
  /* Child components */
  children?: React.ReactNode
  /* Whether to render as child */
  asChild?: boolean
  /* Whether it's an upload button */
  upload?: boolean
}

const ActionButton = React.forwardRef<HTMLButtonElement, Partial<ActionButtonProps>>(
  (props, ref) => {
    const {
      icon = undefined,
      // title = undefined,
      tooltip = undefined,
      disabled = false,
      customClass = '',
      // color = undefined,
      loading = undefined,
      shortcutKeys = undefined,
      tooltipOptions = {},
      action = undefined,
      isActive = undefined,
      children,
      asChild = false,
      upload = false,
      ...rest
    } = props;
    const Comp = asChild ? Slot : Toggle;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            data-state={isActive?.() ? 'on' : 'off'}
            onClick={action}
            ref={ref}
            size="sm"
            className={cn('richtext-w-[32px] richtext-h-[32px]', customClass)}
            // pressed={isActive?.() || false}
            disabled={disabled}
            {...(rest as Omit<typeof rest, 'loading'>)}
          >
            {icon && <Icon name={icon} className="richtext-size-4" />}
            {children}
          </Comp>
        </TooltipTrigger>

        {tooltip && (
          <TooltipContent {...tooltipOptions}>
            <div className="richtext-flex richtext-max-w-24 richtext-flex-col richtext-items-center richtext-text-center">
              <div>
                {tooltip}
              </div>

              {!!shortcutKeys?.length && <span>
                {getShortcutKeys(shortcutKeys)}
              </span>}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  },
);

export {
  ActionButton,
};
