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

// const data = `["pandas are","fucking hot","i love them so mucH","pandas<333"]`;

export const prettyPrintQuery: Query = {
	type: "context",
	context: "data",
	dependents: [
		{
			// this isn't necessary if the data is a string already
			// but if json meh
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
