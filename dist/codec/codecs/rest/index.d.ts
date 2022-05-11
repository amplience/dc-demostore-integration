import { CommerceAPI } from '../../..';
declare type ConfigObject = {
    type: string;
    title: string;
    description: string;
};
declare type RestCommerceCodecConfigObject = {
    productURL: ConfigObject;
    categoryURL: ConfigObject;
    customerGroupURL: ConfigObject;
    translationsURL: ConfigObject;
};
declare type RestCommerceCodecConfig = {
    [Key in keyof RestCommerceCodecConfigObject]: string;
};
declare const restCodec: {
    schema: {
        uri: string;
        icon: string;
        properties: {
            productURL: {
                type: string;
                title: string;
                description: string;
            };
            categoryURL: {
                type: string;
                title: string;
                description: string;
            };
            customerGroupURL: {
                type: string;
                title: string;
                description: string;
            };
            translationsURL: {
                type: string;
                title: string;
                description: string;
            };
        };
    };
    getAPI: (config: RestCommerceCodecConfig) => CommerceAPI;
};
export default restCodec;
