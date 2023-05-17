import {
	Query,
	QueryContext,
	QueryGrep,
	QueryInterpreter,
} from "./queries/query";
import clipboard from "clipboardy";

export function runQuery(data: any, query: Query): any {
	let queryResults: any[] = [];
	switch (query.type) {
		case "context":
			queryResults = handleContext(data, query);
			break;
		case "interpreter":
			queryResults = handleInterpreter(data, query);
			break;
		case "grep":
			queryResults = [handleGrep(data, query)];
	}

	if (!query.dependents) {
		return queryResults;
	}

	return query.dependents.flatMap((dependent) =>
		queryResults.map((queryResult) => runQuery(queryResult, dependent))
	);
}

function handleGrep(data: any, grep: QueryGrep) {
	if (typeof data === "string") {
		const regex = new RegExp(grep.find, grep.flags ?? "g");

		return data.replace(regex, grep.repl);
	} else {
		return "not a string";
	}
}

function handleContext(data: any, context: QueryContext): any[] {
	switch (context.context) {
		case "clipboard":
			return [clipboard.readSync()];
		case "for_each":
			if (Array.isArray(data)) {
				return [...data];
			} else {
				throw "not an array";
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
				case "object":
					return [JSON.stringify(data, null, 2)];
				case "bigint":
				case "boolean":
				case "number":
					return [String(data)];
				case "string":
				case "symbol":
					return [`"${String(data)}"`];
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
