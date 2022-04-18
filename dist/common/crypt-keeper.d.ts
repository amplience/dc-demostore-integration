declare const CryptKeeper: (config: any) => {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
    decryptAll: () => any;
};
export default CryptKeeper;
