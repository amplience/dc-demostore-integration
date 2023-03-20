"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodecError = exports.catchAxiosErrors = exports.CodecErrorType = void 0;
/**
 * Codec error types.
 */
var CodecErrorType;
(function (CodecErrorType) {
    CodecErrorType[CodecErrorType["IncorrectArguments"] = 0] = "IncorrectArguments";
    CodecErrorType[CodecErrorType["AuthUnreachable"] = 1] = "AuthUnreachable";
    CodecErrorType[CodecErrorType["AuthError"] = 2] = "AuthError";
    CodecErrorType[CodecErrorType["ApiUnreachable"] = 3] = "ApiUnreachable";
    CodecErrorType[CodecErrorType["ApiError"] = 4] = "ApiError";
    CodecErrorType[CodecErrorType["ApiGraphQL"] = 5] = "ApiGraphQL";
    CodecErrorType[CodecErrorType["NotAuthenticated"] = 6] = "NotAuthenticated";
    CodecErrorType[CodecErrorType["NotFound"] = 7] = "NotFound";
    CodecErrorType[CodecErrorType["NotSupported"] = 8] = "NotSupported";
})(CodecErrorType = exports.CodecErrorType || (exports.CodecErrorType = {}));
/**
 * Determine if the given character is uppercase.
 * @param char Character to check
 * @returns True if uppercase, false otherwise
 */
const isUpper = (char) => {
    return char.toLowerCase() !== char;
};
/**
 * Converts a codec error type to a descriptive string.
 * @param type The codec error type
 * @param info Optional info for the codec error
 * @returns A descriptive string
 */
function typeToString(type, info) {
    let name = CodecErrorType[type];
    for (let i = 1; i < name.length - 1; i++) {
        if (isUpper(name[i]) && !isUpper(name[i - 1]) && !isUpper(name[i + 1])) {
            name = name.substring(0, i) + ' ' + name.substring(i);
            i++;
        }
    }
    if (info.message && typeof info.message === 'string') {
        return `${name}: ${info.message}`;
    }
    return name + '.';
}
/**
 * Catch axios errors on a given method and convert them into a sanitized CodecError.
 * @param method Method to catch any axios errors for
 * @param errorType Default error type for unhandled errors
 * @returns Result of the method
 */
function catchAxiosErrors(method, errorType = CodecErrorType.ApiError) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield method();
        }
        catch (e) {
            if (e && e.response) {
                if (e.response.status === 404) {
                    errorType = CodecErrorType.NotFound;
                }
                else if (e.response.status === 401) {
                    errorType = CodecErrorType.NotAuthenticated;
                }
                throw new CodecError(errorType, { status: e.response.status, message: e.response.data });
            }
            throw e;
        }
    });
}
exports.catchAxiosErrors = catchAxiosErrors;
/**
 * A generic error that can be thrown by a codec, with an error type and optional information.
 */
class CodecError extends Error {
    constructor(type, info) {
        super(typeToString(type, info));
        this.type = type;
        this.info = info;
        this.errorType = 'codec';
    }
}
exports.CodecError = CodecError;
