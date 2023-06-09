import {
	Query,
	QueryContext,
	QueryDig,
	QueryFetch,
	QuerySed,
	QueryInterpreter,
	QueryGrep,
} from "./queries/query";
import clipboard from "copy-paste";

const queryStack: Query[] = [];

export function runQuery(data: any, query: Query): any[] {
	let queryResults: any[] = [];

	queryStack.push(query);

	// Handle filter queries.
	// These should never have a reference to their dependents.
	switch (query.type) {
		case "context":
			queryResults = handleContext(data, query);
			break;
		case "interpreter":
			queryResults = handleInterpreter(data, query);
			break;
		case "sed":
			queryResults = [handleSed(data, query)];
			break;
		case "fetch":
			queryResults = [handleFetch(data, query)];
			break;
		case "dig":
			queryResults = [handleDig(data, query)];
			break;
		case "stack_query":
			const _query = queryStack[query.queryId ?? 0];

			queryResults = runQuery(data, _query);
			break;
		case "grep":
			queryResults = handleGrep(data, query);
			break;
	}

	const dependents = handleConditional(data, query);

	// Handle aggregate queries.
	// An aggregate query will access its dependents.
	switch (query.type) {
		case "conditional":
		case "join":
			queryResults = dependents ? [data] : [];
			break;
	}

	if (!dependents) {
		return queryResults;
	}

	const queryDependentResults = dependents
		.map((dependent) =>
			queryResults.map((queryResult) => runQuery(queryResult, dependent))
		)
		.flat(2);

	queryStack.pop();

	return join(queryDependentResults, query);
}

function trySingleResultSubQuery(data: any, query: Query): any {
	const queryResult = runQuery(data, query);

	if (queryResult.length > 1) {
		error("Too many Subquery results to parse.");
	}

	return queryResult[0];
}

function join(result: any[], query: Query): any[] {
	if (query.type !== "join") {
		return result;
	}

	switch (query.on) {
		case "array":
			return result;
		case "merge":
			if (result.every((entry) => typeof entry === "object")) {
				// result is [{...}, {...}, ...];
				return [
					result.reduce(
						(accum, entry) => ({
							...accum,
							...entry,
						}),
						{}
					),
				];
			} else if (result.every((entry) => Array.isArray(entry))) {
				// result is [[...], [...], ...]
				return result.reduce(
					(accum, entry) => [...accum, ...entry],
					[]
				);
			} else {
				error("Not a consistent array or object.");
				return [];
			}
		case "object":
			const defaultKeyQuery = query.key;
			return [
				result.reduce((accum, entry) => {
					const _for = trySingleResultSubQuery(
						entry,
						defaultKeyQuery
					);
					if (typeof _for !== "string" && typeof _for !== "number") {
						error(
							"Subquery returned an unkeyable result. Try reinterpreting it as a string."
						);
					}
					return { ...accum, [_for]: entry };
				}, {}),
			];
		case "string": {
			const _for = trySingleResultSubQuery(result, query.delimiter);

			if (_for && typeof _for !== "string") {
				error(
					"Subquery returned an unkeyable result. Try reinterpreting it as a string."
				);
			}

			return [result.join(_for)];
		}
	}
}

function error(message: string) {
	throw {
		error: message,
		queryStack: queryStack.map((query) =>
			JSON.stringify({ ...query, dependents: undefined })
		),
	};
}

function handleConditional(data: any, query: Query) {
	if (query.type !== "conditional") {
		return query.dependents;
	}

	const queryConditionalResult = runQuery(data, query.query);

	if (queryConditionalResult.some((result) => !!result) === !query.invert) {
		return query.dependents;
	} else {
		return;
	}
}

function handleFetch(data: any, fetch: QueryFetch) {
	if (typeof data !== "object") {
		return;
	}

	// implicit use case is arrays
	const _for = trySingleResultSubQuery(data, fetch.node);

	if (typeof _for !== "string" && typeof _for !== "number") {
		error(
			"Subquery returned an unkeyable result. Try reinterpreting it as a string."
		);
	}

	return data[_for];
}

