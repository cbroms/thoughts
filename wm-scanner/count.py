import glob
import json
import frontmatter
import re

total_links = 0
total_words = 0
total_thoughts = 0

thoughts_with_exc = 0
thoughts_with_ques = 0

for name in glob.glob('../wm/*.md'):

    total_thoughts += 1

    post = frontmatter.load(name)
    links = post.metadata['forwardlinks']
    total_links += len(links)
    total_words += len(post.content.split(' '))

    ques = len(re.findall("!", post.content))
    # ignore ! in markdown images
    bad_ques = len(re.findall("!\[", post.content))

    if ques > bad_ques:
        thoughts_with_exc += 1

    if len(re.findall("\?", post.content)) > 0:
        thoughts_with_ques += 1


print("\n{} thoughts".format(total_thoughts))
print("{} links".format(total_links))
print("{} words".format(total_words))

print("\nchance of a !: {}%".format(round(
    thoughts_with_exc / total_thoughts * 100)))

print("chance of a ?: {}%\n".format(round(
    thoughts_with_ques / total_thoughts * 100)))


data = {'thoughts': total_thoughts, 'links': total_links, 'words': total_words}


with open("../wm/counts/current.json", 'w+') as f:
    f.write(json.dumps(data))
    f.close()
