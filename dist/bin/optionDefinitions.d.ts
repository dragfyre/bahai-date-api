export type CoveradgeOptions = object;
/**
 * @typedef {object} CoveradgeOptions
 */
declare const optionDefinitions: ({
    name: string;
    alias: string;
    type: StringConstructor;
    defaultOption: boolean;
    description: string;
    typeLabel: string;
} | {
    name: string;
    type: BooleanConstructor;
    description: string;
    alias?: undefined;
    defaultOption?: undefined;
    typeLabel?: undefined;
})[];
declare const cliSections: ({
    content: string;
    optionList?: undefined;
} | {
    optionList: ({
        name: string;
        alias: string;
        type: StringConstructor;
        defaultOption: boolean;
        description: string;
        typeLabel: string;
    } | {
        name: string;
        type: BooleanConstructor;
        description: string;
        alias?: undefined;
        defaultOption?: undefined;
        typeLabel?: undefined;
    })[];
    content?: undefined;
})[];
export { optionDefinitions as definitions, cliSections as sections };
