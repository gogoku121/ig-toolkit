package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.domain.model.*
import kotlin.random.Random
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Caption Generator - currently template-based (see TASKS.md: replacing with
 * a real LLM call via the backend proxy is tracked separately).
 */
@Singleton
class CaptionGenerator @Inject constructor() {
    
    private val openingHooks = listOf(
        "Here's what nobody tells you about",
        "The truth about",
        "I spent years figuring this out:",
        "Stop scrolling. Here's the thing about",
        "Let me tell you something about",
        "The secret nobody talks about:",
        "This is going to surprise you, but",
        "Quick story about",
        "Most people get this wrong, but",
        "Here's the real deal about"
    )
    
    private val ctaPhrases = listOf(
        "Save this for later 👀",
        "Share with someone who needs this",
        "Double tap if you agree ❤️",
        "Comment your thoughts below 👇",
        "Save this post 📌",
        "Tag someone who needs to see this",
        "Repost if you learned something new",
        "Follow for more tips like this"
    )
    
    private val storytellingOpeners = listOf(
        "Last week, I learned something that changed everything.",
        "I used to think",
        "Storytime:",
        "3 years ago, I made the same mistake.",
        "Picture this:",
        "Let me take you back to when",
        "Here's what happened when I",
        "The moment I realized"
    )
    
    /**
     * Generate captions based on research data
     */
    fun generate(request: GenerationRequest, research: ResearchResult?): GenerationResult {
        // Determine if we have quality research
        val hasQualityResearch = research != null && 
            research.source != "local_knowledge" && 
            research.qualityScore >= 40
        
        // Build caption based on research quality
        val caption = buildString {
            // Opening hook - different based on research quality
            if (hasQualityResearch) {
                append(generateHook(request.topic, research))
            } else {
                append(generateFallbackHook(request.topic))
            }
            append("\n\n")
            
            // Main content - uses research if available
            append(generateMainContent(request, research, hasQualityResearch))
            append("\n\n")
            
            // Call to action
            append(ctaPhrases.random())
        }
        
        val hashtags = generateHashtags(request.topic, research, hasQualityResearch)
        
        return GenerationResult(
            caption = caption.trim(),
            hashtags = hashtags,
            version = 1,
            quality = research?.qualityScore ?: 0,
            researchUsed = hasQualityResearch
        )
    }
    
    /**
     * Generate multiple versions
     */
    fun generateMultiple(request: GenerationRequest, research: ResearchResult?, count: Int = 3): List<GenerationResult> {
        return (1..count).map { version: Int ->
            val result = generate(request.copy(versions = version), research)
            result.copy(version = version)
        }
    }
    
    private fun generateHook(topic: String, research: ResearchResult?): String {
        // Use research insights if available
        if (research != null && research.insights.isNotEmpty()) {
            val insight = research.insights.random()
            val hookType = Random.nextInt(3)
            
            return when (hookType) {
                0 -> "🎯 ${insight.text.take(80)}"
                1 -> "Here's what I found about ${topic.lowercase()}:"
                else -> openingHooks.random().replace("about", "with") + " ${topic.lowercase()}"
            }
        }
        
        return openingHooks.random() + " ${topic.lowercase()}"
    }
    
    private fun generateMainContent(request: GenerationRequest, research: ResearchResult?, useResearch: Boolean): String {
        val topic = request.topic
        val personality = request.personality
        
        // If research is poor quality, don't use it
        val effectiveResearch = if (useResearch) research else null
        
        return when (personality) {
            Personality.VIRAL_CREATOR -> generateViralContent(topic, effectiveResearch)
            Personality.LUXURY_BRAND -> generateLuxuryContent(topic, effectiveResearch)
            Personality.EDUCATIONAL -> generateEducationalContent(topic, effectiveResearch)
            Personality.STORYTELLER -> generateStoryContent(topic, effectiveResearch)
            Personality.FUNNY -> generateFunnyContent(topic, effectiveResearch)
            else -> generateStandardContent(topic, effectiveResearch)
        }
    }
    
    /**
     * Fallback hook when no research is available
     */
    private fun generateFallbackHook(topic: String): String {
        val hooks = listOf(
            "Here's what you need to know about ${topic.lowercase()}:",
            "The truth about ${topic.lowercase()} might surprise you.",
            "Everything you're about to read on ${topic.lowercase()} is worth saving.",
            "Let me explain why ${topic.lowercase()} matters more than you think.",
            "This is your complete guide to ${topic.lowercase()}."
        )
        return hooks.random()
    }
    
