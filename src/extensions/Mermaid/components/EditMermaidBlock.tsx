/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
import mermaid from 'mermaid';
// @ts-ignore
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

interface IProps {
  editor: Editor, attrs?: any, extension?: any
}

const defaultCode = 'graph TB\na-->b';

export const EditMermaidBlock: React.FC<IProps> = ({ editor, attrs, extension }) => {
  const { alt, align } = attrs;
  const [mermaidCode, setMermaidCode] = useState(decodeURIComponent(alt ?? defaultCode));
  const [svgCode, setSvgCode] = useState('');
  const [visible, toggleVisible] = useState(false);
  const mermaidRef = useRef<HTMLElement | null>(null);

  const upload = extension?.options.upload;

  const renderMermaid = async (value: any) => {
    try {
      const { svg } = await mermaid.render('mermaid-svg', value);
      setSvgCode(svg);
    } catch {
      setSvgCode('');
    }
  };

  const mermaidInit = () => {
    mermaid.initialize({
      darkMode: false,
      startOnLoad: false,
      // fontFamily:'',
      fontSize: 12,
      theme: 'base',
    });
    renderMermaid(mermaidCode);
  };

  useEffect(() => {
    if (visible) {
      mermaidInit();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      renderMermaid(mermaidCode);
    }
  }, [mermaidCode]);

  const setMermaid = async () => {
    if (mermaidCode === '') {
      return;
    }
    if (mermaidCode) {
      const svg = mermaidRef.current!.querySelector('svg') as unknown as HTMLElement;
      const { width, height } = svg.getBoundingClientRect();
      const name = `mermaid-${shortId()}.svg`;
      // const { size } = new Blob([svg.outerHTML], {
      //   type: 'image/svg+xml',
      // })

      let src = svg64(svg.outerHTML);

      if (upload) {
        const file = dataURLtoFile(src, name);
        src = await upload(file);
      }

      editor
        ?.chain()
        .focus()
        .setMermaid(
          {
            type: 'mermaid',
            src,
            alt: encodeURIComponent(mermaidCode),
            width,
            height,
          },
          !!mermaidCode,
        )
        .run();
      editor?.commands.setAlignImageMermaid(align);
    }
    toggleVisible(false);
  };

  return (
    <Dialog
      onOpenChange={toggleVisible}
      open={visible}
    >
      <DialogTrigger asChild>
        <ActionButton
          action={() => toggleVisible(true)}
          icon="Pencil"
          tooltip="Edit Mermaid"
        />
      </DialogTrigger>

      <DialogContent className="z-[99999] !max-w-[1300px]">
        <DialogTitle>
          Edit Mermaid
        </DialogTitle>

        <div style={{ height: '100%', border: '1px solid hsl(var(--border))' }}>
          <div className="flex gap-[10px] rounded-[10px] p-[10px]">
            <Textarea
              autoFocus
              className="flex-1"
              defaultValue={defaultCode}
              onChange={e => setMermaidCode(e.target.value)}
              placeholder="Text"
              required
              rows={10}
              value={mermaidCode}
              style={{
                color: 'hsl(var(--foreground))',
              }}
            />

            <div
              className="flex flex-1 items-center justify-center rounded-[10px] p-[10px]"
              dangerouslySetInnerHTML={{ __html: svgCode }}
              ref={mermaidRef as any}
              style={{ height: '100%', border: '1px solid hsl(var(--border))', minHeight: 500, background: '#fff' }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={setMermaid}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
