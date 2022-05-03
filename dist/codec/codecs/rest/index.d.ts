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
    SchemaURI: string;
    getAPI: (config: RestCommerceCodecConfig) => CommerceAPI;
};
export default restCodec;
