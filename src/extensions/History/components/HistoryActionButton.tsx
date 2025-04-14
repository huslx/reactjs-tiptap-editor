import React from 'react';

import type { TooltipContentProps } from '@radix-ui/react-tooltip';

import { Toggle, Tooltip, TooltipContent, TooltipTrigger, icons } from '@/components';
import type { ButtonViewReturnComponentProps } from '@/types';
import { getShortcutKeys } from '@/utils/plateform';

interface IPropsHistoryActionButton {
  icon?: string
  title?: string
  tooltip?: string
  disabled?: boolean
  shortcutKeys?: string[]
  customClass?: string
  loading?: boolean
  tooltipOptions?: TooltipContentProps
  color?: string
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
  children?: React.ReactNode
}

function HistoryActionButton(props?: Partial<IPropsHistoryActionButton>) {
  const {
    icon = undefined,
    // title = undefined,
    tooltip = undefined,
    // disabled = false,
    customClass = '',
    // color = undefined,
    // loading = false,
    // shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
    children,
  } = props as any;

  const Icon = icons[icon as string];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          className={`w-[32px] h-[32px] ${customClass}`}
          disabled={isActive?.()}
          onClick={action}
          // data-state={isActive?.() ? 'on' : 'off'}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {children && <>
            {children}
          </>}
        </Toggle>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent {...tooltipOptions}>
          <div className="flex flex-col items-center text-center max-w-24">
            <div>
              {tooltip}
            </div>
            {!!props?.shortcutKeys?.length && <span>
              {getShortcutKeys(props?.shortcutKeys)}
            </span>}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export default HistoryActionButton;
