import { useCallback } from 'react';

import type { Editor } from '@tiptap/core';
import { isActive } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { BubbleMenu } from '@tiptap/react';
import type { GetReferenceClientRect } from 'tippy.js';
import { sticky } from 'tippy.js';

import { ActionButton, type ActionButtonProps, Separator } from '@/components';
import HighlightActionButton from '@/extensions/Highlight/components/HighlightActionButton';
import {
  type ShouldShowProps,
  isColumnGripSelected,
  isRowGripSelected,
} from '@/extensions/Table/utils';
import { useLocale } from '@/locales';

export interface TableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
  actions?: ActionButtonProps[];
}

function TableBubbleMenu({ editor, disabled, actions }: TableBubbleMenuProps) {
  const shouldColumnGripShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state) {
        return false;
      }

      return isColumnGripSelected({ editor, view, state, from: from || 0 });
    },
    [editor]
  );

  const shouldRowGripShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state || !from) {
        return false;
      }

      return isRowGripSelected({ editor, view, state, from });
    },
    [editor]
  );

  const shouldSelectionShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;

    // check content select length is not empty
    if ($from.pos === to) {
      return false;
    }

    return selection instanceof TextSelection;
  };

  const shouldActiveShow = ({ editor }: { editor: Editor }) => {
    return isActive(editor.view.state, 'table');
  };
  const shouldShow = (showProps: ShouldShowProps) => {
    return (
      shouldActiveShow(showProps) ||
      shouldColumnGripShow(showProps) ||
      shouldRowGripShow(showProps)
    ) && !shouldSelectionShow(showProps);
  };
  const { t } = useLocale();

  function onAddColumnBefore() {
    editor.chain().focus().addColumnBefore().run();
  }

  function onAddColumnAfter() {
    editor.chain().focus().addColumnAfter().run();
  }

  function onDeleteColumn() {
    editor.chain().focus().deleteColumn().run();
  }
  function onAddRowAbove() {
    editor.chain().focus().addRowBefore().run();
  }

  function onAddRowBelow() {
    editor.chain().focus().addRowAfter().run();
  }

  function onDeleteRow() {
    editor.chain().focus().deleteRow().run();
  }

  function onMergeCell() {
    editor.chain().focus().mergeCells().run();
  }
  function onSplitCell() {
    editor?.chain().focus().splitCell().run();
  }
  function onDeleteTable() {
    editor.chain().focus().deleteTable().run();
  }

  function onSetCellBackground(color: string) {
    editor.chain().focus().setTableCellBackground(color).run();
  }
  const getReferenceClientRect: GetReferenceClientRect = () => {
    const {
      view,
      state: {
        selection: { from },
      },
    } = editor;

    const node = view.domAtPos(from).node as HTMLElement;
    if (!node) {
      return new DOMRect(-1000, -1000, 0, 0);
    }

    const tableWrapper = node?.closest?.('.tableWrapper');
    if (!tableWrapper) {
      return new DOMRect(-1000, -1000, 0, 0);
    }

    const rect = tableWrapper.getBoundingClientRect();

    return rect;
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="table"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        maxWidth: 'auto',
        getReferenceClientRect,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      {disabled ? (
        <></>
      ) : (
        <div className="richtext-flex richtext-size-full richtext-min-w-32 richtext-flex-row richtext-items-center richtext-gap-0.5 richtext-rounded-lg !richtext-border richtext-border-border richtext-bg-background richtext-p-2 richtext-leading-none richtext-shadow-sm">
          {actions && (
            <>
              {actions.map((item, i) => (
                <ActionButton key={i}
                  {...item}
                />
              ))}

              <Separator
                className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
                orientation="vertical"
              />
            </>
          )}

          <ActionButton
            action={onAddColumnBefore}
            disabled={!editor?.can()?.addColumnBefore?.()}
            icon="BetweenHorizonalEnd"
            tooltip={t('editor.table.menu.insertColumnBefore')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onAddColumnAfter}
            disabled={!editor?.can()?.addColumnAfter?.()}
            icon="BetweenHorizonalStart"
            tooltip={t('editor.table.menu.insertColumnAfter')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onDeleteColumn}
            disabled={!editor?.can().deleteColumn?.()}
            icon="DeleteColumn"
            tooltip={t('editor.table.menu.deleteColumn')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <Separator
            className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
            orientation="vertical"
          />

          <ActionButton
            action={onAddRowAbove}
            disabled={!editor?.can().addRowBefore?.()}
            icon="BetweenVerticalEnd"
            tooltip={t('editor.table.menu.insertRowAbove')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onAddRowBelow}
            disabled={!editor?.can()?.addRowAfter?.()}
            icon="BetweenVerticalStart"
            tooltip={t('editor.table.menu.insertRowBelow')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onDeleteRow}
            disabled={!editor?.can()?.deleteRow?.()}
            icon="DeleteRow"
            tooltip={t('editor.table.menu.deleteRow')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <Separator
            className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
            orientation="vertical"
          />

          <ActionButton
            action={onMergeCell}
            disabled={!editor?.can()?.mergeCells?.()}
            icon="TableCellsMerge"
            tooltip={t('editor.table.menu.mergeCells')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onSplitCell}
            disabled={!editor?.can()?.splitCell?.()}
            icon="TableCellsSplit"
            tooltip={t('editor.table.menu.splitCells')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />

          <Separator
            className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
            orientation="vertical"
          />

          <HighlightActionButton
            action={onSetCellBackground}
            editor={editor}
            tooltip={t('editor.table.menu.setCellsBgColor')}
            tooltipOptions={{
              sideOffset: 15,
            }}
          />

          <ActionButton
            action={onDeleteTable}
            disabled={!editor?.can()?.deleteTable?.()}
            icon="Trash2"
            tooltip={t('editor.table.menu.deleteTable')}
            tooltip-options={{
              sideOffset: 15,
            }}
          />
        </div>
      )}
    </BubbleMenu>
  );
}

export { TableBubbleMenu };
