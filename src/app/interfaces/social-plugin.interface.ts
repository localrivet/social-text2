import { Api } from './../api';
import { Block } from '../editor/block';

// export type ExecFunction = (api: Api) => {};

export interface PluginCallback {
    (api: Api, props?:PluginProperties): void
}

export interface SocialPlugin {
    trigger: RegExp;
    exec<PluginCallback>(api: Api, props: PluginProperties, ev?: KeyboardEvent);
    properties?: PluginProperties;
}

export interface PluginProperties {
    trigger?: RegExp,
    callback?<PluginCallback>(api: Api): void;
}

