import { strToQuery } from "./pretty-print";
import { Query } from "./query";

// for example
// [{"pandaName":"gary"},{"pandaName":"jerry"},{"pandaName":"ally"}]
export const givePanda: Query = {
	type: "context",
	context: "data",
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
};
