/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Collaborators/Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz
    Adam Thompson-Sharpe

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Minimum TypeScript Version: 2.8

type FieldValue = string | number | boolean;
/** Valid types for Field `type` property */
type FieldTypes =
    | 'text'
    | 'textarea'
    | 'button'
    | 'radio'
    | 'select'
    | 'checkbox'
    | 'unsigned int'
    | 'unsigned integer'
    | 'int'
    | 'integer'
    | 'float'
    | 'number'
    | 'hidden';

/** Init options where no custom types are defined */
interface InitOptionsNoCustom {
    /** Used for this instance of GM_config */
    id: string;
    /** Label the opened config window */
    title?: string | HTMLElement;
    fields: Record<string, Field>;
    /** Optional styling to apply to the menu */
    css?: string;
    /** Element to use for the config panel */
    frame?: HTMLElement;
    /** Optional styling to apply to the frame */
    frameStyle?: string;

    /** Handlers for different events */
    events?: {
        init?: GM_configStruct['onInit'];
        open?: GM_configStruct['onOpen'];
        save?: GM_configStruct['onSave'];
        close?: GM_configStruct['onClose'];
        reset?: GM_configStruct['onReset'];
    };
}

/** Init options where custom types are defined */
interface InitOptionsCustom<CustomTypes extends string> extends Omit<InitOptionsNoCustom, 'fields'> {
    fields: Record<string, Field<CustomTypes>>;
    /** Custom fields */
    types: { [type in CustomTypes]: CustomType };
}

/** Init options where the types key is only required if custom types are used */
type InitOptions<CustomTypes extends string> = InitOptionsNoCustom | InitOptionsCustom<CustomTypes>;

interface Field<CustomTypes extends string = never> {
    [key: string]: any;
    /** Display label for the field */
    label?: string | HTMLElement;
    /** Type of input */
    type: FieldTypes | CustomTypes;
    /** Text to show on hover */
    title?: string;
    /** Default value for field */
    default?: FieldValue;
    save?: boolean;
}

interface CustomType {
    default?: FieldValue | null;
    toNode?: GM_configField['toNode'];
    toValue?: GM_configField['toValue'];
    reset?: GM_configField['reset'];
}

/* GM_configStruct and related */

/** Initialize a GM_configStruct */
declare function GM_configInit<CustomTypes extends string>(
    config: GM_configStruct<CustomTypes>,
    // tslint:disable-next-line:no-unnecessary-generics
    options: InitOptions<CustomTypes>,
): void;

declare function GM_configDefaultValue(type: FieldTypes): FieldValue;

/** Create multiple GM_config instances */
declare class GM_configStruct<CustomTypes extends string = never> {
    constructor(options: InitOptions<CustomTypes>)

    /** Initialize GM_config */
    // tslint:disable-next-line:no-unnecessary-generics
    init<CustomTypes extends string>(options: InitOptions<CustomTypes>): void;

    /** Display the config panel */
    open(): void;
    /** Close the config panel */
    close(): void;

    /** Directly set the value of a field */
    set(fieldId: string, value: FieldValue): void;
    /**
     * Get a config value
     * @param getLive If true, runs `field.toValue()` instead of just getting `field.value`
     */
    get(fieldId: string, getLive?: boolean): FieldValue;
    /** Save the current values */
    save(): void;

    read(store?: string): any;

    write(store?: string, obj?: any): any;

    /**
     *
     * @param args If only one arg is passed, argument is passed to `document.createTextNode`.
     * With any other amount, args[0] is passed to `document.createElement` and the second arg
     * has something to do with event listeners?
     *
     * @todo Improve types based on
     * <https://github.com/sizzlemctwizzle/GM_config/blob/43fd0fe4/gm_config.js#L444-L455>
     */
    create(...args: [string] | [string, any] | []): HTMLElement;

    center(): void;

    remove(el: HTMLElement): void;

    /* Computed */

    /** Whether GreaseMonkey functions are present */
    isGM: boolean;
    /**
     * Either calls `localStorage.setItem` or `GM_setValue`.
     * Shouldn't be directly called
     */
    setValue(name: string, value: FieldValue): Promise<void> | void;
    /**
     * Get a value. Shouldn't be directly called
     *
     * @param name The name of the value
     * @param def The default to return if the value is not defined.
     * Only for localStorage fallback
     */
    getValue(name: string, def: FieldValue): FieldValue;

    /** Converts a JSON object to a string */
    stringify(obj: any): string;
    /**
     * Converts a string to a JSON object
     * @returns `undefined` if the string was an invalid object,
     * otherwise returns the parsed object
     */
    parser(jsonString: string): any;

    /** Log a string with multiple fallbacks */
    log(data: string): void;

    /* Created from GM_configInit */
    id: string;
    title: string;
    css: {
        basic: string[];
        basicPrefix: string;
        stylish: string;
    };
    frame?: HTMLElement;
    fields: Record<string, GM_configField>;
    onInit?: (this: GM_configStruct) => void;
    onOpen?: (this: GM_configStruct, document: Document, window: Window, frame: HTMLElement) => void;
    onSave?: (this: GM_configStruct, values: any) => void;
    onClose?: (this: GM_configStruct) => void;
    onReset?: (this: GM_configStruct) => void;
    isOpen: boolean;
}

/** Default GM_config object */
declare let GM_config: GM_configStruct;

/* GM_configField and related */

declare class GM_configField {
    constructor(
        settings: Field,
        stored: FieldValue | undefined,
        id: string,
        customType: CustomType | undefined,
        configId: string,
    )

    [key: string]: any;
    settings: Field;
    id: string;
    configId: string;
    node: HTMLElement | null;
    wrapper: HTMLElement | null;
    save: boolean;
    /** The stored value */
    value: FieldValue;
    default: FieldValue;

    create: GM_configStruct['create'];

    toNode(this: GM_configField, configId?: string): HTMLElement;

    /** Get value from field */
    toValue(this: GM_configField): FieldValue | null;

    reset(this: GM_configField): void;

    remove(el?: HTMLElement): void;

    reload(): void;

    _checkNumberRange(num: number, warn: string): true | null;
}
