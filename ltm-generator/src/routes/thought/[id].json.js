import getPage from '$lib/db';

import ogs from 'open-graph-scraper-lite';

export async function get({ params }) {
	const { id } = params;

	const thought = await getPage(`/thought/${id}`);
	console.log(`GET page: thought/${id}`);

	if (thought) {
		const forwardlinkPreviewData = {};
		const backlinks = [];
		// get the data for tooltip page previews
		for (const link of thought.data.forwardlinks) {
			console.log(`GET page preview: thought/${link}`);
			const res = await getPage(`/thought/${link}/preview`);
			forwardlinkPreviewData[link + '.md'] = res;
		}

		for (const link of thought.data.backlinks) {
			console.log(`GET page preview: thought/${link}`);
			const res = await getPage(`/thought/${link}/preview`);
			backlinks.push({ ...res, link });
		}

		const aTags = [...thought.content.matchAll(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g)];
		const replacementATags = {};

		for (const tag of aTags) {
			const [fullTag, content] = tag;
			const href = fullTag.split('"')[1];
			const preview = forwardlinkPreviewData[href];

			if (preview) {
				// replace " with ' since the html will have to be passed as a string
				const previewContent = preview.excerpt.replaceAll('"', "'").replaceAll('\n', '');

				replacementATags[
					fullTag
				] = `<page-preview style="display: inline-block" content="${previewContent}" node="${
					preview.data.node
				}" href="/thought/${href.replace('.md', '')}">${content}</page-preview>`;
			} else {
				try {
					console.log(`GET page preview: ${href}`);
					const { result } = await ogs({ url: href });
					console.log(result);
					const desc = result.ogDescription ? `<p>${result.ogDescription}</p>` : null;
					const previewContent = desc ? desc.replaceAll('"', "'").replaceAll('\n', '') : null;

					let largestSize = 0;
					let largestImage = { url: null };

					// find the largest image of the potential preview images
					if (result.ogImage?.length) {
						for (const image of result.ogImage) {
							const size = parseInt(image.width) * parseInt(image.height);
							if (size > largestSize) {
								largestSize = size;
								largestImage = image;
							}
						}
					} else {
						largestImage = result.ogImage || largestImage;
					}

					// check that the image has an absolute URL
					if (largestImage.url?.indexOf('http') === -1) {
						largestImage.url = new URL(largestImage.url, result.requestUrl).href;
					}

					replacementATags[
						fullTag
					] = `<page-preview style="display: inline-block" external="true" imgsrc="${largestImage.url}" content="${previewContent}" node="${result.ogTitle}" href="${href}">${content} <span class='link-arrow'>&neArr;</span>
					 </page-preview>`;
				} catch (e) {
					replacementATags[
						fullTag
					] = `<page-preview style="display: inline-block" external="true" href="${href}">${content} <span class='link-arrow'>&neArr;</span></page-preview>`;
				}
			}

			// console.log(href, content, tag.index);

			// replacementATags[fullTag] = "new tag"
		}

		// replace all <a> tags with <page-preview> tags
		thought.content = thought.content.replace(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g, (a) => {
			return replacementATags[a];
		});

		return {
			body: {
				...thought,
				backlinks
			}
		};
	}
}
