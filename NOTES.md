# Implementation Notes

### Frontend

- Total Tonnes and Total Value are rounded to nearest whole number in the portfolio summary for simplicity. I have assumed that a more precise Average Price is probable useful.

- The README doesn't explicitly call out filtering the table according the selected status, but I assume that would be a logic next step. The filter is currently implementated as part of the summary, but that would then have to become it's own component in the page, and it's state would be passed to the summary and the table.

- I would speak to a designer about the UX of the status filter. Currently it's using green which happens to look like the green for "available" in the table. It might be better to use a neutral color for the filter control to avoid confusion.

- I would have use react-query for data fetching and caching, but opted for simplicity with useEffect and useState. This would give a path to using Suspense too, which simplifies components with loading states.

- I've tried to use semantic HTML and accessibility improvements, but I suspect there are still areas for improvement. I expect with the right skill/context the default markup Claude generates could be decent.

- I removed the hover effect from the table heading as it implies interactivity which isn't there. In a real-world app you might want to add sorting or other interactions to the table header.

### Backend

- I elected to leave filtering in the express handler. In it's current form, "computeSummary" is reusable in different contexts because the caller can provided pre-filtered lists if that is appropriate. If I start pushing flags like "filter by status" into computeSummary the signature becomes less composable. Any complex filtering logic should be done before calling computeSummary, and that can be put in a "filterPositions" function if it needs to be used in multiple places.

- Chose to use query parameters for filtering as it keeps the API surface smaller and avoids duplication of similar endpoints. The same endpoint can handle both filtered and unfiltered requests.

- In a real-world API I'd consider using an approach that allowed for typesafe contracts on the client and server, so it's not possible to send invalid requests. That could be done with something like OpenAPI, Swagger or tRPC, or other API styles such as GraphQL.
