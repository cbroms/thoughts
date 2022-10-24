<svelte:head>
	<title>Oregon, August & September 2022</title>
	<meta property="og:image" content="https://onedimension.net/photos/oregon-2022/jpg/4.jpg/" />
</svelte:head>

<main>
	<div class="wrapper">
		<div class="floating two header">
			<img style="width: 31%;" src="/photos/oregon-2022/jpg/1.jpg" />
			<div class="text" style="border-top: none; width: auto;">
				<p>Oregon</p>
				<p style="font-size: 1.5rem;"><em>August & September 2022</em></p>
			</div>
		</div>
		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/2.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/3.jpg" loading="lazy" />
		</div>

		<div class="floating two">
			<img style="width: 70%;" src="/photos/oregon-2022/jpg/4.jpg" loading="lazy" />
			<img style="width: 31%;" src="/photos/oregon-2022/jpg/5.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/6.jpg" loading="lazy" />
		</div>

		<div class="floating two">
			<img style="width: 70%;" src="/photos/oregon-2022/jpg/7.jpg" loading="lazy" />
			<img style="width: 31%;" src="/photos/oregon-2022/jpg/8.jpg" loading="lazy" />
		</div>

		<div class="full two">
			<img src="/photos/oregon-2022/jpg/9.jpg" loading="lazy" />
			<img src="/photos/oregon-2022/jpg/10.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/11.jpg" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/12.jpg" loading="lazy" />
		</div>

		<div class="floating two">
			<img style="width: 70%;" src="/photos/oregon-2022/jpg/13.jpg" loading="lazy" />
			<img style="width: 31%;" src="/photos/oregon-2022/jpg/14.jpg" loading="lazy" />
		</div>

		<div class="floating two">
			<img src="/photos/oregon-2022/jpg/15.jpg" loading="lazy" />
			<img src="/photos/oregon-2022/jpg/16.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/17.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/18.jpg" loading="lazy" />
		</div>

		<div class="full one">
			<img src="/photos/oregon-2022/jpg/19.jpg" loading="lazy" />
		</div>

		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/20.jpg" loading="lazy" />
		</div>
		<div class="floating one">
			<img src="/photos/oregon-2022/jpg/21.jpg" loading="lazy" />
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
		background-color: #0c0f00;
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
