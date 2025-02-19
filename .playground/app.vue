<template>
	<main>
		<div class="container">
			<TransitionAppear name="t-fade">
				<div class="item">Hello there!</div>
			</TransitionAppear>

			<TransitionAppear name="t-fade">
				<div class="item">Hello there!</div>
			</TransitionAppear>

			<TransitionAppear name="t-fade">
				<div class="item">Hello there!</div>
			</TransitionAppear>
		</div>
	</main>
</template>

<script setup></script>

<style lang="postcss">
body {
	background: #111;
	color: #fafafa;
}

:where(.container) {
	padding: 120vh 20px;
}

:where(.item) {
	margin: 20px 40px;
	padding: 24px 0px 12px 0px;
	border-bottom: 1px solid #666;

	font-family: "Suisse Int'l", sans-serif;
	font-weight: 500;
	font-size: 16px;

	clip-path: xywh(0 0 100% 100%);
	opacity: 1;
}

.t-fade-enter-active {
	&,
	& > * {
		transition: 2s cubic-bezier(0.2, 0, 0.2, 1);
	}
}

.t-fade-enter-from,
.t-fade-outside-view {
	& > * {
		opacity: 0;
		clip-path: xywh(0 0 0% 100%);
	}

	&.t-fade-origin-top > * {
		transform: translateY(-320px);
	}

	&.t-fade-origin-bottom > * {
		transform: translateY(320px);
	}
}
</style>
