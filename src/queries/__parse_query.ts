import { Query } from "./query";

/**
 * Load a JSON string into the current context and then
 * parse it as an object.
 * @param str The JSON string to parse.
 * @param query The query to execute within the new context.
 * @returns The completed query
 */
export function parseQuery(str: string, query: Query): Query {
	return {
		type: "context",
		context: "literal",
		value: str,
		dependents: [
			{
				type: "interpreter",
				interpreter: "generic",
				dependents: [query],
			},
		],
	};
}
