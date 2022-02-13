---
id: '18176083'
node: One Dimension on Gemini
indexed: false
daily: false
backlinks:
  - one-dimension-todo
  - one-dimension
forwardlinks:
  - gemini-protocol
  - one-dimension
updates:
  - '2021-12-04'
places:
  - 'Berkeley, CA'
---
Today I created a [Gemini portal](gemini-protocol.md) for [this site](one-dimension.md). Now, this page is available both over `http` and `gemini`: any page can be accessed in gemini at `gemini://gemini.onedimension.net/thought/{id}.gmi`. 

Not everything is working yet, but it's a good first start to play around with the space. 

## Building it 

The first step was converting all of the markdown files that make up this site to `.gmi` files. For this, I used [the python package `md2gemini`](https://github.com/makeworld-the-better-one/md2gemini). 

The `text/gemini` media type [is a bit more restrictive](https://gemini.circumlunar.space/docs/specification.gmi) than markdown as the only supported styles are codeblocks, quotes, and lists. Links have their own block-level styling; there are no inline links as you find in html and markdown. As a result, during the conversion from markdown to gemini you must decide how to handle the inline links, which is certainly an unusual consideration.  

Once the files are built, I use `rsync` to move the generated files to my server. 

## Serving it 

I'm using [jetforce](https://github.com/michael-lazar/jetforce) to serve the portal. I installed it on my server and had it up and running complete with a TLS cert in about 20 minutes. Really nice project to play around with.

