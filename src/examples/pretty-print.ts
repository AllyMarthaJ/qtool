import { parseQuery } from "../queries/__parse_query";
import { strToQuery } from "../queries/__str_to_query";
import { Query } from "../queries/query";

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
					type: "sed",
					// prettier-ignore
					find: strToQuery("[\\[\\]]"),
					repl: strToQuery(""),
					dependents: [
						{
							type: "sed",
							find: strToQuery(","),
							repl: strToQuery("\n"),
						},
					],
				},
			],
		},
	],
});
