import {
	Query,
	QueryCondition,
	QueryContext,
	QueryDig,
	QueryFetch,
	QueryGrep,
	QueryInterpreter,
} from "./queries/query";
import clipboard from "copy-paste";

export function runQuery(data: any, query: Query): any[] {
	let queryResults: any[] = [];

	const dependents = handleConditional(data, query);

	switch (query.type) {
		case "context":
			queryResults = handleContext(data, query);
			break;
		case "interpreter":
			queryResults = handleInterpreter(data, query);
			break;
		case "grep":
			queryResults = [handleGrep(data, query)];
			break;
		case "fetch":
			queryResults = [handleFetch(data, query)];
			break;
		case "dig":
			queryResults = [handleDig(data, query)];
			break;
		case "conditional":
			queryResults = dependents ? [data] : [];
			break;
	}

	if (!dependents) {
		return queryResults;
	}

	return dependents
		.map((dependent) =>
			queryResults.map((queryResult) => runQuery(queryResult, dependent))
		)
		.flat(2);
}

function trySingleResultSubQuery(data: any, query: Query): any {
	const queryResult = runQuery(data, query);

	if (queryResult.length > 1) {
		throw "too many subquery results";
	}

	return queryResult[0];
}

function handleConditional(data: any, query: Query) {
	if (query.type !== "conditional") {
		return query.dependents;
	}

	const queryConditionalResult = runQuery(data, query.query);

	if (queryConditionalResult.some((result) => !!result)) {
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
		throw "bad subquery result";
	}

	return data[_for];
}

function handleDig(data: any, dig: QueryDig, seqIndex = 0): any {
	if (dig.nodes.length === 0 || seqIndex > dig.nodes.length) {
		throw "can't dig on bad node sequence";
	}

	if (typeof data !== "object") {
		// don't throw we might hit a string or something which
		// is actually intentional
		return;
	}

	const _for = trySingleResultSubQuery(data, dig.nodes[seqIndex]);

	if (typeof _for !== "string" && typeof _for !== "number") {
		throw "bad subquery result";
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
		const _repl = trySingleResultSubQuery(data, grep.repl);
		const _flags = grep.flags
			? trySingleResultSubQuery(data, grep.flags)
			: "g";

		if (
			typeof _find !== "string" ||
			typeof _repl !== "string" ||
			typeof _flags !== "string"
		) {
			throw "bad subquery result";
		}

		const regex = new RegExp(_find, _flags);

		return data.replace(regex, _repl);
	} else {
		return "not a string";
	}
}

function handleContext(data: any, context: QueryContext): any[] {
	switch (context.context) {
		case "clipboard":
			return [clipboard.paste()];
		case "for_each":
			if (Array.isArray(data)) {
				return [...data];
			} else {
				throw "not an array";
			}
		case "data":
			return [data]; // lol
		case "literal":
			// ts sucks
			if ("value" in context) {
				return [context.value];
			}
		default:
			throw "unsupported context";
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
					return [JSON.parse(data)];
				case "object":
					return [data];
				default:
					return [];
			}
	}
}
