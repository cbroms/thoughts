import glob
import frontmatter

import matplotlib.pyplot as plt
import networkx as nx
from networkx.algorithms.community import greedy_modularity_communities

G = nx.Graph()

for name in glob.glob('../wm/*.md'):
    node = name.split('/')[2].replace('.md', '')

    G.add_node(node)

    post = frontmatter.load(name)
    links = post.metadata['forwardlinks']

    for node_dest in links:
        G.add_edge(node, node_dest)

dc = nx.degree_centrality(G)
nx.set_node_attributes(G, dc, "centrality")


c = list(greedy_modularity_communities(G))

for comm in c:
    print("\nCommunity:")
    # sort by centrality 
    community = sorted([(node, G.nodes[node]['centrality']) for node in list(comm)], key=lambda n: n[1], reverse=True)
    for n, c in community:
        print(n)

nx.draw_kamada_kawai(G, with_labels=True,)
plt.show()
