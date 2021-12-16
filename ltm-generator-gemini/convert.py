from md2gemini import md2gemini
import glob
import re
import frontmatter
import json
import dateutil.parser

"""
Generate an index gmi file that contains a banner ascii art image
and the indexed links from wm/indexed/indexed.json
"""
with open('../wm/indexed/indexed.json') as f:
    index = json.load(f)

with open('../wm/counts/current.json') as f:
    counts = json.load(f)

with open('banner.txt') as f:
    banner = f.readlines()

index_links = "\n".join(
    list(map(lambda x: "=> /thought/{}.gmi".format(x), index)))

formatted_counts = "{} thoughts, {} links, and {} words.".format(
    counts['thoughts'], counts['links'], counts['words'])

index_content = "```\n{}\n```\n\n{}\n\n{}".format(
    ''.join(banner), index_links, formatted_counts)

with open("../ltm-gemini/index.gmi", 'w+') as f:
    f.write(index_content)
    f.close()


"""
Generate .gmi files for every thought in wm/
"""
for name in glob.glob('../wm/*.md'):
    filename = name.split('/')[2].replace('.md', '')

    post = frontmatter.load(name)
    title = post.metadata['node']
    updated = post.metadata['updated']
    place = post.metadata['place']

    backlinks = "\n".join(
        list(map(lambda x: "=> /thought/{}.gmi".format(x), post.metadata['backlinks'])))

    if updated:
        parsed = dateutil.parser.isoparse(updated)
        timestamp = parsed.strftime("%a %b %d %Y")
    else:
        timestamp = ''
    # todo: add ## Links only if there are forwardlinks
    content = "# {}\n\n{}\n\nLast updated {} in {}\n## Links".format(
        title, post, timestamp, place)

    content = content.replace(".webp", ".jpg")

    # strange quirk, it seems md2gemini is first replacing .md with .gmi, then passing them through the link func
    # I probably would have written it the other way around, or ignored md_links when link_func is specified
    gem = md2gemini(content, links="at-end", md_links=True, indent="   ", plain=True,
                    link_func=lambda l: "/thought/{}".format(l) if re.search(".gmi", l) else l)
    gem += "\n\n## Backlinks\n\n{}\n\n".format(backlinks)

    with open("../ltm-gemini/thought/{}.gmi".format(filename), 'w+') as f:
        f.write(gem)
        f.close()
