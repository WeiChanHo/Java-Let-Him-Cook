package agents.recipe;

import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import com.google.adk.agents.BaseAgent;
import com.google.adk.agents.LlmAgent;
import com.google.adk.events.Event;
import com.google.adk.runner.InMemoryRunner;
import com.google.adk.sessions.Session;
import com.google.adk.tools.LongRunningFunctionTool;
import com.google.genai.types.Content;
import com.google.genai.types.Part;

import io.reactivex.rxjava3.core.Flowable;
public class RecipeAgent{
    private static String USER_ID = "user";
    private static String NAME = "recipe_agent";

    // The run your agent with Dev UI, the ROOT_AGENT should be a global public static variable.
    public static BaseAgent ROOT_AGENT = initAgent();
    public static BaseAgent initAgent() {
        return LlmAgent.builder()
            .name(NAME)
            .model("gemini-2.0-flash")
            .description("Agent to answer questions about how to cook a meal.")
            .instruction("""
            You are a helpful cooking assistant. Your job is to help users decide what meals they can cook.

            Rules:
            1. Only answer questions related to cooking, recipes, steps for making meals, drinks, desserts, or any other edible item.
            2. If the user doesn't mention what ingredients they have, ask them first.
            3. Provide clear, step-by-step instructions for each recipe.
            5. You may give multiple recipe options, but create a unique recipes_id for this ask and always follow the exact JSON format shown below.
            Format:
            ```json
            {
            "recipes_id": "dinner_suggestion_233"
            "recipes": [
                {
                "title": "Recipe Name",
                "ingredients": ["ingredient1", "ingredient2", "..."],
                "instructions": [
                    "Step 1",
                    "Step 2",
                    "... more steps"
                ],
                "estimated_time_minutes": 30,
                "difficulty": "easy",
                "warnings": ["Contains milk. Not suitable for people with dairy allergies."]
                },
                {
                "title": "Another Recipe",
                "ingredients": ["..."],
                "instructions": ["..."],
                "estimated_time_minutes": 45,
                "difficulty": "medium",
                "warnings": []
                },
                ........
            ]

            }
            6.After generate the recipes remember to call FunctionTool to Save Recipes
            """)
            .tools(
                LongRunningFunctionTool.create(SaveRecipesTool.class, "saveRecipes")
            )
            .build();
    }

    public static void main(String[] args) throws Exception {
        InMemoryRunner runner = new InMemoryRunner(ROOT_AGENT);

        Session session =
            runner
                .sessionService()
                .createSession(NAME, USER_ID)
                .blockingGet();

        try (Scanner scanner = new Scanner(System.in, StandardCharsets.UTF_8)) {
            while (true) {
                System.out.print("\nYou > ");
                String userInput = scanner.nextLine();

                if ("quit".equalsIgnoreCase(userInput)) {
                    break;
                }

                Content userMsg = Content.fromParts(Part.fromText(userInput));
                Flowable<Event> events = runner.runAsync(USER_ID, session.id(), userMsg);

                System.out.print("\nAgent > ");
                events.blockingForEach(event -> System.out.println(event.stringifyContent()));
            }
        }
    }
}