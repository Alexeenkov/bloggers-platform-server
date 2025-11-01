import {REGEXPS} from "@/shared/constants/regexps";
import type {ISO8601StringModel} from "@/shared/models";

export const createDateISO = (date: Date): ISO8601StringModel => {
    const dateISO = date.toISOString();

    if (!REGEXPS.date_ISO.test(dateISO)) {
        throw new Error(`Invalid ISO 8601 string: ${date}`);
    }

    return dateISO as ISO8601StringModel;
}