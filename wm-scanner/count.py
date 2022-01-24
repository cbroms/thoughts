import glob
import json
import frontmatter
import re

total_links = 0
total_words = 0
total_thoughts = 0

total_exclaim = 0

for name in glob.glob('../wm/*.md'):

    total_thoughts += 1

    post = frontmatter.load(name)
    links = post.metadata['forwardlinks']
    total_links += len(links)
    total_words += len(post.content.split(' '))
    total_exclaim += len(re.findall("!", post.content))


print("{} thoughts".format(total_thoughts))
print("{} links".format(total_links))
print("{} words".format(total_words))

print("{} exclaimations, {} per thought".format(
    total_exclaim, total_exclaim / total_thoughts))


data = {'thoughts': total_thoughts, 'links': total_links, 'words': total_words}


with open("../wm/counts/current.json", 'w+') as f:
    f.write(json.dumps(data))
    f.close()
