import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export function Counter({ 
  from = 0, 
  to, 
  prefix = '', 
  suffix = '',
  decimals = 0
}: { 
  from?: number; 
  to: number; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const motionVal = useMotionValue(from);
  const springVal = useSpring(motionVal, { 
    stiffness: 60, 
    damping: 20 
  });

  useEffect(() => {
    if (inView) {
      motionVal.set(to);
    }
  }, [inView, motionVal, to]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      if (ref.current) {
        let valStr = '';
        if (decimals > 0) {
          valStr = latest >= to - 0.05 ? to.toFixed(0) : latest.toFixed(decimals);
        } else {
          valStr = Math.round(latest).toString();
        }
        ref.current.textContent = `${prefix}${valStr}${suffix}`;
      }
    });
  }, [springVal, prefix, suffix, decimals, to]);

  const initialStr = decimals > 0 ? from.toFixed(decimals) : from.toString();
  return <span ref={ref} className="tabular-nums font-bold">{prefix}{initialStr}{suffix}</span>;
}
