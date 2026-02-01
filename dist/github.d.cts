import { MessageContext } from "./interfaces.cjs";
import { HookCollection } from "before-after-hook";
import { request } from "@octokit/request";
import { graphql } from "@octokit/graphql";
import { RequestError } from "@octokit/request-error";
import { PaginateInterface } from "@octokit/plugin-paginate-rest";
import { legacyRestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/RequestMethod.d.ts
/**
 * HTTP Verb supported by GitHub's REST API
 */
type RequestMethod = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/Url.d.ts
/**
 * Relative or absolute URL. Examples: `'/orgs/{org}'`, `https://example.com/foo/bar`
 */
type Url = string;
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/Fetch.d.ts
/**
 * Browser's fetch method (or compatible such as fetch-mock)
 */
type Fetch = any;
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/RequestRequestOptions.d.ts
/**
 * Octokit-specific request options which are ignored for the actual request, but can be used by Octokit or plugins to manipulate how the request is sent or how a response is handled
 */
interface RequestRequestOptions {
  /**
   * Custom replacement for built-in fetch method. Useful for testing or request hooks.
   */
  fetch?: Fetch;
  /**
   * Use an `AbortController` instance to cancel a request. In node you can only cancel streamed requests.
   */
  signal?: AbortSignal;
  /**
   * If set to `false`, the response body will not be parsed and will be returned as a stream.
   */
  parseSuccessResponseBody?: boolean;
  redirect?: "follow" | "error" | "manual";
  [option: string]: any;
}
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/RequestHeaders.d.ts
interface RequestHeaders {
  /**
   * Avoid setting `headers.accept`, use `mediaType.{format|previews}` option instead.
   */
  accept?: string;
  /**
   * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
   */
  authorization?: string;
  /**
   * `user-agent` is set do a default and can be overwritten as needed.
   */
  "user-agent"?: string;
  [header: string]: string | number | undefined;
}
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/RequestParameters.d.ts
/**
 * Parameters that can be passed into `request(route, parameters)` or `endpoint(route, parameters)` methods
 */
interface RequestParameters {
  /**
   * Base URL to be used when a relative URL is passed, such as `/orgs/{org}`.
   * If `baseUrl` is `https://enterprise.acme-inc.com/api/v3`, then the request
   * will be sent to `https://enterprise.acme-inc.com/api/v3/orgs/{org}`.
   */
  baseUrl?: Url;
  /**
   * HTTP headers. Use lowercase keys.
   */
  headers?: RequestHeaders;
  /**
   * Media type options, see {@link https://developer.github.com/v3/media/|GitHub Developer Guide}
   */
  mediaType?: {
    /**
     * `json` by default. Can be `raw`, `text`, `html`, `full`, `diff`, `patch`, `sha`, `base64`. Depending on endpoint
     */
    format?: string;
    /**
     * Custom media type names of {@link https://docs.github.com/en/graphql/overview/schema-previews|GraphQL API Previews} without the `-preview` suffix.
     * Example for single preview: `['squirrel-girl']`.
     * Example for multiple previews: `['squirrel-girl', 'mister-fantastic']`.
     */
    previews?: string[];
  };
  /**
   * The name of the operation to execute.
   * Required only if multiple operations are present in the query document.
   */
  operationName?: string;
  /**
   * The GraphQL query string to be sent in the request.
   * This is required and must contain a valid GraphQL document.
   */
  query?: string;
  /**
   * Pass custom meta information for the request. The `request` object will be returned as is.
   */
  request?: RequestRequestOptions;
  /**
   * Any additional parameter will be passed as follows
   * 1. URL parameter if `':parameter'` or `{parameter}` is part of `url`
   * 2. Query parameter if `method` is `'GET'` or `'HEAD'`
   * 3. Request body if `parameter` is `'data'`
   * 4. JSON in the request body in the form of `body[parameter]` unless `parameter` key is `'data'`
   */
  [parameter: string]: unknown;
}
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/ResponseHeaders.d.ts
interface ResponseHeaders {
  "cache-control"?: string;
  "content-length"?: number;
  "content-type"?: string;
  date?: string;
  etag?: string;
  "last-modified"?: string;
  link?: string;
  location?: string;
  server?: string;
  status?: string;
  vary?: string;
  "x-accepted-github-permissions"?: string;
  "x-github-mediatype"?: string;
  "x-github-request-id"?: string;
  "x-oauth-scopes"?: string;
  "x-ratelimit-limit"?: string;
  "x-ratelimit-remaining"?: string;
  "x-ratelimit-reset"?: string;
  [header: string]: string | number | undefined;
}
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/OctokitResponse.d.ts
interface OctokitResponse<T, S extends number = number> {
  headers: ResponseHeaders;
  /**
   * http response code
   */
  status: S;
  /**
   * URL of response after all redirects
   */
  url: Url;
  /**
   * Response data as documented in the REST API reference documentation at https://docs.github.com/rest/reference
   */
  data: T;
}
//#endregion
//#region node_modules/.pnpm/@octokit+types@16.0.0/node_modules/@octokit/types/dist-types/EndpointDefaults.d.ts
/**
 * The `.endpoint()` method is guaranteed to set all keys defined by RequestParameters
 * as well as the method property.
 */
interface EndpointDefaults extends RequestParameters {
  baseUrl: Url;
  method: RequestMethod;
  url?: Url;
  headers: RequestHeaders & {
    accept: string;
    "user-agent": string;
  };
  mediaType: {
    format: string;
    previews?: string[];
  };
}
//#endregion
//#region node_modules/.pnpm/@octokit+core@7.0.6/node_modules/@octokit/core/dist-types/types.d.ts
interface OctokitOptions {
  authStrategy?: any;
  auth?: any;
  userAgent?: string;
  previews?: string[];
  baseUrl?: string;
  log?: {
    debug: (message: string) => unknown;
    info: (message: string) => unknown;
    warn: (message: string) => unknown;
    error: (message: string) => unknown;
  };
  request?: RequestRequestOptions;
  timeZone?: string;
  [option: string]: any;
}
type Constructor<T> = new (...args: any[]) => T;
type ReturnTypeOf<T extends AnyFunction | AnyFunction[]> = T extends AnyFunction ? ReturnType<T> : T extends AnyFunction[] ? UnionToIntersection<Exclude<ReturnType<T[number]>, void>> : never;
/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
type UnionToIntersection<Union> = (Union extends any ? (argument: Union) => void : never) extends ((argument: infer Intersection) => void) ? Intersection : never;
type AnyFunction = (...args: any) => any;
type OctokitPlugin = (octokit: Octokit$1, options: OctokitOptions) => {
  [key: string]: any;
} | void;
type Hooks = {
  request: {
    Options: Required<EndpointDefaults>;
    Result: OctokitResponse<any>;
    Error: RequestError | Error;
  };
  [key: string]: {
    Options: unknown;
    Result: unknown;
    Error: unknown;
  };
};
//#endregion
//#region node_modules/.pnpm/@octokit+core@7.0.6/node_modules/@octokit/core/dist-types/index.d.ts
declare class Octokit$1 {
  static VERSION: string;
  static defaults<S extends Constructor<any>>(this: S, defaults: OctokitOptions | Function): typeof this;
  static plugins: OctokitPlugin[];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin<S extends Constructor<any> & {
    plugins: any[];
  }, T extends OctokitPlugin[]>(this: S, ...newPlugins: T): typeof this & Constructor<UnionToIntersection<ReturnTypeOf<T>>>;
  constructor(options?: OctokitOptions);
  request: typeof request;
  graphql: typeof graphql;
  log: {
    debug: (message: string, additionalInfo?: object) => any;
    info: (message: string, additionalInfo?: object) => any;
    warn: (message: string, additionalInfo?: object) => any;
    error: (message: string, additionalInfo?: object) => any;
    [key: string]: any;
  };
  hook: HookCollection<Hooks>;
  auth: (...args: unknown[]) => Promise<unknown>;
}
//#endregion
//#region node_modules/.pnpm/@octokit+action@8.0.4/node_modules/@octokit/action/dist-types/index.d.ts
declare const Octokit: typeof Octokit$1 & Constructor<{
  paginate: PaginateInterface;
} & ReturnType<typeof legacyRestEndpointMethods>>;
type Octokit = InstanceType<typeof Octokit>;
//#endregion
//#region src/github.d.ts
/**
 * Update the comment of the current PR
 * if lucky and past comment does not exist, create it.
 * if lucky and past comment exists, update it.
 * if not lucky, delete the comment.
 *
 * @param octokit {Octokit} the octokit instance
 * @param prNum {number} the PR number
 * @param userLogin {string} the user login name
 * @param message {MessageContext} the message context
 */
declare function updateMessage(octokit: Octokit, prNum: number, userLogin: string, message: MessageContext): Promise<void>;
/**
 * Get commit ids of the current PR
 * @param octokit {Octokit} the octokit instance
 * @returns commit ids {string[]}
 */
declare function getCommitIds(octokit: Octokit): Promise<string[]>;
/**
 * Get login name of the current user
 * By default, this returns `github-actions[bot]`
 * @param octokit {Octokit} the octokit instance
 * @returns user login {string}
 */
declare function getUserLogin(octokit: Octokit): Promise<string>;
//#endregion
export { getCommitIds, getUserLogin, updateMessage };
//# sourceMappingURL=github.d.cts.map