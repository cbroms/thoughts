<script>
	import toDateString from '../lib/date';

	export let updates;
	export let places;

	let versions = [...updates];

	// add today's date to the end
	versions.push(new Date());

	const x1 = 5;
	const y1 = 10;
	const x2 = 400;

	let fullDur = new Date(versions[versions.length - 1]) - new Date(versions[0]);
	let minDur = fullDur;

	// find the min duration between versions
	for (let i = 0; i < versions.length - 1; i++) {
		const updateDur = new Date(versions[i + 1]) - new Date(versions[i]);
		if (updateDur < minDur) minDur = updateDur;
	}

	// use the min duration to set the height of the line
	// since the min duration must have a height of 50px, the full height
	// will follow
	const lineLength = (fullDur / minDur) * 20;
	const y2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(lineLength, 2));

	const stubLength = 50;

	const formattedVersions = [];

	// calculate the x/y position of each update on the line and format text
	for (let i = 0; i < versions.length - 1; i++) {
		const updateDur = new Date(versions[0]) - new Date(versions[i]);
		const percentDown = updateDur / fullDur;

		const x = Math.abs((x1 - x2) * percentDown + x1);
		const y = Math.abs((y2 - y1) * percentDown - y1);

		formattedVersions.push({
			x,
			y,
			date: toDateString(versions[i]),
			place: places[i]
		});
	}
</script>

<div class="history">
	<svg width="{600}px" height="{y2}px" viewBox="0 0 {600} {y2}" xmlns="http://www.w3.org/2000/svg">
		<line {x1} {y1} {x2} {y2} />
		{#each formattedVersions as version}
			<a xlink:href="/">
				<line x1={version.x} y1={version.y} x2={version.x + stubLength - 5} y2={version.y} />
				<circle cx={version.x} cy={version.y} r={5} />
				<text x={version.x + stubLength} y={version.y + 5}
					>{version.date}
					<tspan x={version.x + stubLength} y={version.y + 25}>in {version.place}</tspan>
				</text>
			</a>
		{/each}
		<polygon points="{x2},{y2 - 10} {x2},{y2} {x2 - 10},{y2}" />

		<style>
			line {
				stroke-width: 1px;
				stroke: black;
			}

			text {
				text-decoration: underline;
				text-decoration-style: dotted;
			}

			a:hover {
				fill: var(--external-link-color);
			}

			a:hover > line {
				stroke: var(--external-link-color);
			}
		</style>
	</svg>
</div>

<style>
	.history {
		width: 600px;
	}
</style>
