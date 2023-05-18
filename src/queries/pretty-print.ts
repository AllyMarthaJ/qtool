import { Query } from "./query";

// Demo query
// ["hello","world","panda","dog"]
// can be dealt with similar

export function strToQuery(str: string): Query {
	return {
		type: "context",
		context: "literal",
		value: str,
	};
}

export const prettyPrintQuery: Query = {
	type: "context",
	context: "data",
	dependents: [
		{
			type: "interpreter",
			interpreter: "string",
			dependents: [
				{
					type: "grep",
					// prettier-ignore
					find: strToQuery("[\\[\\]]"),
					repl: strToQuery(""),
					dependents: [
						{
							type: "grep",
							find: strToQuery(","),
							repl: strToQuery("\n"),
						},
					],
				},
			],
		},
	],
};
