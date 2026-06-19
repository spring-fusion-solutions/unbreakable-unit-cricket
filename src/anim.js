import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function useReveal(amount = 0.18) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount });
	return { ref, inView };
}

// Variants
export const fadeUp = {
	hidden:  { opacity: 0, y: 48 },
	show:    { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

export const fadeLeft = {
	hidden:  { opacity: 0, x: -60 },
	show:    { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

export const fadeRight = {
	hidden:  { opacity: 0, x: 60 },
	show:    { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

export const scaleIn = {
	hidden:  { opacity: 0, scale: 0.88 },
	show:    { opacity: 1, scale: 1,    transition: { duration: 0.55, ease: [0.22,1,0.36,1] } },
};

export const stagger = {
	hidden: {},
	show:   { transition: { staggerChildren: 0.1 } },
};
