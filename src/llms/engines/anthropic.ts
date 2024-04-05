import { ChatData, LlmUsage } from "@/types";

import Manifest from "@/manifest";
import FunctionCall from "@/function/function_call";

import { LLMEngineBase } from "./base";
import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";
import { ChatCompletionMessageParam } from "openai/resources/chat";

const functions2tools = (functions: { name: string; description: string; parameters: any }[]) => {
  return functions.map((f) => {
    const { name, description, parameters } = f;
    return {
      name,
      description,
      input_schema: parameters,
    };
  });
};

export class LLMEngineAnthropic extends LLMEngineBase {
  anthropic: Anthropic;

  constructor(option?: ClientOptions) {
    super();
    this.anthropic = option ? new Anthropic(option) : new Anthropic();
  }
  async chat_completion(messages: ChatCompletionMessageParam[], manifest: Manifest, verbose: boolean) {
    const functions = manifest.functions();
    const function_call_param = manifest.function_call();
    const model_name = manifest.model_name();

    const system = messages.length > 0 && messages[0].role === "system" ? messages[0].content ?? "" : undefined;

    const send_message = messages
      .filter((m) => {
        return ["user", "function", "assistant"].includes(m.role);
      })
      .map((a: any) => {
        const { role, content } = a;
        if (role === "function") {
          return {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: a.id,
                content: [{ type: "text", text: content }],
              },
            ],
          };
        }
        return { role, content } as any;
      });
    // console.log(JSON.stringify(send_message, null , "\t"), functions);

    const chatCompletion = await (() => {
      if (functions) {
        return this.anthropic.beta.tools.messages.create({
          system,
          max_tokens: 1024,
          model: "claude-3-opus-20240229",
          messages: send_message,
          tools: functions2tools(functions),
        }) as any;
      }
      return this.anthropic.messages.create({
        system,
        max_tokens: 1024,
        model: "claude-3-opus-20240229",
        messages: send_message,
      }) as any;
    })();

    const res = chatCompletion.content[0].text;
    const role = chatCompletion.role;

    const { input_tokens, output_tokens } = chatCompletion.usage;

    const usage = {
      prompt_tokens: input_tokens,
      completion_tokens: output_tokens,
      total_tokens: input_tokens + output_tokens,
    } as LlmUsage;

    const tu = (() => {
      if (chatCompletion.stop_reason === "tool_use") {
        const tool_use = chatCompletion.content.find((a: any) => a.type === "tool_use");
        if (tool_use) {
          return { name: tool_use.name, arguments: tool_use.input, tool_use_id: tool_use.id };
        }
      }
      return null;
    })();
    if (tu) {
      const function_call = new FunctionCall(tu as any, manifest);
      return { role, res: chatCompletion.content, function_call, usage: null };
    }
    return { role, res, function_call: null, usage: null };
  }

  conv(message: ChatData) {
    const { role, content, name, id } = message;
    if (id) {
      return { role, content, name, id } as ChatCompletionMessageParam;
    }
    return { role, content, name } as ChatCompletionMessageParam;
  }
}