import { parseQuery } from "../queries/__parse_query";
import { Query } from "../queries/query";

// Why does this throw an error?
// We expect that fetch will only search for one object at
// a time.
// You can, however, do multiple fetches and that can be
// architected in a couple of ways.
// Try uncommenting one of the dependents in this example
// so that you can see that this query would be valid otherwise.
export const throwError: Query = parseQuery('{"hi":"world","panda":"gay"}', {
	type: "fetch",
	node: {
		type: "context",
		context: "literal",
		value: "",
		dependents: [
			{
				type: "context",
				context: "literal",
				value: "hi",
			},
			{
				type: "context",
				context: "literal",
				value: "panda",
			},
		],
	},
});
