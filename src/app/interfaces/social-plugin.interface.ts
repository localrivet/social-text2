import { Api } from './../api';
import { Block } from '../editor/block';

// export type ExecFunction = (api: Api) => {};

export interface PluginCallback {
    (api: Api, props?: PluginProperties): void;
}

export interface SocialPlugin {
    trigger: RegExp | string;
    exec<PluginCallback>(api: Api, props: PluginProperties, ev?: KeyboardEvent);
    properties?: PluginProperties;
}

export interface PluginProperties {
    trigger?: RegExp | string;
    callback?<PluginCallback>(api: Api): void;
    attributes?: { [attribute: string]: any };
    styles?: { [style: string]: any };
    classes?: string[];
    dataset?: { [name: string]: any };
}

