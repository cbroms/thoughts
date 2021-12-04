import glob
import re
import frontmatter

from md2gemini import md2gemini

for name in glob.glob('../wm/*.md'):
    filename = name.split('/')[2].replace('.md', '')

    post = frontmatter.load(name)
    title = post.metadata['node']
    updated = post.metadata['updated']
    place = post.metadata['place']

    backlinks = "\n".join(
        list(map(lambda x: "=> /thought/{}.gmi".format(x), post.metadata['backlinks'])))

    # todo: add ## Links only if there are forwardlinks
    content = "# {}\n\n{}\n\nLast updated {} in {}\n## Links".format(
        title, post, updated, place)

    gem = md2gemini(content, links="at-end", md_links=True,
                    link_func=lambda l: "/thought/{}".format(l) if not re.search("https?://", l) else l)
    gem += "\n\n## Backlinks\n\n{}".format(backlinks)

    with open("../ltm-gemini/thought/{}.gmi".format(filename), 'w+') as f:
        f.write(gem)
        f.close()
