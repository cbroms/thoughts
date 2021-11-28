---
backlinks:
  - one-dimension-network
  - random-symbols-for-one-dimension
forwardlinks:
  - one-dimension-network
node: Gene inheritance
created: '2021-11-07T04:56:49.069Z'
updated: '2021-11-07T05:09:02.649Z'
id: '96785079'
place: 'Berkeley, CA'
---
I’m trying to work out how exactly to generate unique visuals for each node in [the network](one-dimension-network.md).  I’d like this method to include some notion of inheritance, where the symbols of highly-connected nodes inherit from their connections. Here’s what I’m thinking so far.

Each node (thought) in the network can be connected to other nodes through forward and backlinks. Minus the links’ directionality, a simple graph might look like this:

![](images/gene-inheritance/PNCrKPtvjH.webp "A graph of interrelated thoughts on One Dimension")

The first step is forming *communities* of nodes. There are a number of algorithms to do this, but for now I’m using `greedy_modularity_communities` from [networkx](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.modularity_max.greedy_modularity_communities.html#networkx.algorithms.community.modularity_max.greedy_modularity_communities). Running it, we get a few emergent communities:

![](images/gene-inheritance/BkFFRcKtPw.webp "Communities of related thoughts")

Next, within each community we can calculate each node’s *degree centrality*, which is the percentage of the overall number of nodes in the graph the node is attached to. From running this calculation the most connected nodes in each community, or *community leaders* emerge:

![](images/gene-inheritance/VuIHhiBdcv.webp "Community leaders")

These community leader nodes connect to a number of *member* nodes within (and potentially outside) their communities. The next objective is to actually generate the individual symbols for each node. The idea here is to create symbols whose structure derives from the node’s connections; each node’s final symbol will include a number of *influences* from other members of the community.

To begin the generation process, let’s visit each node and generate a unique shape. So we might define a a function that takes in the immutable attributes of the node and produces a simple shape. It’s deterministic: the same node should always produce the same simple shape. Let’s call this unique shape the node’s *gene*.

We’ve created genes for each node in the community:

![](images/gene-inheritance/GHGfxzvIMy.webp "Unique genes for each thought")

Now we begin a process of *expression*: forming the symbols through gene inheritance. We’ll visit each node in descending order of degree centrality. When we visit each node, we’ll collect the genes of each of the nodes it connects to that *have a higher degree centrality* than the current node. To illustrate, let’s begin at the community leader—A1:

![](images/gene-inheritance/WvXmsDoLMU.webp "Starting to calculate expression with the thought with the highest centrality")

Since there are no nodes that have a higher degree centrality than it, the gene is purely expressed and we get the same symbol out as we started with:

![](images/gene-inheritance/pcsdNEjAje.webp "The expression of A1")

Now we move to the member of the community with the second highest degree centrality, A2:

![](images/gene-inheritance/xYhYKdJeKl.webp "Calculating the expression of A2")

It has connections to members of community A as well as members of community B. Also, notice that the genes for community B have been generated differently—each community might have its own random seed for the generation function so all members start out with similar genetic characteristics. In this case community B is a bit blobbier than A.

Back to calculating the expression of A2. Per the algorithm, we’ll collect the genes of all nodes that connect to A2 with higher degree centrality. In this case, the first sweep of the algorithm set the expression of A1 and B1, meaning both of these nodes have higher degree centrality than A2. So we’ll pull the genes from these two nodes and incorporate their characteristics into A2’s characteristics. The amount of influence each connected node’s genes have on A2 is dependent on the node’s relative degree centrality. In this case, the influence of A1 was stronger than B1:

![](images/gene-inheritance/MyifURyanL.webp "A2's expression combines genes from A1 and B1")

Now we have A2’s expression: an amalgamation of genes from itself and its connected neighbors with higher degree centrality.

Next, we move on to the node with third lowest degree centrality, B2. The process repeats: A2 and B1 have higher degree centrality than B2, so their genes are mixed in when calculating B2’s expression:

![](images/gene-inheritance/iWeYZSApRA.webp "B2's expression combines genes from A2 and B1")

The final point to make here is that when calculating expression, the genes of the connected nodes are used, not the final expression. In this case B2 pulled in the genes of A2 (a triangle) and not A2’s expression (a triangle, diamond, and blob). It might be possible to use the expression, but that’d get really complicated really quick and I worry the way that nodes inherit from one another would get a bit muddled.

That’s the gist. There’s obviously a lot I need to figure out around those aforementioned node → symbol generation functions, but I think something like this will serve as a decent first start for the inheritance part of things.

Originally [posted here](https://futureland.tv/christian/entry/118937). 

