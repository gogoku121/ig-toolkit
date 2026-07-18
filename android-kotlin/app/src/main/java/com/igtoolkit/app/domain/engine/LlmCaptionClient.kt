package com.igtoolkit.app.domain.engine

import com.igtoolkit.app.BuildConfig
import com.igtoolkit.app.domain.model.GenerationRequest
import com.igtoolkit.app.domain.model.GenerationResult
import com.igtoolkit.app.domain.model.ResearchResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Calls the backend proxy's /generate endpoint for real LLM-based caption
 * generation. The backend holds the actual Groq API key server-side (see
 * backend/README.md) — this class never sees or ships a real LLM key.
 *
 * Throws on any failure (network, backend not configured, bad response) so
 * callers can fall back to CaptionGenerator's offline templates.
 */
@Singleton
class LlmCaptionClient @Inject constructor() {

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    val isConfigured: Boolean
        get() = BuildConfig.RESEARCH_BACKEND_URL.isNotEmpty() && BuildConfig.RESEARCH_BACKEND_APP_KEY.isNotEmpty()

    suspend fun generate(request: GenerationRequest, research: ResearchResult?): List<GenerationResult> {
        if (!isConfigured) {
            throw IllegalStateException("Backend not configured (RESEARCH_BACKEND_URL/APP_KEY empty)")
        }

        return withContext(Dispatchers.IO) {
            val body = buildRequestBody(request, research)
            val httpRequest = Request.Builder()
                .url("${BuildConfig.RESEARCH_BACKEND_URL}/generate")
                .header("X-App-Key", BuildConfig.RESEARCH_BACKEND_APP_KEY)
                .post(body.toString().toRequestBody(jsonMediaType))
                .build()

            val response = httpClient.newCall(httpRequest).execute()
            if (!response.isSuccessful) {
                throw IllegalStateException("Backend /generate error: HTTP ${response.code}")
            }

            val responseBody = response.body?.string()
                ?: throw IllegalStateException("Empty response from backend /generate")

            parseResponse(responseBody, research)
        }
    }

    private fun buildRequestBody(request: GenerationRequest, research: ResearchResult?): JSONObject {
        return JSONObject().apply {
            put("topic", request.topic)
            put("personality", request.personality.displayName)
            put("personality_description", request.personality.description)
            put("goal", request.goal.displayName)
            put("versions", request.versions)
            put("research_insights", JSONArray(research?.insights?.map { it.text } ?: emptyList<String>()))
            put("research_keywords", JSONArray(research?.keywords?.map { it.word } ?: emptyList<String>()))
            put("research_pain_points", JSONArray(research?.painPoints?.map { it.text } ?: emptyList<String>()))
            put("research_entities", JSONArray(research?.entities?.map { it.name } ?: emptyList<String>()))
        }
    }

    private fun parseResponse(responseBody: String, research: ResearchResult?): List<GenerationResult> {
        val json = JSONObject(responseBody)
        val captionsArray = json.optJSONArray("captions")
            ?: throw IllegalStateException("Backend response missing 'captions'")

        return (0 until captionsArray.length()).map { i ->
            val entry = captionsArray.getJSONObject(i)
            val hashtagsArray = entry.optJSONArray("hashtags")
            val hashtags = hashtagsArray?.let { arr -> (0 until arr.length()).map { arr.getString(it) } } ?: emptyList()

            GenerationResult(
                caption = entry.getString("caption"),
                hashtags = hashtags,
                version = i + 1,
                quality = research?.qualityScore ?: 0,
                researchUsed = research != null && research.source != "local_knowledge",
                aiGenerated = true
            )
        }
    }
}
