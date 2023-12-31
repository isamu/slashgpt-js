import Manifest from "../manifest";
import ChatHistory from "../chat_history";
declare class FunctionCall {
    private manifest;
    private function_call_data;
    private function_name;
    private call_arguments;
    constructor(data: Record<string, string>, manifest: Manifest);
    function_data(): {
        function_name: string;
        call_arguments: Record<string, unknown>;
    };
    name(): string;
    get_call_arguments(): any;
    process_function_call(history: ChatHistory, verbose?: boolean): {
        function_message: null;
        function_name: null;
        should_call_llm: boolean;
        call_arguments?: undefined;
    } | {
        function_message: string;
        function_name: string;
        should_call_llm: boolean;
        call_arguments: Record<string, unknown>;
    };
}
export default FunctionCall;
