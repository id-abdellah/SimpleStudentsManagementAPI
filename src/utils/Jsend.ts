export enum JsendStatus {
    SUCCESS = "success",
    FAIL = "fail",
    ERROR = "error"
}

export class Jsend {
    status: JsendStatus;
    data?: any;
    message?: string;

    constructor(status: JsendStatus, data?: any, message?: string) {
        this.status = status;
        if (status === JsendStatus.ERROR || status === JsendStatus.FAIL) {
            this.message = message || "An Error Occured";
            this.data = data || null;
        } else {
            this.data = data
        }
    }
}