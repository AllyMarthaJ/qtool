import { dig } from "./queries/dig";
import { givePanda } from "./queries/give-panda";
import { ProseMirrorToPlaintext } from "./queries/pm-to-plaintext";
import { prettyPrintQuery as pp } from "./queries/pretty-print";
import { throwError } from "./queries/throws-error";
import { runQuery } from "./query-runner";

const queryResult = runQuery({}, throwError);

queryResult.forEach((result) => {
	console.log("RESULT");
	if (typeof result === "string") {
		console.log(result);
	} else {
		console.log(JSON.stringify(result, null, 2));
	}
});
