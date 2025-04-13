import React from 'react';

import { DynamicIcon } from 'lucide-react/dynamic';

import { icons } from '@/components';

export interface IconComponentProps {
  name: string;
  className?: string;
  onClick?: React.MouseEventHandler<SVGElement>;
}

function IconComponent(props: IconComponentProps) {
  const Icon = icons[props.name];

  return Icon ? (
    <Icon
      className={`richtext-size-4 ${props?.className || ''}`}
      onClick={props?.onClick}
    />
  ) : (
    <DynamicIcon
      className={`richtext-size-4 ${props?.className || ''}`}
      name={props.name as any}
      onClick={props?.onClick}
    />
  );
}

export { IconComponent };
