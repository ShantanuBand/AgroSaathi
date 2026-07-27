import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format = (v) => v.toString(), className }: AnimatedNumberProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => format(Math.round(current)));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    spring.set(value);
    setIsReady(true);
  }, [value, spring]);

  if (!isReady) {
    return <span className={className}>{format(value)}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
