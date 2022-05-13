import { CodecStringConfig, StringProperty } from '../..';
import { CommerceAPI } from '../../..';
declare type CodecConfig = {
    productURL: StringProperty;
    categoryURL: StringProperty;
    customerGroupURL: StringProperty;
    translationsURL: StringProperty;
};
declare const restCodec: {
    schema: {
        uri: string;
        icon: string;
        properties: CodecConfig;
    };
    getAPI: (config: CodecStringConfig<CodecConfig>) => CommerceAPI;
};
export default restCodec;