    private fun generateViralContent(topic: String, research: ResearchResult?): String {
        val sb = StringBuilder()
        
        // Use pain points if available
        if (research?.painPoints?.isNotEmpty() == true) {
            val pain = research.painPoints.random()
            sb.append("You know that feeling when ${pain.text}?\n\n")
        }
        
        // Key insight
        if (research?.insights?.isNotEmpty() == true) {
            sb.append("Here's the thing nobody tells you:\n")
            sb.append("${research.insights.first().text}\n\n")
        }
        
        // Main point
        sb.append("This is why it matters for your ${topic.lowercase()}.\n\n")
        
        // Question to engage
        if (research?.questions?.isNotEmpty() == true) {
            sb.append("${research.questions.first().text}\n")
        } else {
            sb.append("What's your take? 🤔")
        }
        
        return sb.toString()
    }
    
    private fun generateLuxuryContent(topic: String, research: ResearchResult?): String {
        return buildString {
            append("✨ Elevating your understanding of ${topic.lowercase()}.\n\n")
            
            if (research?.entities?.isNotEmpty() == true) {
                append("In the world of ${research.entities.first().name}:\n\n")
            }
            
            append("Exceptional quality meets intentional living.\n\n")
            
            research?.keywords?.take(3)?.forEach { kw: Keyword ->
                append("• ${kw.word.replaceFirstChar { c -> c.uppercase() }}\n")
            }
        }
    }
    
    private fun generateEducationalContent(topic: String, research: ResearchResult?): String {
        return buildString {
            append("📚 Here's what you need to know about ${topic.lowercase()}:\n\n")
            
            if (research?.questions?.isNotEmpty() == true) {
                append("Key question: ${research.questions.first().text}\n\n")
            }
            
            if (research?.keywords?.isNotEmpty() == true) {
                append("Key concepts:\n")
                research.keywords.take(4).forEach { kw: Keyword ->
                    append("• ${kw.word.replaceFirstChar { c -> c.uppercase() }}\n")
                }
                append("\n")
            }
            
            if (research?.examples?.isNotEmpty() == true) {
                append("For example: ${research.examples.first()}\n")
            }
        }
    }
    
    private fun generateStoryContent(topic: String, research: ResearchResult?): String {
        return buildString {
            append("${storytellingOpeners.random()} ${topic.lowercase()}.\n\n")
            
            if (research?.entities?.isNotEmpty() == true) {
                val entity = research.entities.first()
                append("I was thinking about ${entity.name} when it hit me.\n\n")
            }
            
            append("What I learned changed how I see everything.\n\n")
            
            if (research?.insights?.isNotEmpty() == true) {
                append("${research.insights.first().text}\n\n")
            }
            
            append("Have you experienced something similar?")
        }
    }
    
    private fun generateFunnyContent(topic: String, research: ResearchResult?): String {
        return buildString {
            append("Me: *creates content about ${topic.lowercase()}*\n\n")
            
            if (research?.trends?.isNotEmpty() == true) {
                append("Reality: ${research.trends.random().text}\n\n")
            } else {
                append("Also me: *googles ${topic.lowercase()} for the 5th time today*\n\n")
            }
            
            append("Anyway, here's your daily reminder that we're all just winging it. 💀\n\n")
            
            append("What's your struggle with ${topic.lowercase()}? 👇")
        }
    }
    
    private fun generateStandardContent(topic: String, research: ResearchResult?): String {
        return buildString {
            append("Let's talk about ${topic.lowercase()}.\n\n")
            
            if (research?.keywords?.isNotEmpty() == true) {
                research.keywords.take(3).forEach { keyword ->
                    append("• ${keyword.word.replaceFirstChar { it.uppercase() }}\n")
                }
                append("\n")
            }
            
            if (research?.insights?.isNotEmpty() == true) {
                append("${research.insights.first().text}\n\n")
            }
            
            append("What would you add? 💬")
        }
    }
    
    private fun generateHashtags(topic: String, research: ResearchResult?, useResearch: Boolean): List<String> {
        val hashtags = mutableListOf<String>()
        
        // Add topic-based hashtags
        topic.split(" ").forEach { word ->
            if (word.length > 2) {
                hashtags.add("#${word.replaceFirstChar { it.uppercase() }}")
            }
        }
        
        // Add generic Instagram hashtags
        hashtags.addAll(listOf(
            "#ContentCreator",
            "#InstagramTips",
            "#SocialMedia",
            "#InstaGood",
            "#Motivation"
        ))
        
        // Add research-based hashtags if available
        if (useResearch) {
            research?.entities?.take(2)?.forEach { ent: Entity ->
                hashtags.add("#${ent.name.replace(" ", "")}")
            }
            research?.keywords?.take(3)?.forEach { kw: Keyword ->
                hashtags.add("#${kw.word.replaceFirstChar { it.uppercase() }}")
            }
        }
        
        return hashtags.distinct().take(15)
    }
}
