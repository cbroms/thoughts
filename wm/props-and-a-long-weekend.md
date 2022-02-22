---
backlinks: []
forwardlinks: []
node: Props and a long weekend
updates:
  - '2022-02-19'
id: '27041665'
places:
  - 'Berkeley, CA'
daily: true
---
![Something that occurred to me last night was that I should make the page previews package a bit more flexible. By that I mean it could be useful to accept arbitrary props in the form lp-* on the a tag itself. So the user could for example do something like lp-title="My Title" without having to touch the config for the specific element in question. This is especially powerful when combined with events emitted from the package. For example, if there were an event fired when the preview loads, you could listen to this event, then change the element's props accordingly. So imagine if you have a template like this: slot title="lp-loading" and were listening for the onLoad event or something like that. Then the event fired, and you'd change the attribute on the element from lp-loading=true to lp-loading=false. The package would handle the rest, changing that prop on the web component, which would then change the content of the slot. You now have the full capacity to change the template, beyond what's provided by default by the package. Seems like something like that would be necessary to ensure the package can actually be extended in a fully custom way. Anyway, besides that not a ton else to mention today. We're going to spend the evening over at my parents' house, as my aunt is here for the weekend, So it shouldn't be a particularly productive weekend, but it should be a pretty nice one. It's a holiday on Monday so maybe I'll get to implementing what I outlined above then. 10:00AM / 58F / High of 69F / Clear and sunny](images/27041665/DptatXENQZ-daily.webp "")
