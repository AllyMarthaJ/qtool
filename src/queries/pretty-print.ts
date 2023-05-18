import { parseQuery } from "./__parse_query";
import { Query } from "./query";
import { strToQuery } from "./__str_to_query";

const data = `["pandas are","fucking hot","i love them so mucH","pandas<333"]`;

export const prettyPrintQuery: Query = parseQuery(data, {
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
});