function handleDig(data: any, dig: QueryDig, seqIndex = 0): any {
	if (dig.nodes.length === 0 || seqIndex > dig.nodes.length) {
		error("Bad node sequence; did you forget to dig for something?");
	}

	if (typeof data !== "object") {
		// somewhat jank, but allow node sequences to
		// assert on raw values too
		if (data === dig.nodes[seqIndex]) {
			return data;
		} else {
			return;
		}
	}

	const _for = trySingleResultSubQuery(data, dig.nodes[seqIndex]);

	if (typeof _for !== "string" && typeof _for !== "number") {
		error(
			"Subquery returned an unkeyable result. Try reinterpreting it as a string."
		);
	}

	if (data[_for]) {
		if (seqIndex === dig.nodes.length - 1) {
			// we've reached the end of the sequence; this is the node
			return data[_for];
		} else {
			// the data's there, but we're not finishing digging
			return handleDig(data[_for], dig, seqIndex + 1);
		}
	}

	// not found at all...
	// if inexact, we should keep the seqIndex so we can keep looking
	// lower and lower
	// if exact, we should terminate
	if (dig.inexact) {
		if (typeof data === "object" || Array.isArray(data)) {
			const digChildren: any[] = Object.entries(data)
				.map(([_, child]) => handleDig(child, dig, seqIndex))
				.filter((digResult) => !!digResult);
			if (digChildren.length > 0) {
				return digChildren[0];
			}
		}
	}
}

function handleGrep(data: any, grep: QueryGrep) {
	if (typeof data === "string") {
		const _find = trySingleResultSubQuery(data, grep.find);
		const _flags = grep.flags
			? trySingleResultSubQuery(data, grep.flags)
			: "g";

		if (typeof _find !== "string" || typeof _flags !== "string") {
			error("Subquery returned an unusable result for greping with.");
			return [];
		}

		const regex = new RegExp(_find, _flags);

		let grepResult = [];
		let result;
		if (grep.all) {
			console.log(regex);
			while ((result = regex.exec(data)) !== null) {
				const groups =
					result.length > 0
						? result.slice(1).reduce((accum, group, i) => {
								return { ...accum, [`${i}`]: group };
						  }, {})
						: {};
				grepResult.push({
					match: result[0],
					groups: groups,
				});
			}
		} else {
			const result = regex.exec(data);
			if (result) {
				const groups =
					result.length > 0
						? result.slice(1).reduce((accum, group, i) => {
								return { ...accum, [`${i}`]: group };
						  }, {})
						: {};
				grepResult.push({
					match: result[0],
					groups: groups,
				});
			}
		}

		return grepResult;
	} else {
		error("Can't grep a non-string. Try reinterpreting.");
		return [];
	}
}

function handleSed(data: any, sed: QuerySed) {
	if (typeof data === "string") {
		const _find = trySingleResultSubQuery(data, sed.find);
		const _repl = trySingleResultSubQuery(data, sed.repl);
		const _flags = sed.flags
			? trySingleResultSubQuery(data, sed.flags)
			: "g";

		if (
			typeof _find !== "string" ||
			typeof _repl !== "string" ||
			typeof _flags !== "string"
		) {
			error("Subquery returned an unusable result for sed'ing with.");
		}

		const regex = new RegExp(_find, _flags);

		return data.replace(regex, _repl);
	} else {
		error("Can't grep a non-string. Try reinterpreting.");
	}
}

function handleContext(data: any, context: QueryContext): any[] {
	switch (context.context) {
		case "clipboard":
			return [clipboard.paste()];
		case "for_each":
			if (Array.isArray(data)) {
				return [...data];
			} else if (typeof data === "object") {
				return Object.entries(data).map(([k, v]) => ({
					key: k,
					value: v,
				}));
			} else {
				error("Can't enumerate over non-array structure.");
				return [];
			}
		case "data":
			return [data]; // lol
		case "literal":
			// ts sucks
			if ("value" in context) {
				return [context.value];
			}
		default:
			error("Context is unsupported.");
			return [];
	}
}

function handleInterpreter(data: any, interpreter: QueryInterpreter): any[] {
	switch (interpreter.interpreter) {
		case "string":
			if (Array.isArray(data)) {
				// easiest to not overencode stuff
				// where need be
				return [JSON.stringify(data)];
			}
			switch (typeof data) {
				case "bigint":
				case "boolean":
				case "number":
				case "string":
				case "symbol":
					return [String(data)];
				case "object":
					return [JSON.stringify(data, null, 2)];
				default:
					return [];
			}
		case "generic":
			// handle this as json parse
			// array means run everything over each dependent
			switch (typeof data) {
				case "string":
					try {
						return [JSON.parse(data)];
					} catch {
						error("Couldn't parse data as object");
					}
				case "object":
					return [data];
				default:
					return [];
			}
	}
}
