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

import BubbleMenuContent from './BubbleMenuContent';

export interface TableBubbleMenuProps {
  editor: Editor;
  disabled?: boolean;
  actions?: ActionButtonProps[];
}

function TableRowBubbleMenu ({ editor, disabled }: TableBubbleMenuProps) {
  const { t } = useLocale();
  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state || !from) {
        return false;
      }

      return isRowGripSelected({ editor, view, state, from });
    },
    [editor]
  );
  function onAddRowAbove() {
    editor.chain().focus().addRowBefore().run();
  }

  function onAddRowBelow() {
    editor.chain().focus().addRowAfter().run();
  }

  function onDeleteRow() {
    editor.chain().focus().deleteRow().run();
  }
  if(disabled) {
    return null;
  }
  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableRowMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        placement: 'left',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
    >
      <BubbleMenuContent vertical>
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
      </BubbleMenuContent>
    </BubbleMenu>
  );
}

function TableColBubbleMenu({ editor, disabled }: TableBubbleMenuProps) {
  const { t } = useLocale();
  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state) {
        return false;
      }

      return isColumnGripSelected({ editor, view, state, from: from || 0 });
    },
    [editor]
  );

  function onAddColumnBefore() {
    editor.chain().focus().addColumnBefore().run();
  }

  function onAddColumnAfter() {
    editor.chain().focus().addColumnAfter().run();
  }

  function onDeleteColumn() {
    editor.chain().focus().deleteColumn().run();
  }

  if(disabled) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableColumnMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
    >
      <BubbleMenuContent>
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
      </BubbleMenuContent>
    </BubbleMenu>
  );
}

function TableMainBubbleMenu({ editor, disabled, actions }: TableBubbleMenuProps) {

  const shouldSelectionShow = ({ editor, view, state, from }: ShouldShowProps) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;

    // check content select length is not empty
    if ($from.pos === to) {
      return false;
    }

    if (!state || !from) {
      return false;
    }

    return (
      selection instanceof TextSelection ||
      isRowGripSelected({ editor, view, state, from }) ||
      isColumnGripSelected({ editor, view, state, from })
    );
  };

  const shouldActiveShow = ({ editor }: { editor: Editor }) => {
    return isActive(editor.view.state, 'table');
  };
  const shouldShow = (showProps: ShouldShowProps) => {
    return shouldActiveShow(showProps) && !shouldSelectionShow(showProps);
  };
  const { t } = useLocale();

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

  if(disabled) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="table"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        maxWidth: 'auto',
        getReferenceClientRect,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <BubbleMenuContent>
        {actions && (
          <>
            {actions.map((item, i) => (
              <ActionButton key={i}
                {...item}
              />
            ))}

            <Separator
              className="!mx-1 !my-2 !h-[16px]"
              orientation="vertical"
            />
          </>
        )}

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
          className="!mx-1 !my-2 !h-[16px]"
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
      </BubbleMenuContent>
    </BubbleMenu>
  );
}

function TableBubbleMenu(props: TableBubbleMenuProps) {
  return (
    <>
      <TableMainBubbleMenu {...props} />
      <TableRowBubbleMenu {...props} />
      <TableColBubbleMenu {...props} />
    </>
  );
}

export { TableBubbleMenu };
