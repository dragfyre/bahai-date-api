export type Integer = number;
export type Float = number;
export type DateConfig = {
    latitude: Float;
    longitude: Float;
    timezoneId: string;
};
export type ArbitraryArgumentToConvert = any;
export type BadiDateInfo = {
    message: string;
    badi_date: {
        year: Integer;
        month: Integer;
        day: Integer;
        month_name: string;
        timezone_id: string;
    };
    greg_date: {
        year: Integer;
        month: Integer;
        day: Integer;
        hour: Integer;
        minute: Integer;
        second: Integer;
        timezoneOffset: Integer;
    };
};
export type BadiDateResponse = {
    now: luxon.DateTime;
    nowBadi: LocalBadiDate;
    json: BadiDateInfo;
};
export type FullDateConfig = Partial<DateConfig> & {
    year: Integer;
    month: Integer;
    day: Integer;
    hour: Integer;
    minute: Integer;
    second: Integer;
};
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
export function test(req: import("express").Request, res: import("express").Response): void;
/**
* @typedef {object} BadiDateInfo
* @property {string} message
* @property {object} badi_date
* @property {Integer} badi_date.year
* @property {Integer} badi_date.month
* @property {Integer} badi_date.day
* @property {string} badi_date.month_name
* @property {string} badi_date.timezone_id
* @property {object} greg_date
* @property {Integer} greg_date.year
* @property {Integer} greg_date.month
* @property {Integer} greg_date.day
* @property {Integer} greg_date.hour
* @property {Integer} greg_date.minute
* @property {Integer} greg_date.second
* @property {Integer} greg_date.timezoneOffset
*/
/**
* @typedef {object} BadiDateResponse
* @property {DateTime} now
* @property {LocalBadiDate} nowBadi
* @property {BadiDateInfo} json
*/
/**
 * @param {Partial<DateConfig>} dateObj
 * @returns {BadiDateResponse}
 */
export function getTodayJSON(dateObj?: Partial<DateConfig>): BadiDateResponse;
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
export function today(req: import("express").Request, res: import("express").Response): void;
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
export function todayHtml(req: import("express").Request, res: import("express").Response): void;
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
export function date(req: import("express").Request, res: import("express").Response): void;
/**
 * @typedef {Partial<DateConfig> & {
 *   year: Integer,
 *   month: Integer,
 *   day: Integer,
 *   hour: Integer,
 *   minute: Integer,
 *   second: Integer
 * }} FullDateConfig
 */
/**
 * @param {Partial<FullDateConfig>} dateObj
 * @returns {BadiDateResponse}
 */
export function getDate(dateObj: Partial<FullDateConfig>): BadiDateResponse;
import * as luxon from 'luxon';
import { LocalBadiDate } from 'badidate';
