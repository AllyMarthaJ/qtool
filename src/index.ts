import { ProseMirrorToPlaintext } from "./examples/pm-to-plaintext";
import { throwError } from "./examples/throws-error";
import { runQuery } from "./query-runner";

const queryResult = runQuery({}, ProseMirrorToPlaintext);

queryResult.forEach((result) => {
	console.log("RESULT");
	if (typeof result === "string") {
		console.log(result);
	} else {
		console.log(JSON.stringify(result, null, 2));
	}
});
