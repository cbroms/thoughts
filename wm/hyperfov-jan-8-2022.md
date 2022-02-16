---
id: '66850209'
node: 'Hyperfov Jan 8, 2022'
indexed: false
daily: false
backlinks: []
forwardlinks: []
updates:
  - '2022-01-09'
places:
  - 'Centreville, VA'
---
The basic idea is you should be able to type in anything you remember about a website and the system resurfaces it. 

For example, there's this site that gets linked a lot from Hacker News that has a very distinctive yellow background. I remember  nothing about the site other than it's yellow and linked from HN. So I could search:

```text
color:yellow
from:Hacker News
```

I'm imagining a series of modules that provide different ways to search the store of websites. Color might be one, time, content, image, so on and so forth. These could be added over time to support more natural search depending on how people want to find things. 

...

The combination of a browser extension plus a background service might work nicely. So the extension is collecting sites/content and sending them to the service, which is categorizing everything as it comes in. Search is handled by the background service. This way data could be stored anywhere on the filesystem or the cloud and pulled in by this background service.  

...

I'm not exactly sure how to deal with the tradeoff between space used and retrievability. Obviously some amount of content will need to be quickly retrievable and searchable, but that will take up a lot of storage (need to run the experiment to see how much is generated in a day of browsing). Maybe this is a good place to take advantage of the brain's capacity to forget by offloading older content to the cloud or external drives. Further back searches take longer, which honestly feels natural anyway. I'd want a system to give me some sort of feedback that it's *working hard* to resurface old stuff. If that process can slowly reveal things I remember seeing around the time of the target site, that's even better. Then it's really like a time machine. 

...

Still need to think about exploration, though I definitely think the MVP of this system is retrieval. 

I came across something in this vein I wrote last year:

> There seem to be two different problems to think about: the past and the future.

> The past can be described as a "path" or a "chain" that brought you to the point you are. The key goal here is to make the path visual as a way of reducing cognitive overhead or providing a kind of a record.

> The future is the potential. It's guided by goals, perhaps, or by the content on the page. Where can I go next? How do I figure out where I want to go next? It seems to me this is often somewhat unconsidered, so there's an element of exporability; what is it that catches your eye?

> The solution to these problems *might* be technically simple. Mostly because *we're* pretty simple in this regard; there are strong biological limits to the amount of information we can keep in memory. How we frame our experience of what we've seen before can be complex, but the way that it manifests in a system has to be simple or else we can't engage with it effectively and meaningfully.

> So the key would seem to be breaking down the process of browsing to the elements being acted on and crucially maintaining those elements and actions, while at the same time *adding possible actions*. The concept of a "page," for example, is so fundamental to our understanding of the internet that it doesn't make sense to break it apart, for now at least. Nor does how we can interact with a page. So it's a matter of adding actions to existing elements. What else can I do to a page? Most broadly, how do we expand the space of potential actions?

