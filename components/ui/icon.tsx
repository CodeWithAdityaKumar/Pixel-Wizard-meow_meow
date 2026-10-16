import type { ReactNode, SVGProps } from 'react';

export type IconName = 'spark' | 'arrow' | 'home' | 'complaint' | 'meal' | 'notice' | 'search' | 'close' | 'check' | 'clock' | 'room' | 'pulse' | 'plus' | 'chevron';

const paths: Record<IconName, ReactNode> = {
  spark: <path d="m12 2 1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9L12 2Z" />,
  arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
  home: <path d="m3 10 9-7 9 7v10H3V10Zm6 10v-6h6v6" />,
  complaint: <path d="M5 4h14v12H8l-4 4V4h1Zm4 5h6m-6 3h4" />,
  meal: <path d="M5 3v8m3-8v8M5 7h3M6.5 11v10M15 3v18m0-18c3 1 4 3.5 4 6v2h-4" />,
  notice: <path d="M4 5h16v14H4V5Zm3 4h10M7 13h6M7 16h4" />,
  search: <path d="m20 20-4.6-4.6m2.1-5.1a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0Z" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2" />,
  room: <path d="M4 20V5h13a3 3 0 0 1 3 3v12M4 11h14M8 15h3m-3 3h6" />,
  pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="m8 10 4 4 4-4" />,
};

export function Icon({ name, size = 18, strokeWidth = 1.8, ...props }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}
