# Implementation Notes

- Rounding total tonnes and total value to nearest whole number in portfolio summary for simplicity. Assuming a precise avg price is probable useful.
- I would have use react-query for data fetching and caching, but opted for simplicity with useEffect and useState. This would give a path to using Suspense too, which simplifies components with loading states.
- Elected to leave filtering in the handler - computeSummary is reusable in different contexts because the caller can provided pre-filtered lists if that is appropriate. If I start pushing flags like "filter by status" into computeSummary the signature becomes less composable. Any complex filtering logic should be done before calling computeSummary, and that can be put in a "filterPositions" function if it needs to be used in multiple places.
- Chose to use query parameters for filtering as it keeps the API surface smaller and avoids duplication of similar endpoints. The same endpoint can handle both filtered and unfiltered requests. In a real-world api I'd consider using an approach that allowed for typesafe contracts on the client and server, so it's not possible to send invalid requests.
- I've asked Claude to consider semantic HTML and accessibility improvements, but I suspect there are still areas for improvement.
- The README doesn't explicitly call out filtering the table according the selected status, but I assume that would be a logic next step. The filter is currently implementated as part of the summary, but that would then have to become it's own component in the page, and it's state would be passed to the summary and the table.
- I would speak to a designer about the UX of the status filter - should the colours map onto the colours used in the table, e.g.?
