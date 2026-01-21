# Implementation Notes

- Rounding total tonnes and total value to nearest whole number in portfolio summary for simplicity. Assuming a precise avg price is probable useful.
- I would have use react-query for data fetching and caching, but opted for simplicity with useEffect and useState.
