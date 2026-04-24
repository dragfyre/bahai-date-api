export default createServer;
/**
 * @param {{
 *   app?: import('express').Application
 *   rateLimit?: {
 *     windowMs: number,
 *     max: number
 *   }
 * }} [app]
 * @returns {import('express').Application}
 */
declare function createServer({ app, rateLimit }?: {
    app?: import("express").Application;
    rateLimit?: {
        windowMs: number;
        max: number;
    };
}): import("express").Application;
