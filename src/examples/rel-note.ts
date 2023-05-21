import { strToQuery } from "../queries/__str_to_query";
import { Query } from "../queries/query";

// parse release notes!
export const ReleaseNoteQuery: Query = {
	type: "context",
	context: "clipboard",
	dependents: [
		{
			type: "grep",
			find: strToQuery(
				String.raw`<div class=".*?EachReleaseNoteContainer.*?">([\w\W]+?)</div>(?=<div class=".*?EachReleaseNoteContainer.*?">|</section>)`
			),
			flags: strToQuery("g"),
			all: true,
			dependents: [
				{
					type: "fetch",
					node: strToQuery("groups"),
					join: {
						on: "object",
						key: strToQuery("panda"), // noop
						spread: true,
					},
					dependents: [
						{
							type: "fetch",
							node: strToQuery("0"),
							join: {
								// neat little trick; the result of this node will be
								// { heading: "..." }
								// as the dependents is a single value
								on: "object",
								key: strToQuery("heading"),
							},
							dependents: [
								{
									type: "grep",
									find: strToQuery(`<h3.*?>(.*?)</h3>`),
									flags: strToQuery("g"),
									dependents: [
										{
											type: "fetch",
											node: strToQuery("groups"),
											dependents: [
												{
													type: "fetch",
													node: strToQuery("0"),
												},
											],
										},
									],
								},
							],
						},
						{
							type: "fetch",
							node: strToQuery("0"),
							join: {
								on: "object",
								key: strToQuery("date"),
							},
							dependents: [
								{
									type: "grep",
									find: strToQuery(
										`<p class=".*?DateContainer.*?">(.*?)</p>`
									),
									flags: strToQuery("g"),
									dependents: [
										{
											type: "fetch",
											node: strToQuery("groups"),
											dependents: [
												{
													type: "fetch",
													node: strToQuery("0"),
												},
											],
										},
									],
								},
							],
						},
						{
							type: "fetch",
							node: strToQuery("0"),
							join: {
								on: "object",
								key: strToQuery("content"),
							},
							dependents: [
								{
									type: "grep",
									find: strToQuery(
										String.raw`<div class=".*?DescriptionContainer.*?>([\w\W]+?)</div>`
									),
									flags: strToQuery("g"),
									dependents: [
										{
											type: "fetch",
											node: strToQuery("groups"),
											dependents: [
												{
													type: "fetch",
													node: strToQuery("0"),
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
