import "./amplience/commerce";
import "./amplience/cms";
import "./amplience/config";

import { CMSCodec } from "../../codec/codec";
import { ContentItem } from "dc-management-sdk-js";
import { AmplienceCodecConfiguration } from "./amplience/operations";

export class AmplienceCMSCodec extends CMSCodec {
    async getContentItem(args: any): Promise<ContentItem> {
        let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
        let response = await fetch(`https://${(this.config as AmplienceCodecConfiguration).hub}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
        return (await response.json()).content
    }
}