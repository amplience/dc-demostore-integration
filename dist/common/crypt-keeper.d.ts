import { CodecConfiguration } from '..';
declare const CryptKeeper: (config: CodecConfiguration) => {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
};
export default CryptKeeper;
