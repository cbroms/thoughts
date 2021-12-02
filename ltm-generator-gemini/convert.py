import glob
import frontmatter

from md2gemini import md2gemini

for name in glob.glob('../wm/*.md'):
    filename = name.split('/')[2].replace('.md', '')

    post = frontmatter.load(name)
    title = post.metadata['node']
    updated = post.metadata['updated']
    place = post.metadata['place']

    backlinks = "\n".join(list(map(lambda x: "=> {}.gmi".format(x), post.metadata['backlinks'])))

    # todo: add ## Links only if there are forwardlinks 
    content = "# {}\n\n{}\n Last updated {} in {}\n## Links".format(title, post, updated, place)

    gem = md2gemini(content, links="at-end", md_links=True)
    gem += "\n## Backlinks\n\n{}".format(backlinks)
    print(gem)

    