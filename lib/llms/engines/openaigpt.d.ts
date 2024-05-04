import { LlmUsage } from "../../types";
import Manifest from "../../manifest";
import FunctionCall from "../../function/function_call";
import { LLMEngineBase } from "../../llms/engines/base";
import OpenAI, { ClientOptions } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
export declare class LLMEngineOpenAIGPT extends LLMEngineBase {
    openai: OpenAI;
    constructor(option?: ClientOptions);
    chat_completion(messages: ChatCompletionMessageParam[], manifest: Manifest, verbose: boolean, callbackStraming?: (message: string) => void): Promise<{
        role: "assistant";
        res: string | null;
        function_call: FunctionCall | null;
        usage: LlmUsage;
    }>;
}
