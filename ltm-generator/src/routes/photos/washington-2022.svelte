<svelte:head>
	<title>Hikes: Washington State, May & June 2022</title>
	<meta
		property="og:image"
		content="https://onedimension.net/photos/washington-2022/webp/1.webP/"
	/>
</svelte:head>

<main>
	<div class="wrapper">
		<div class="floating two header">
			<img style="width: 31%;" src="/photos/washington-2022/webp/1.webP" />
			<div class="text" style="border-top: none; width: auto;">
				<p>Hikes: Washington State</p>
				<p style="font-size: 1.5rem;"><em>May & June 2022</em></p>
			</div>
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/2.webP" loading="lazy" />
		</div>
		<div class="floating">
			<div class="text" style="width: 50%;">
				<p>Mt. Baker-Snoqualmie<br /> National Forest</p>
			</div>
		</div>
		<div class="floating two">
			<img src="/photos/washington-2022/webp/3.webP" loading="lazy" />
			<img src="/photos/washington-2022/webp/4.webP" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/washington-2022/webp/5.webP" loading="lazy" />
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/6.webP" loading="lazy" />
		</div>
		<div class="floating two">
			<img src="/photos/washington-2022/webp/7.webP" loading="lazy" />
			<img src="/photos/washington-2022/webp/8.webP" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/washington-2022/webp/9.webP" loading="lazy" />
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/10.webP" loading="lazy" />
		</div>
		<!-- break -->
		<div class="floating">
			<div class="text" style="width: 50%;">
				<p>Olympic National Park</p>
			</div>
		</div>
		<div class="floating two">
			<img src="/photos/washington-2022/webp/11.webP" loading="lazy" />
			<img src="/photos/washington-2022/webp/12.webP" loading="lazy" />
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/13.webP" loading="lazy" />
		</div>
		<div class="floating two">
			<img src="/photos/washington-2022/webp/14.webP" loading="lazy" />
			<img src="/photos/washington-2022/webp/16.webP" loading="lazy" />
		</div>
		<div class="full two">
			<img style="width: 31%;" src="/photos/washington-2022/webp/17.webP" />
			<img style="width: 70%;" src="/photos/washington-2022/webp/18.webP" />
		</div>
		<div class="floating three">
			<img style="width: 31%;" src="/photos/washington-2022/webp/19.webP" loading="lazy" />
			<img style="width: 70%;" src="/photos/washington-2022/webp/20.webP" loading="lazy" />
			<img style="width: 31%;" src="/photos/washington-2022/webp/21.webP" loading="lazy" />
		</div>
		<!-- break -->
		<div class="floating">
			<div class="text">
				<p>Okanogan-Wenatchee <br />National Forest</p>
			</div>
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/22.webP" loading="lazy" />
		</div>
		<div class="floating two">
			<img style="width: 31%;" src="/photos/washington-2022/webp/23.webP" loading="lazy" />
			<img style="width: 70%;" src="/photos/washington-2022/webp/24.webP" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/washington-2022/webp/25.webP" loading="lazy" />
		</div>
		<div class="full two">
			<img style="width: 31%;" src="/photos/washington-2022/webp/26.webP" loading="lazy" />
			<img style="width: 70%;" src="/photos/washington-2022/webp/27.webP" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/washington-2022/webp/28.webP" loading="lazy" />
		</div>
		<div class="full">
			<img src="/photos/washington-2022/webp/29.webP" loading="lazy" />
		</div>
	</div>
</main>

<style>
	.wrapper {
		width: 100%;
		display: flex;
		gap: 12rem;
		padding: 2rem;
		flex-direction: column;
		align-items: center;
		max-width: 1600px;
		margin: 0 auto;
	}

	.floating {
		width: 70%;
		display: flex;
		flex-direction: row;
		gap: 2rem;
		/* justify-content: center; */
	}

	.full {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	.one,
	.two,
	.three {
		max-height: 800px;
		position: relative;
		gap: 2rem;
	}

	.one > img {
		width: 100%;
	}
	.two > img {
		width: 50%;
	}
	.three > img {
		width: 33%;
	}

	.header {
		gap: 4rem;
		margin: 8rem 0;
	}

	@media (max-width: 650px) {
		.wrapper {
			gap: 2rem;
		}
		.floating,
		.full {
			width: 100%;
			flex-direction: column;
			max-height: none;
		}
		.one > img,
		.two > img,
		.three > img {
			width: 100% !important;
		}

		.header {
			margin-top: 1rem;
			gap: 1rem;
		}
	}

	img {
		border-radius: 0;
		object-fit: contain;
		height: auto;
		max-height: none;
	}

	:global(body) {
		padding: 0;
		background-color: #00040b;
		color: #cacaca;
		font-family: 'Times New Roman', Times, serif;
	}

	.text {
		width: 100%;
		border-top: 1px solid #cacaca;
		margin: 2rem 0;
		margin-bottom: 0;
		padding: 2rem 0;
		padding-bottom: 0;
	}

	p {
		color: #cacaca;
		padding: 0;
		margin: 0;
		font-size: 2rem;
		line-height: 2.2rem;
	}
</style>
