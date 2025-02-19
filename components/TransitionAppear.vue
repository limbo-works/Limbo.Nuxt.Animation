<template>
	<Component :is="tag" ref="target" :class="[...classes]">
		<slot></slot>
	</Component>
</template>

<script setup>
const props = defineProps({
	name: {
		type: String,
		required: true,
	},

	tag: {
		type: String,
		default: 'div',
	},

	axis: {
		type: String,
		default: 'block',
		validator: (v) => ['block', 'inline'].includes(v),
	},

	/** IntersectionObserver options */
	rootMargin: String,
	threshold: Number,

	/** Transition options */
	delay: Number,
	duration: Number,
	enterDuration: Number,
	leaveDuration: Number,
});

const emit = defineEmits([
	'enter',
	'beforeEnter',
	'afterEnter',
	'leave',
	'beforeLeave',
	'afterLeave',
]);

const target = ref();
const classes = ref(new Set([props.name, `${props.name}-outside-view`]));

const observers = useState('_animation-observers', () => ({}));
const targets = useState('_animation-observer-targets', () => new Map());

const observerKey = computed(() =>
	btoa([props.rootMargin, props.threshold].join(':'))
);

let timeout;

onMounted(() => {
	observers.value[observerKey.value] ??= new IntersectionObserver(
		onIntersection,
		props
	);

	observers.value[observerKey.value].observe(target.value);
	targets.value.set(target.value, { onEnter, onLeave });
});

onBeforeUnmount(() => {
	observers.value[observerKey.value].unobserve(target.value);
});

function onIntersection(entries) {
	entries.forEach((entry) => {
		const actions = targets.value.get(entry.target);
		const key = entry.isIntersecting ? 'onEnter' : 'onLeave';
		actions?.[key]?.(entry);
	});
}

function onEnter({ boundingClientRect }) {
	clear();
	clearTimeout(timeout);

	timeout = setTimeout(() => {
		clearTimeout(timeout);
		emit('beforeEnter');

		classes.value.delete(`${props.name}-leave-active`);
		classes.value.delete(`${props.name}-leave-to`);
		classes.value.delete(`${props.name}-enter-active`);
		classes.value.delete(`${props.name}-enter-to`);

		setAnimationFrameQueue(
			() => {
				classes.value.add(`${props.name}-enter-from`);
				setDirectionClasses(boundingClientRect);
			},
			() => {
				classes.value.add(`${props.name}-enter-active`);
			},
			() => {
				clear(), emit('enter');
				classes.value.add(`${props.name}-enter-to`);
				classes.value.add(`${props.name}-in-view`);

				const pd = props.leaveDuration ?? props.duration;
				const sd = extractTiming(target.value, 'transitionDuration');

				timeout = setTimeout(() => {
					classes.value.delete(`${props.name}-enter-active`);
					classes.value.delete(`${props.name}-enter-to`);
					emit('afterEnter');
				}, pd ?? sd);
			}
		);
	}, props.delay);
}

function onLeave({ boundingClientRect }) {
	clear();
	clearTimeout(timeout);

	timeout = setTimeout(() => {
		clearTimeout(timeout);
		emit('beforeLeave');

		classes.value.delete(`${props.name}-leave-active`);
		classes.value.delete(`${props.name}-leave-to`);
		classes.value.delete(`${props.name}-enter-active`);
		classes.value.delete(`${props.name}-enter-to`);

		setAnimationFrameQueue(
			() => {
				classes.value.add(`${props.name}-leave-from`);
				setDirectionClasses(boundingClientRect);
			},
			() => {
				classes.value.add(`${props.name}-leave-active`);
			},
			() => {
				clear(), emit('leave');
				classes.value.add(`${props.name}-leave-to`);
				classes.value.add(`${props.name}-outside-view`);

				const propDuration = props.leaveDuration ?? props.duration;
				const styleDuration = extractTiming(
					target.value,
					'transitionDuration'
				);

				timeout = setTimeout(() => {
					classes.value.delete(`${props.name}-leave-active`);
					classes.value.delete(`${props.name}-leave-to`);
					emit('afterLeave');
				}, propDuration ?? styleDuration);
			}
		);
	}, props.delay);
}

function extractTiming(target, style) {
	const duration = window.getComputedStyle(target)[style];
	let [, number, unit] = duration.trim().match(/^([0-9.]*)(ms|s)$/);
	return unit === 's' ? parseFloat(number) * 1000 : parseFloat(number);
}

function setAnimationFrameQueue(...functions) {
	window.requestAnimationFrame((d) => {
		functions.shift()?.(d);
		functions.length && setAnimationFrameQueue(...functions);
	});
}

function setDirectionClasses(rect) {
	const y = (rect.top + rect.height / 2) / window.innerHeight;
	const x = (rect.left + rect.width / 2) / window.innerWidth;

	if (props.axis == 'block') {
		y > 0.5 && classes.value.add(`${props.name}-origin-bottom`);
		y <= 0.5 && classes.value.add(`${props.name}-origin-top`);
	}

	if (props.axis == 'inline') {
		x > 0.5 && classes.value.add(`${props.name}-origin-right`);
		x <= 0.5 && classes.value.add(`${props.name}-origin-left`);
	}
}

function clear() {
	[
		`${props.name}-enter-from`,
		`${props.name}-leave-from`,
		`${props.name}-outside-view`,
		`${props.name}-origin-bottom`,
		`${props.name}-origin-top`,
		`${props.name}-origin-right`,
		`${props.name}-origin-left`,
	].forEach((c) => classes.value.delete(c));
}
</script>
