/**
 * MockXMLHttpRequest Class
 * @class
 */
window.MockXMLHttpRequest = class MockXMLHttpRequest {
    /**
     * New MockXMLHttpRequest constructor.
     */
    constructor() {
        this.data = {
            headers: {},
        };
        this.status = 200;
        this.timeout = 0;
        this.upload = {};
        this._response = 'Test';
    }

    /**
     * Abort the request if it has already been sent.
     */
    abort() {
        clearTimeout(this._uploadTimer);
        clearTimeout(this._progressTimer);
        clearTimeout(this._completeTimer);
    }

    /**
     * Initialize a request.
     * @param {string} method The request method.
     * @param {string} url The URL to send the request to.
     * @param {boolean} [async=true] Whether to perform the request asynchronously.
     * @param {string} [username] The username to authenticate with.
     * @param {string} [password] The password to authenticate with.
     */
    open(method, url, async = true, username = undefined, password = undefined) {
        this.data.method = method;
        this.data.url = url;
        this.data.async = async;
        this.data.username = username;
        this.data.password = password;
    }

    /**
     * Override the MIME type sent by the server.
     * @param {string} mimeType The MIME type to use.
     */
    overrideMimeType(mimeType) {
        this.data.mimeType = mimeType;
    }

    /**
     * Send the request.
     * @param {*} [data=null] Data to send with the request.
     */
    send(data = null) {
        this.data.body = data;

        if (this.responseType) {
            this.data.responseType = this.responseType;
        }

        if (this.timeout) {
            this.data.timeout = this.timeout;
        }

        if (this.upload && this.upload.onprogress) {
            this._uploadTimer = setTimeout((_) => {
                this._uploadTimer = null;

                const progressEvent = new Event('progress');
                progressEvent.loaded = 5000;
                progressEvent.total = 10000;

                this.upload.onprogress(progressEvent);
            }, 10);
        }

        if (this.onprogress) {
            this._progressTimer = setTimeout((_) => {
                this._progressTimer = null;

                const progressEvent = new Event('progress');
                progressEvent.loaded = 500;
                progressEvent.total = 1000;

                this.onprogress(progressEvent);
            }, 10);
        }

        this._completeTimer = setTimeout((_) => {
            this._completeTimer = null;

            if (this.forceError) {
                if (this.onerror) {
                    const errorEvent = new Event('error');
                    this.onerror(errorEvent);
                }
                return;
            }

            this.data.status = this.status;
            this.response = this._response;

            if (this.onload) {
                const loadEvent = new Event('load');
                this.onload(loadEvent);
            }
        }, 20);
    }

    /**
     * Set a value of a HTTP request header.
     * @param {string} header The header to set.
     * @param {string} value The value to set.
     */
    setRequestHeader(header, value) {
        this.data.headers[header] = value;
    }
};
