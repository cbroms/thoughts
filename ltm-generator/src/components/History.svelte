<script>
	import toDateString from '../lib/date';

	export let updates;
	export let places;

	let versions = [...updates];

	// add today's date to the end
	versions.push(new Date());

	const x1 = 5;
	const y1 = 10;
	const x2 = 440;

	let fullDur = new Date(versions[versions.length - 1]) - new Date(versions[0]);
	let minDur = fullDur;

	// find the min duration between versions
	for (let i = 0; i < versions.length - 1; i++) {
		const updateDur = new Date(versions[i + 1]) - new Date(versions[i]);
		if (updateDur < minDur) minDur = updateDur;
	}

	const minLength = 30;
	const maxLength = 100;
	const stubLength = 50;

	// use the min duration to set the height of the line to scale
	let lineLength = (fullDur / minDur) * minLength;

	const lengths = [0];

	// clamp the lengths if they're longer than the maxLength
	for (let i = 0; i < versions.length - 1; i++) {
		const updateDur = new Date(versions[i + 1]) - new Date(versions[i]);
		// get the raw length of this dur
		let percentDown = updateDur / fullDur;
		let distance = percentDown * lineLength;

		// if the distance is over the max, clamp it
		if (distance > maxLength) {
			distance = maxLength;
		}

		lengths.push(distance);
	}

	// adjust the total line length to be composed of the clamped lengths
	lineLength = lengths.reduce((prev, curr) => {
		return prev + curr;
	});

	// calculate y2 (it's the missing height of the triangle)
	const y2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(lineLength, 2));

	const formattedVersions = [];

	let percentSoFar = 0;
	// calculate the x/y position of each update on the line and format text
	for (let i = 0; i < lengths.length - 1; i++) {
		// the percent down the line (hypotenuse)
		const percentDown = lengths[i] / lineLength + percentSoFar;
		percentSoFar += percentDown;

		// convert percent down the hypotenuse to x/y coords
		const x = (x2 - x1) * percentDown + x1;
		const y = (y2 - y1) * percentDown + y1;

		// now we want to create a dash line for display if the distance has been clamped
		const prevPoint = i > 0 ? formattedVersions[i - 1] : { x: 0, y: 0 };
		const seg = { x1: prevPoint.x, y1: prevPoint.y, x2: x, y2: y };

		// same principle as above, except this time the percent down the segment between
		// the current point and the previous one
		const centerX1 = (seg.x2 - seg.x1) * 0.4 + seg.x1;
		const centerX2 = (seg.x2 - seg.x1) * 0.6 + seg.x1;
		const centerY1 = (seg.y2 - seg.y1) * 0.4 + seg.y1;
		const centerY2 = (seg.y2 - seg.y1) * 0.6 + seg.y1;

		formattedVersions.push({
			x,
			y,
			date: toDateString(versions[i]),
			place: places[i],
			clamped: lengths[i] === maxLength,
			centerX1,
			centerX2,
			centerY1,
			centerY2
		});
	}
</script>

<div class="history">
	<svg width="{600}px" height="{y2}px" viewBox="0 0 {600} {y2}" xmlns="http://www.w3.org/2000/svg">
		<line {x1} {y1} {x2} {y2} stroke="black" />
		{#each formattedVersions as version}
			{#if version.clamped}
				<line
					x1={version.centerX1}
					y1={version.centerY1}
					x2={version.centerX2}
					y2={version.centerY2}
					stroke-dasharray="6"
					stroke="#f5f5f5"
					stroke-width="2px"
				/>
			{/if}
			<a xlink:href="/">
				<line
					x1={version.x}
					y1={version.y}
					x2={version.x + stubLength - 5}
					y2={version.y}
					stroke="black"
				/>
				<circle cx={version.x} cy={version.y} r={5} />
				<text x={version.x + stubLength} y={version.y + 5}
					>{version.date}
					<tspan x={version.x + stubLength} y={version.y + 25}>in {version.place}</tspan>
				</text>
			</a>
		{/each}
		<polygon points="{x2},{y2 - 10} {x2},{y2} {x2 - 10},{y2}" />

		<style>
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
