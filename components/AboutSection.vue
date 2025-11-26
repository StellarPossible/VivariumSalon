<template>
	<section class="about-section" id="about">
		<div class="about-section__layout">
			<figure class="about-section__media">
				<img src="/images/site_images/monstera.jpg" alt="Monstera leaf arrangement at Vivarium Salon" />
				<figcaption class="about-section__definition-card">
					<p class="about-section__definition">
						<span class="about-section__definition-term">Vivarium</span>
						stems from the Latin <em>vivere</em>, "to live." Traditionally, it describes a carefully tended
						environment where life is nurtured, observed, and allowed to flourish.
					</p>
				</figcaption>
			</figure>
			<div class="about-section__content">
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
		</div>
	</section>
</template>

<style scoped lang="scss">
.about-section {
	padding: 4rem 1.5rem;
	background-color: #e6e3de;
	color: #445347;
}

.about-section__layout {
	margin: 0 auto;
	max-width: 1040px;
	display: flex;
	align-items: center;
	gap: 2.5rem;
}

.about-section__media {
	flex: 0 0 320px;
	max-width: 320px;
	margin: 0;
	position: relative;
	overflow: visible;
}

.about-section__media img {
	display: block;
	width: 100%;
	height: auto;
	border-radius: 24px;
	box-shadow: 0 18px 35px rgba(53, 54, 55, 0.25);
}

.about-section__definition-card {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(85%, 360px);
	padding: 1.75rem 2rem;
	background: rgba(248, 246, 241, 0.5);
	border-radius: 18px;
	box-shadow: 0 20px 40px rgba(53, 54, 55, 0.3);
	backdrop-filter: blur(6px);
	color: #2f3d33;
	border: 1px solid rgba(68, 83, 71, 0.12);
	z-index: 1;
}

.about-section__content {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	flex: 1;
}

.about-section__title {
	font-size: 2.5rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	font-weight: 400;
}

.about-section__definition {
	font-size: 1.45rem;
	line-height: 1.1;
	max-width: 52ch;
	color: #445347;
	text-align: center;
	margin: 0;
}

.about-section__definition-term {
	font-weight: 600;
	font-size: 2.5rem;
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
	line-height: 1.2;
}

@media (max-width: 768px) {
	.about-section {
		padding: 3rem 1rem;
	}

	.about-section__layout {
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.about-section__media {
		flex: unset;
		max-width: 420px;
		width: 100%;
	}

	.about-section__definition-card {
		width: min(90%, 320px);
	}

	.about-section__title {
		font-size: 2rem;
	}

	.about-section__subtitle {
		font-size: 1.5rem;
	}
}

@media (max-width: 600px) {
	.about-section__definition-card {
		padding: 1.5rem 1.75rem;
	}

	.about-section__definition {
		font-size: 1.3rem;
	}
}

@media (max-width: 480px) {
	
	.about-section__definition {
		font-size: 1.2rem;
	}
}
</style>
