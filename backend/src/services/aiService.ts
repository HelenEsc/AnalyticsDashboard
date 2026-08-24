/**
 * AI integration placeholder.
 *
 * V1 intentionally does not execute arbitrary SQL from an LLM.
 * The production implementation should:
 * 1. Send the user question + approved tool definitions to an LLM.
 * 2. Let the model choose one of the approved tools.
 * 3. Execute the corresponding backend function.
 * 4. Send only the tool result back to the model for a natural-language answer.
 */

export async function answerQuestion(question: string) {
  return {
    answer:
      `AI integration is not connected yet. Received question: "${question}". ` +
      "The next step is to connect an LLM and expose only approved SQL tools.",
    tool: null
  };
}
