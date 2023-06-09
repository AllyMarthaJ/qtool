import { parseQuery } from "../queries/__parse_query";
import { strToQuery } from "../queries/__str_to_query";
import { Query } from "../queries/query";

// for example
const data = `[{"pandaName":"gary"},{"pandaName":"jerry"},{"pandaName":"ally"}]`;
export const givePanda: Query = parseQuery(data, {
	type: "context",
	context: "data", // i like starting things with 'context' even if this is a noop
	dependents: [
		{
			type: "interpreter",
			interpreter: "generic",
			dependents: [
				{
					type: "context",
					context: "for_each",
					dependents: [
						{
							type: "dig",
							nodes: [strToQuery("pandaName")],
						},
					],
				},
			],
		},
	],
});
