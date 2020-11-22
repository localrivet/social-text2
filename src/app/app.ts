import { PluginProperties, SocialPlugin } from "./interfaces/social-plugin.interface";

import { Api } from "./api";
import { EditorManager } from "./editor/editor-manager";
import { HashTagPlugin } from './plugins/inline/hashtag';
import { LinkPlugin } from "./plugins/inline/link";

// 
export class App {

    private _api = new Api();
    private _socialPlugins: { [name: string]: SocialPlugin } = {};

    constructor() {
        this._loadInternalPlugins();
        this._bootstrap();
    }

    /**
     * register - Register new plugins
     * 
     * @param pluginName 
     * @param trigger 
     * @param callback 
     */
    register(pluginName: string, plugin: SocialPlugin) {
        if (this._socialPlugins[pluginName] == undefined) {
            this._socialPlugins[pluginName] = plugin;
            console.log('AppPlugin: Registered', pluginName);
        } else {
            throw new Error(`Plugin ${pluginName} is already loaded`);
        }
    }

    /**
     * extend - Extend registered functions
     * 
     * @param pluginName 
     * @param props 
     */
    extend<T>(pluginName: string, properties?: PluginProperties) {
        if (this._socialPlugins[pluginName] != undefined) {

            // if (props.callback) {
            //     this._socialPlugins[pluginName] = props.callback.bind(this._socialPlugins[pluginName]);
            // }

            if (properties.trigger) {
                this._socialPlugins[pluginName].trigger = properties.trigger;
            }

            if (properties) {
                this._socialPlugins[pluginName].properties = properties;
            }

            console.log('AppPlugin: Extended', pluginName);
        } else {
            throw new Error(`Plugin ${pluginName} cannot be extended, it is not loaded yet`);
        }
    }

    private _loadInternalPlugins() {

        this.register('hashtag', {
            trigger: /[\s.,;:!?]/,
            exec: HashTagPlugin
        });

        this.register('link', {
            trigger: /\s/,
            exec: LinkPlugin
        });
    }

    private _bootstrap() {
        window.addEventListener('load', () => {
            // load the plugins
            for (const name in this._socialPlugins) {
                const plugin = this._socialPlugins[name];
                if (typeof plugin == undefined) {
                    throw new Error(`Plugin ${name} failed to load`);
                }
            }

            // load the block-manager & set the triggers
            (new EditorManager(this._api)).setPlugins(this._socialPlugins);
        });

        // windowLoadEvent.pipe(take(1), map(() => {


        // })).subscribe();
    }
}