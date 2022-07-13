---
backlinks:
  - investing
forwardlinks: []
node: Discounted Cash Flow
updates:
  - '2022-07-09'
id: '39890452'
places:
  - 'Berkeley, CA'
---
The idea behind the discounted cash flow model is to try and figure out what the intrinsic value of a company is. 

Take the company's free cash flow and extrapolate over 10 years given a reasonable growth rate. Here's AAPL's cash flow over 10 years assuming a 10% growth rate. 

```text
$92,953,000.00
$102,248,300.00
$112,473,130.00
$123,720,443.00
$136,092,487.30
$149,701,736.03
$164,671,909.63
$181,139,100.60
$199,253,010.66
$219,178,311.72
$241,096,142.89
```

Then, assuming the company will be sold after ten years, calculate the price it would be sold for by taking the cash flow ten years from now and multiplying by the company's average free cash flow multiple (that is, FCF divided by the company's market cap.) I found AAPL's average free cash flow multiple to be about 15. So, the terminal value would be:

```text
$241,096,142.89 * 15 = $3,838,490,459.89
```

Now the discounted part. The whole idea of this method is to figure out if it's worth waiting for the return given the opportunity cost. Let's assume we'd have an annual growth rate of 15% if we invested our money elsewhere (very high, but the higher this number the more conservative the final intrinsic value is.) 

So, for each year, we can take the projected cash flow and multiply it by this hypothetical opportunity cost of 15% to get what this cash flow is actually worth to us after accounting for the opportunity cost. For example, AAPL's 2023's cash flow would be adjusted like so:

```text
$102,248,300.00 * 1.15 = $88,911,565.22
```

After doing this adjustment for each year of projected cash flow as well as the terminal value, we can now add all the years of discounted cash flow and terminal value. If the sum of all discounted cash flows is less than the current market cap of the company, it is worth buying. 

Current market cap - Sum of discounted cash flows: 
 
```text
$2,379,870,000.00 - $4,754,839,158.02 = -2,374,969,158.02
```

There's one extra little detail to consider, which is a margin of safety. Since this is a projection, we can add a little bit of safety and only opt to buy the company if the difference between the current market cap and the intrinsic value is less than a certain threshold, maybe 20%. If the difference is still negative, there's theoretically a higher likelihood of higher returns since the difference between the intrinsic value and current value is greater, even after taking of 20% or so off.  

