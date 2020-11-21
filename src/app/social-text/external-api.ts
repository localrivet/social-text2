// import { SocialPlugin } from '../interfaces/social-plugin.interface';


// export type AppPlugin = { [name: string]: any };
// export const SocialPlugins: AppPlugin = {};

// export const SocialText = () => {
//     return {
//         register: (plugin: SocialPlugin) => {
//             if (!SocialPlugins[plugin.name]) {
//                 SocialPlugins[plugin.name] = plugin.exec;
//                 console.log('AppPlugin: Registered', plugin.name);
//             } else {
//                 throw new Error(`Plugin ${plugin.name} is already loaded`);
//             }
//         }
//     }
// };