import { ManifestData } from "./types";
import Manifest from "./manifest";
import ChatHistory from "./chat_history";
import ChatConfig from "./chat_config";
declare class ChatSession {
    username: string;
    manifest: Manifest;
    history: ChatHistory;
    prompt: string;
    private llm_model;
    private config;
    constructor(config: ChatConfig, manifest_data: ManifestData);
    botname(): string;
    append_message(role: string, content: string, preset: boolean, name?: string, function_data?: any): void;
    append_user_question(message: string): void;
    call_llm(): Promise<{
        res: string | null;
        function_call: import("./function/function_call").default | null;
    }>;
    call_loop(callback: (callback_type: string, data: string) => void): Promise<void>;
}
export default ChatSession;
