---
backlinks:
  - twelve-websites
  - what-im-working-on-now
  - hyperfov
  - progressive-enhancement
forwardlinks:
  - one-dimension
node: Page previews
created: '2021-09-27T06:24:30.808Z'
updated: '2021-10-01T06:57:43.728Z'
---

I really like [Wikipedia page previews](https://diff.wikimedia.org/2018/04/18/how-we-designed-page-previews-for-wikipedia/). I think that this particular piece of interactivity should be everywhere; it helps avoid the mystery that comes with clicking on a link and a full context switch. Just that little bit of primed context can help a lot.

Today I worked on building a system that allows for just that.

I was inspired to do this after building the previews for this site and I ran into an interesting challenge: how to get previews for _external_ pages?

## Internal vs. External

This difference becomes relevant because of CORS, which prevents making requests from different domains client-side. So it becomes impossible to dynamically load an external page, meaning creating a preview is impossible.

I initially solved this on [One Dimension](one-dimension.md) by fetching the preview data when the site is generated. I still think this is a decent solution, but it means building takes a very long time--it increases linearly as the number of links goes up. It also obviously doesn't work for sites that don't have a build step.

## Fetching preview data from a worker

I figured the best way to overcome this challenge would be to write a small worker function that could fetch the pages' preview data remotely, not from the browser. I opted for trying out [Cloudflare Workers](https://workers.cloudflare.com/) because I've always wanted to give it a shot, and it's super simple compared to the alternatives.

The experience was really nice. I think I'll explore more serverless approaches in the future. It seems like you could write a full API, especially with Cloudflare's [key value store](https://www.cloudflare.com/products/workers-kv/), which seems able to replace a database in some applications.

# Try them out

I built [a little site](https://previews.hyperfov.com) to try them out.
