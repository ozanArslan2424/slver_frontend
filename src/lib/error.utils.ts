import { isObjectWith, isObjectWithPath } from "@/lib/utils";

type ResponseError = { response: { data: { message: string } } };
type MessageError = { message: string };

export function getErrorMessage(err: unknown): string {
	if (typeof err === "string") {
		return err;
	} else if (isObjectWithPath<ResponseError>(err, "response", "data")) {
		const data = err.response.data;
		if (typeof data === "string") {
			return data;
		} else if (isObjectWith<MessageError>(data, "message")) {
			return data.message;
		} else {
			return "Unknown error";
		}
	} else if (isObjectWith<MessageError>(err, "message")) {
		return err.message;
	} else {
		return "Unknown error";
	}
}
