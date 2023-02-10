/**
 * Cryptography helper methods with a hash based off of config delivery ID and hub ID.
 * @param config Codec config with _meta.deliveryId
 * @param hub Hub ID string
 * @returns Encryption methods
 */
declare const CryptKeeper: (config: any, hub?: string) => {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
    decryptAll: () => any;
};
export { CryptKeeper };
