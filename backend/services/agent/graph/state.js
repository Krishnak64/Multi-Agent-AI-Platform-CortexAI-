import { Annotation } from "@langchain/langgraph";


export const agentState=Annotation.Root({
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation(),  // store which agent is use for response like chat, search etc
    conversationId:Annotation(),
    searchResults:Annotation(),
    images:Annotation(),
    artifacts:Annotation(),
    userId:Annotation(),
    file:Annotation()
})  