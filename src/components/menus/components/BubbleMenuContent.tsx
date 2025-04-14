import { type PropsWithChildren } from 'react';

function BubbleMenuContent ({ children, vertical }: PropsWithChildren<{ vertical?:boolean }>) {
  return (
    <div className="pointer-events-auto w-auto select-none rounded-sm !border border-neutral-200 bg-background px-3 py-2 shadow-sm transition-all dark:border-neutral-800">
      <div
        className={`relative flex h-[26px] flex-nowrap items-center justify-start gap-[4px] whitespace-nowrap ${vertical ? 'h-max flex-col' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

export default BubbleMenuContent;