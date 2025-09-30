"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardinalUserGroups = exports.Role = exports.TokenType = exports.ApiAuthenticationMethod = void 0;
var ApiAuthenticationMethod;
(function (ApiAuthenticationMethod) {
    ApiAuthenticationMethod["Bearer"] = "Bearer";
    ApiAuthenticationMethod["Ghost"] = "Ghost";
    ApiAuthenticationMethod["CustomAPI"] = "CustomAPI";
    ApiAuthenticationMethod["ExternalAPI"] = "ExternalAPI";
})(ApiAuthenticationMethod || (exports.ApiAuthenticationMethod = ApiAuthenticationMethod = {}));
var TokenType;
(function (TokenType) {
    TokenType["ACCESS"] = "ACCESS";
    TokenType["REFRESH"] = "REFRESH";
    TokenType["CHANGEPASSWORD"] = "CHANGEPASSWORD";
    TokenType["VERIFYEMAIL"] = "VERIFYEMAIL";
    TokenType["APIACCESS"] = "APIACCESS";
})(TokenType || (exports.TokenType = TokenType = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["MODERATOR"] = "MODERATOR";
    Role["VIEWER"] = "VIEWER";
})(Role || (exports.Role = Role = {}));
var CardinalUserGroups;
(function (CardinalUserGroups) {
    CardinalUserGroups["ADMINISTRATORS"] = "ADMINISTRATORS";
    CardinalUserGroups["MANAGERS"] = "MANAGERS";
    CardinalUserGroups["USERS"] = "USERS";
    CardinalUserGroups["VIEWERS"] = "VIEWERS";
})(CardinalUserGroups || (exports.CardinalUserGroups = CardinalUserGroups = {}));
//# sourceMappingURL=auth.types.js.map