package com.example.adkagents.service;
import agents.recipe.RecipeAgent;
import com.google.adk.agents.BaseAgent;
import com.google.adk.runner.InMemoryRunner;
import com.google.adk.sessions.Session;
import com.google.adk.agents.RunConfig;
import com.google.adk.events.Event;
import com.google.genai.types.Content;
import com.google.genai.types.Part;
import io.reactivex.rxjava3.core.Flowable;

import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class RecipeAgentService {


    private final InMemoryRunner runner;
    private final Session session;
    private final BaseAgent agent;

    public RecipeAgentService(){

        this.agent = RecipeAgent.ROOT_AGENT;
        this.runner =  new InMemoryRunner((agent));
        this.session = runner.sessionService().createSession((
            agent.name()
        ), "tmp-user").blockingGet();
    }

    public String runRequest(String userInput){
        try {
        Content userMessage = Content.fromParts(Part.fromText(userInput));
        Flowable<Event> events = runner.runWithSessionId(session.id(), userMessage, RunConfig.builder().build());

        StringBuilder response = new StringBuilder();
        events.blockingForEach(event -> {
            event.content().ifPresent(content -> {
                content.parts().ifPresent(parts -> {
                    for (Part part : parts) {
                        part.text().ifPresent(response::append);
                    }
                });
            });
        });

            return response.toString();
        } catch (Exception e) {
            e.printStackTrace(); // 👈 This will show the real error
            return "Agent crashed: " + e.getMessage();
        }
    }
}
