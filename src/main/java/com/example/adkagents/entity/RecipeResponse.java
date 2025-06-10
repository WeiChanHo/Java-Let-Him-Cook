package com.example.adkagents.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "recipe_responses")
@Data
public class RecipeResponse {

    @Id
    private String id; // e.g. "dinner_suggestion_233"

    @Lob
    @Column(columnDefinition = "TEXT")
    private String rawJson;
}
