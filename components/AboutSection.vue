<template>
	<section class="about-section" id="about">
		<div class="about-section__content">
			<header class="about-section__header">
				<h2 class="about-section__title">Vivarium Defined</h2>
				<p class="about-section__definition">
					<span class="about-section__definition-term">Vivarium</span>
					stems from the Latin <em>vivere</em>, "to live." Traditionally, it describes a carefully tended
					environment where life is nurtured, observed, and allowed to flourish.
				</p>
			</header>

			<div class="about-section__philosophy">
				<h3 class="about-section__subtitle">Our Philosophy</h3>
				<p>
					Vivarium Salon is built on the belief that a salon can be more than a place for services—it can be
					a living environment that honors each guest’s natural rhythm and evolving sense of self. Just as a
					vivarium provides the conditions for growth, we create space for personal expression through
					intentional craftsmanship, mindful product choices, and an atmosphere of genuine hospitality.
				</p>
			</div>

			<div class="about-section__mission">
				<h3 class="about-section__subtitle">Our Mission</h3>
				<p>
					We cultivate beauty experiences that are restorative, inclusive, and sustainably minded. Our team
					listens deeply, collaborates transparently, and guides every guest with education that empowers
					them beyond the chair. By weaving artistry with care for our community and environment, Vivarium
					Salon becomes a sanctuary where growth feels natural and every visit leaves you more connected to
					your own vitality.
				</p>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.about-section {
	padding: 4rem 1.5rem;
	background-color: #e6e3de;
	color: #353637;
}

.about-section__content {
	margin: 0 auto;
	max-width: 960px;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.about-section__header {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.about-section__title {
	font-size: 2.5rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	font-weight: 400;
}

.about-section__definition {
	font-size: 1.125rem;
	line-height: 1.7;
	max-width: 52ch;
}

.about-section__definition-term {
	font-weight: 600;
}

.about-section__subtitle {
	font-size: 1.75rem;
	font-weight: 400;
	margin-bottom: 1rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.about-section__philosophy,
.about-section__mission {
	font-size: 1.05rem;
	line-height: 1.8;
}

@media (max-width: 768px) {
	.about-section {
		padding: 3rem 1rem;
	}

	.about-section__title {
		font-size: 2rem;
	}

	.about-section__subtitle {
		font-size: 1.5rem;
	}
}
</style>
