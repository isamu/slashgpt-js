"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justRun = exports.callback = void 0;
const chat_utils_1 = require("./chat_utils");
const _1 = require("./");
const _2 = require("./");
const file_utils_1 = require("./file_utils");
const callback = (callback_type, data) => {
    if (callback_type === "bot") {
        (0, chat_utils_1.print_bot)("bot", JSON.stringify(data));
    }
};
exports.callback = callback;
const justRun = async (fileFullName) => {
    const manifest = (0, file_utils_1.readManifestData)(fileFullName);
    const config = new _2.ChatConfig("./");
    const session = new _1.ChatSession(config, manifest);
    session.append_user_question(manifest.sample);
    await session.call_loop(exports.callback);
    return session;
};
exports.justRun = justRun;
