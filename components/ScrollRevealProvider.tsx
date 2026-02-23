'use client';
import { useScrollReveal } from './useScrollReveal';

export default function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
