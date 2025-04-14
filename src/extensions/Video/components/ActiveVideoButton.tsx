import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton, Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Video } from '@/extensions/Video/Video';
import { useLocale } from '@/locales';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

function checkIsVideo(url: string) {
  return /\.(?:mp4|webm|ogg|mov)$/i.test(url);
}

function ActionVideoButton(props: any) {
  const { t } = useLocale();

  const [link, setLink] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);

  const handleUploadVideo = (evt: any) => {
    setOpen(evt.detail);
  };

  useEffect(() => {
    const rm1 = listenEvent(EVENTS.UPLOAD_VIDEO(props.editor.id), handleUploadVideo);

    return () => {
      rm1();
    };
  }, []);

  const uploadOptions = useMemo(() => {
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === Video.name,
    )?.options;

    return uploadOptions;
  }, [props.editor]);

  async function handleFile(event: any) {
    const files = event?.target?.files;
    if (!props.editor || props.editor.isDestroyed || files.length === 0) {
      return;
    }
    const file = files[0];

    let src = '';
    if (uploadOptions.upload) {
      src = await uploadOptions.upload(file);
    } else {
      src = URL.createObjectURL(file);
    }

    props.editor
      .chain()
      .focus()
      .setVideo({
        src,
        width: '100%',
      })
      .run();
    setOpen(false);
  }
  function handleLink(e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (!link) {
      return;
    }

    props.editor
      .chain()
      .focus()
      .setVideo({
        src: link,
        width: '100%',
      })
      .run();
    setOpen(false);
  }

  function handleClick(e: any) {
    e.preventDefault();
    fileInput.current?.click();
  }

  return (
    <Dialog onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <ActionButton
          action={() => setOpen(true)}
          icon={props.icon}
          tooltip={props.tooltip}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          {t('editor.video.dialog.title')}
        </DialogTitle>

        <Tabs
          activationMode="manual"
          defaultValue={
            (uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'upload') ? 'upload' : 'link'
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            {(uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'upload') && (
              <TabsTrigger value="upload">
                {t('editor.video.dialog.tab.upload')}
              </TabsTrigger>
            )}

            {(uploadOptions?.resourceVideo === 'both' || uploadOptions?.resourceVideo === 'link') && (
              <TabsTrigger value="link">
                {t('editor.video.dialog.link')}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="upload">
            <div className="flex items-center gap-[10px]">
              <Button className="mt-1 w-full"
                onClick={handleClick}
                size="sm"
              >
                {t('editor.video.dialog.tab.upload')}
              </Button>
            </div>

            <input
              accept="video/*"
              multiple
              onChange={handleFile}
              ref={fileInput}
              type="file"
              style={{
                display: 'none',
              }}
            />
          </TabsContent>

          <TabsContent value="link">
            <form onSubmit={handleLink}>
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder={t('editor.video.dialog.placeholder')}
                  required
                  type="url"
                  value={link}
                  onChange={(e) => {
                    const url = e.target.value;

                    const isVideoUrl = checkIsVideo(url);

                    if (!isVideoUrl) {
                      setError('Invalid video URL');
                      setLink('');
                      return;
                    }
                    setError('');
                    setLink(url);
                  }}
                />

                <Button type="submit">
                  {t('editor.video.dialog.button.apply')}
                </Button>
              </div>
            </form>

            {error && <div className="my-[5px] text-red-500">
              {error}
            </div>}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ActionVideoButton;
