import glob
import frontmatter

import matplotlib.pyplot as plt
import networkx as nx

G = nx.Graph()

for name in glob.glob('../wm/*.md'):
    node = name.split('/')[2].replace('.md', '')

    G.add_node(node)

    post = frontmatter.load(name)
    links = post.metadata['forwardlinks']

    for node_dest in links:
        G.add_edge(node, node_dest)

nx.draw_kamada_kawai(G, with_labels=True,)
plt.show()
