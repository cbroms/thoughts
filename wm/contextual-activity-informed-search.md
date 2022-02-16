---
backlinks:
  - hyperfov
forwardlinks: []
node: 'Contextual, activity-informed search'
updates:
  - '2022-02-15'
id: '60469787'
places:
  - 'Berkeley, CA'
---
Something I'm interesting in exploring with this project is modeling a search system off the way information is remembered in the human brain. 

The perennial challenge with search is figuring out the ordering; how to rank the set of results that share some properties with the query. 

When it comes to how search is performed on the web, there are may mysterious and incredibly complicated [algorithms](https://en.wikipedia.org/wiki/PageRank) at play. Pages are ranked by an opaque box that's based on a set of pre-decided properties of those pages. "SEO" is the practice of optimizing a given page to rank higher among those results for a given query. Those doing this sort of optimization go on inferred parameters that, when tweaked, cause the opaque box to place the page higher for the query. The big G is known for throwing in some properties of the requestor too, so each individual that submits a query gets slightly different results. 

These algorithms use properties of the page and properties of the user to determine the set of results and ranking for a given query. So a set of results are based on two sets of inferred properties. Age, location, gender on the user's side, and content, links, size, click-through rate on the page's side, among many other properties. 

Notice that there's an aspect of extrapolation here: the system has information it's inferred about pages, queries, and users, but doesn't know exactly what the most relevant result will be. So it presents a series of results in a ranking from these inferred properties. 

What if instead of *extrapolating* out from inferred properties, the search system was also *interpolating* between observed properties? 

Rather than only searching for a hypothetical future, it also searched a concrete past? 

Imagine the search system had a full context of the path a given user took to find a satisfying answer to their query. They search for "buttermilk pancake recipe," and go through the process of sifting through the results until they find a page they like at mostexcellentrecipes.com. They try the recipe, it's good. The user marks the page accordingly. Now the system has more context; it knows the search path plus a concrete outcome: mostexcellentrecipes.com's pancakes were good. 

The next time the user searches for a buttermilk pancake recipe, the problem is trivial. The page they marked last time is the one to return to. No need to sift through all those pages they've already seen until they rediscover the one from before. 

Now suppose they search for another recipe, say "pumpkin pie recipe." The search engine now has more information to go off of; they liked a recipe from mostexcellentrecipes.com. There's no real inference here; the user specifically marked the page as a high-quality result. So the pumpkin pie recipe from mostexcellentrecipes.com is surfaced to the top. There's still some amount of inference--it's an educated guess that they'd like the pumpkin pie recipe from the same site--but the system is going on the user's actual feedback rather than pages' SEO and generic properties of the user. 

In this way the search system becomes a tool that's shaped by the user's actual feedback. No need for fancy algorithms or machine learning; let the user provide little signs of quality and save previous search paths to inform future ones. 
 
