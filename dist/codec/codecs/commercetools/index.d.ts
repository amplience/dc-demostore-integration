import { CommerceAPI } from '../../../index';
import { CommerceToolsCodecConfiguration } from './types';
declare const commerceToolsCodec: {
    SchemaURI: string;
    getAPI: (config: CommerceToolsCodecConfiguration) => CommerceAPI;
};
export default commerceToolsCodec;
