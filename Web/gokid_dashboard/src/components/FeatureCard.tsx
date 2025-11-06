import * as React from 'react';
import { cn } from '@/src/lib/utils';

interface IconProps {
  className?: string;
  [key: string]: any;
}

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactElement<IconProps>;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center space-x-4 space-x-reverse p-3 bg-white/30 backdrop-blur-md rounded-xl shadow-lg   transition-all duration-300 hover:scale-105 hover:shadow-xl group',
        className
      )}
      style={style}
      {...props}
    >
      <div className="w-12 h-12   flex items-center justify-center  group-hover:transition-all">
        {React.cloneElement(icon, {
          className: 'w-6 h-6 text-[#5c5163] group-hover:scale-110 transition-transform',
          'aria-hidden': 'true'
        })}
      </div>
      <div className="flex-1 text-right">
        <h3 className="font-semibold text-[#5c5163]">{title}</h3>
        <p className="text-xs text-[#9a87a4]">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
