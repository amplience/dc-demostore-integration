/**
 * TODO
 * @param config
 * @param hub
 * @returns
 */
declare const CryptKeeper: (config: any, hub?: string) => {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
    decryptAll: () => any;
};
export { CryptKeeper };
