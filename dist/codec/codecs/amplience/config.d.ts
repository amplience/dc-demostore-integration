import { CodecConfiguration, ConfigCodec } from '../../codec';
import { CodecType } from '../../codec-manager';
import { AMPRSAConfiguration } from '../../../types';
import { ContentItem } from 'dc-management-sdk-js';
export declare class AmplienceCodecConfiguration extends CodecConfiguration {
    hub: string;
    environment: string;
}
export declare class AmplienceConfigCodec extends ConfigCodec {
    getContentItem(args: any): Promise<ContentItem>;
    getConfig(): Promise<AMPRSAConfiguration>;
}
declare const type: CodecType;
export default type;
