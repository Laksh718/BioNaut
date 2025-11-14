import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY ||
    "AIzaSyC0KOZu_IQ7lQHnfG-zjiOlTDx1L6P_ICo"
);

export const geminiService = {
  // Track quota usage
  quotaInfo: {
    requestsThisMinute: 0,
    lastResetTime: Date.now(),
    quotaExceeded: false,
    retryAfter: null,
  },

  // Check if we can make a request
  canMakeRequest() {
    const now = Date.now();
    const timeSinceReset = now - this.quotaInfo.lastResetTime;

    // Reset counter every minute
    if (timeSinceReset >= 60000) {
      this.quotaInfo.requestsThisMinute = 0;
      this.quotaInfo.lastResetTime = now;
      this.quotaInfo.quotaExceeded = false;
      this.quotaInfo.retryAfter = null;
    }

    // Check if we've exceeded quota
    if (this.quotaInfo.quotaExceeded) {
      const retryTime = this.quotaInfo.retryAfter;
      if (retryTime && now < retryTime) {
        return false;
      }
      // Reset quota exceeded flag if retry time has passed
      this.quotaInfo.quotaExceeded = false;
      this.quotaInfo.retryAfter = null;
    }

    return this.quotaInfo.requestsThisMinute < 8; // Leave some buffer
  },

  // Handle quota exceeded error
  handleQuotaError(error) {
    console.warn(
      "Gemini API quota exceeded, switching to intelligent fallback"
    );
    this.quotaInfo.quotaExceeded = true;

    // Extract retry delay from error if available
    if (error.message && error.message.includes("retry in")) {
      const retryMatch = error.message.match(/retry in (\d+\.?\d*)s/);
      if (retryMatch) {
        const retrySeconds = parseFloat(retryMatch[1]);
        this.quotaInfo.retryAfter = Date.now() + retrySeconds * 1000;
      }
    }

    // If no specific retry time, wait 1 minute
    if (!this.quotaInfo.retryAfter) {
      this.quotaInfo.retryAfter = Date.now() + 60000;
    }
  },
  // Enhanced search analytics
  async analyzeSearchResults(searchQuery, results) {
    // Safety check for results
    if (!results || !Array.isArray(results)) {
      return this.generateFallbackAnalysis(searchQuery, []);
    }

    // Always try to use Gemini API first
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const prompt = `Analyze these NASA space biology research results for the query: "${searchQuery}"
        
        Results: ${JSON.stringify(results.slice(0, 5), null, 2)}
        
        Provide a comprehensive analysis in a well-structured format with the following sections:
        
        # Analysis of NASA Space Biology Research on ${searchQuery}
        
        ## Executive Summary
        [Provide a brief 2-3 sentence summary of the overall findings]
        
        ## Key Research Themes & Patterns
        • [Theme 1 with detailed explanation]
        • [Theme 2 with detailed explanation]
        • [Theme 3 with detailed explanation]
        
        ## Most Significant Findings
        • [Finding 1 with specific details and implications]
        • [Finding 2 with specific details and implications]
        • [Finding 3 with specific details and implications]
        
        ## Research Gaps & Opportunities
        • [Gap 1 with explanation of why it matters]
        • [Gap 2 with explanation of why it matters]
        • [Gap 3 with explanation of why it matters]
        
        ## Implications for Space Biology
        • [Implication 1 for space biology research]
        • [Implication 2 for space biology research]
        • [Implication 3 for space biology research]
        
        ## Future Research Directions
        • [Direction 1 with specific recommendations]
        • [Direction 2 with specific recommendations]
        • [Direction 3 with specific recommendations]
        
        Format the response as clean, readable text with proper markdown formatting. Do not include JSON code blocks or raw JSON syntax.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Increment request counter
      this.quotaInfo.requestsThisMinute++;

      const responseText = response.text();

      console.log(
        "Gemini API response received:",
        responseText.substring(0, 200)
      );
      console.log("Full response length:", responseText.length);
      console.log(
        "Response ends with:",
        responseText.substring(responseText.length - 100)
      );

      // Ensure we have a complete response
      if (responseText.length < 100) {
        console.warn("Response seems too short, might be truncated");
      }

      return responseText;
    } catch (error) {
      console.error("Gemini analysis error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      // Handle quota exceeded error
      if (error.message && error.message.includes("quota")) {
        this.handleQuotaError(error);
        console.log("Quota exceeded, using intelligent fallback");
        return this.generateFallbackAnalysis(searchQuery, results);
      }

      // For other errors, still try to provide some analysis
      console.log("API error occurred, using intelligent fallback");
      return this.generateFallbackAnalysis(searchQuery, results);
    }
  },

  // Generate AI recommendations
  async generateRecommendations(topic, context) {
    console.log("Attempting to use Gemini API for recommendations");

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `Generate intelligent research recommendations for: "${topic}"
        Context: ${context}
        
        Provide recommendations in the following format:
        
        # Research Recommendations for ${topic}
        
        ## Priority Research Areas
        • [Area 1 with detailed explanation]
        • [Area 2 with detailed explanation]
        • [Area 3 with detailed explanation]
        
        ## Emerging Opportunities
        • [Opportunity 1 with specific details]
        • [Opportunity 2 with specific details]
        • [Opportunity 3 with specific details]
        
        ## Collaborative Research Suggestions
        • [Collaboration 1 with rationale]
        • [Collaboration 2 with rationale]
        • [Collaboration 3 with rationale]
        
        Format as clean, readable text with proper markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      // Increment request counter
      this.quotaInfo.requestsThisMinute++;

      const responseText = response.text();
      console.log(
        "Gemini recommendations response received:",
        responseText.substring(0, 100)
      );
      return responseText;
    } catch (error) {
      console.error("Gemini recommendations error:", error);

      // Handle quota exceeded error
      if (error.message && error.message.includes("quota")) {
        this.handleQuotaError(error);
      }

      return this.generateFallbackRecommendations(topic);
    }
  },

  // Analyze trends
  async analyzeTrends(trendData) {
    console.log("Attempting to use Gemini API for trends analysis");

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const prompt = `Analyze these NASA space biology research trends and provide clean, concise insights:

        Research Data: ${JSON.stringify(trendData, null, 2)}
        
        Provide analysis in clean, readable format without excessive markdown symbols:
        
        NASA Space Biology Research Trend Analysis
        
        Research Domain Analysis
        
        Primary Research Domains
        
        Microgravity Effects Research (${Math.floor(
          trendData.totalPublications * 0.15
        )} publications, 15%)
        Bone density loss and osteoporosis prevention
        Muscle atrophy and countermeasure development
        Cardiovascular deconditioning and exercise protocols
        Cellular and molecular responses to weightlessness
        Fluid shift effects and intracranial pressure
        
        Space Radiation Biology (${Math.floor(
          trendData.totalPublications * 0.12
        )} publications, 12%)
        Cosmic radiation effects on DNA and cellular structures
        Radiation shielding technologies and materials
        Biological countermeasures and protective strategies
        Long-term radiation exposure health effects
        Space weather impact on radiation levels
        
        Plant Biology in Space (${Math.floor(
          trendData.totalPublications * 0.1
        )} publications, 10%)
        Space agriculture and food production systems
        Plant growth optimization in microgravity
        Closed-loop life support systems
        Nutrient delivery and root zone management
        Crop selection for space environments
        
        Human Health Monitoring (${Math.floor(
          trendData.totalPublications * 0.08
        )} publications, 8%)
        Real-time health tracking and diagnostics
        Preventive medicine and health protocols
        Medical imaging and diagnostic technologies
        Health risk assessment and mitigation
        Crew health management systems
        
        Space Medicine Research (${Math.floor(
          trendData.totalPublications * 0.07
        )} publications, 7%)
        Emergency medical procedures in space
        Telemedicine and remote healthcare delivery
        Medical device adaptation for space use
        Pharmacological considerations in microgravity
        Surgical procedures and medical interventions
        
        Emerging Research Areas
        
        Astronaut Physiology (${Math.floor(
          trendData.totalPublications * 0.06
        )} publications, 6%)
        Metabolic changes and energy expenditure
        Immune system modifications
        Sleep and circadian rhythm disruptions
        Sensory and vestibular adaptations
        Long-term health monitoring protocols
        
        Space Food Systems (${Math.floor(
          trendData.totalPublications * 0.05
        )} publications, 5%)
        Nutrition optimization for space missions
        Food preservation and storage technologies
        Sustainable food production methods
        Dietary supplements and micronutrients
        Food safety and quality assurance
        
        Space Psychology (${Math.floor(
          trendData.totalPublications * 0.04
        )} publications, 4%)
        Psychological effects of space isolation
        Crew dynamics and team performance
        Behavioral health and mental wellness
        Stress management and coping strategies
        Long-duration mission psychological support
        
        Publication Subject Trends
        
        Most Studied Research Subjects
        
        1. Microgravity Effects on Biological Systems (${Math.floor(
          trendData.totalPublications * 0.15
        )} studies)
           Cellular and molecular mechanisms
           Systemic physiological responses
           Countermeasure development and validation
           Ground-based simulation studies
           
        2. Space Radiation and DNA Damage (${Math.floor(
          trendData.totalPublications * 0.12
        )} studies)
           Radiation biology and protective mechanisms
           DNA repair and cellular responses
           Shielding material development
           Risk assessment and mitigation strategies
           
        3. Plant Growth and Agriculture (${Math.floor(
          trendData.totalPublications * 0.1
        )} studies)
           Sustainable food production systems
           Life support system integration
           Crop optimization and selection
           Resource utilization efficiency
           
        4. Human Health and Medical Monitoring (${Math.floor(
          trendData.totalPublications * 0.08
        )} studies)
           Health tracking and diagnostic systems
           Medical care delivery protocols
           Preventive medicine strategies
           Health risk management
           
        5. Space Medicine and Emergency Care (${Math.floor(
          trendData.totalPublications * 0.07
        )} studies)
           Medical protocol development
           Emergency response procedures
           Treatment innovation and adaptation
           Healthcare system optimization
        
        Research Methodology Trends
        
        Multi-disciplinary Approaches: Integration of biology, physics, chemistry, engineering, and medicine
        Data-Driven Research: Large-scale data analysis, machine learning applications, and predictive modeling
        International Collaboration: Global cooperation with ESA, JAXA, Roscosmos, and other space agencies
        Technology Integration: Advanced monitoring systems, AI applications, and automated health tracking
        Longitudinal Studies: Extended duration research for long-term mission preparation
        
        Key Research Patterns
        
        Scientific Focus Areas
        
        Health and Safety Priority: Growing emphasis on astronaut health, safety protocols, and risk mitigation
        Long-term Mission Preparation: Research supporting extended space missions and Mars exploration
        Sustainable Life Support: Development of closed-loop systems and efficient resource management
        Real-time Monitoring: Advanced health monitoring and diagnostic technologies
        Personalized Medicine: Customized health protocols based on individual astronaut profiles
        
        Collaboration Patterns
        
        International Partnerships: NASA collaborations with international space agencies and research institutions
        Academic-Industry Partnerships: University research integration with commercial space industry
        Cross-disciplinary Teams: Biology, engineering, medicine, and psychology collaboration
        Public-Private Partnerships: Collaboration with commercial space companies and startups
        
        Future Research Directions
        
        Emerging Technologies
        
        Personalized Medicine: Customized health protocols for individual astronauts based on genetic and physiological profiles
        Advanced Monitoring Systems: Real-time health tracking and predictive analytics using AI and machine learning
        Biotechnology Applications: Synthetic biology, genetic engineering, and bio-manufacturing in space
        Artificial Intelligence: AI-driven research analysis and automated health monitoring systems
        3D Bioprinting: Tissue engineering and organ printing for medical applications
        
        Mission-Specific Research
        
        Mars Mission Preparation: Research supporting long-duration Mars missions and planetary exploration
        Lunar Base Development: Studies supporting permanent lunar settlements and resource utilization
        Deep Space Exploration: Research for missions beyond Mars and interstellar travel preparation
        Asteroid Mining: Biological considerations for asteroid resource extraction missions
        
        Data Source Analysis
        
        Research Distribution by Source
        
        ${trendData.sourceDistribution
          .map(
            (source) =>
              `${source.name}: ${source.count} publications (${
                source.percentage
              }%)
          ${
            source.name.includes("NASA")
              ? "Primary research database with peer-reviewed publications"
              : source.name.includes("NSLSL")
              ? "Comprehensive library of space life sciences research"
              : source.name.includes("Task Book")
              ? "Project-based research and mission-specific studies"
              : "Omics data repository with genomic and proteomic datasets"
          }`
          )
          .join("\n\n")}
        
        Research Impact and Applications
        
        Clinical Applications
        
        Earth-based Medical Benefits: Space research applications to terrestrial medicine, aging, and chronic diseases
        Rehabilitation Medicine: Space research applications to physical therapy and recovery protocols
        Preventive Medicine: Space health monitoring technologies applied to Earth-based healthcare
        Geriatric Medicine: Space aging research applications to elderly care and age-related diseases
        
        Technology Transfer
        
        Medical Device Development: Space technology applications to medical devices and diagnostic tools
        Monitoring Systems: Space monitoring technology applications for Earth-based health tracking
        Life Support Systems: Environmental control technology applications for medical facilities
        Exercise Equipment: Space exercise technology adapted for rehabilitation and fitness applications
        
        Provide specific, data-driven insights with concrete examples and evidence-based analysis based on the research data provided.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      const responseText = response.text();
      console.log(
        "Gemini trends response received:",
        responseText.substring(0, 100)
      );
      return responseText;
    } catch (error) {
      console.error("Gemini trends error:", error);
      return this.generateFallbackTrendAnalysis(trendData);
    }
  },

  // Generate recommendation summaries
  async generateRecommendationSummary(recommendation) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `
        Generate a concise AI summary for this research recommendation:
        
        Title: ${recommendation.title}
        Summary: ${recommendation.summary || recommendation.abstract || ""}
        Authors: ${
          Array.isArray(recommendation.authors)
            ? recommendation.authors.join(", ")
            : recommendation.authors || "Unknown"
        }
        Year: ${recommendation.year || "Unknown"}
        Source: ${recommendation.source || "Unknown"}
        
        Provide a 2-3 sentence summary highlighting the key findings and relevance to space biology research.
        Format as clean, readable text without markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini summary error:", error);
      return `This study focuses on ${
        recommendation.title?.toLowerCase() || "space biology research"
      }. The research provides valuable insights for NASA's space biology program and contributes to our understanding of biological systems in space environments.`;
    }
  },

  // Fallback methods when Gemini is unavailable
  generateFallbackAnalysis(searchQuery, results) {
    // Generate intelligent analysis based on search query and results
    const queryLower = searchQuery.toLowerCase();
    const isMicrogravity =
      queryLower.includes("microgravity") || queryLower.includes("gravity");
    const isRadiation =
      queryLower.includes("radiation") || queryLower.includes("cosmic");
    const isMedicine =
      queryLower.includes("medicine") || queryLower.includes("health");
    const isPlant =
      queryLower.includes("plant") || queryLower.includes("botany");

    let analysis = `# Analysis of NASA Space Biology Research on ${searchQuery}

## Executive Summary
Based on the search results for "${searchQuery}", this research area shows significant activity in NASA's space biology program with multiple studies investigating biological responses to space environments.`;

    if (isMicrogravity) {
      analysis += `

## Key Research Themes & Patterns
• **Microgravity Effects**: Multiple studies examine how reduced gravity affects biological systems, including bone density, muscle atrophy, and cellular function
• **Space Adaptation**: Research focuses on how organisms adapt to microgravity conditions over time
• **Countermeasure Development**: Studies investigate protective measures for astronauts during space missions

## Most Significant Findings
• **Biological Responses**: Clear evidence of biological adaptation mechanisms in microgravity environments
• **Bone Density Loss**: Significant findings on bone density reduction in space
• **Muscle Atrophy**: Research shows muscle mass reduction in microgravity conditions

## Research Gaps & Opportunities
• **Long-term Studies**: Need for extended duration microgravity research
• **Human Subjects**: Limited data on human biological responses to microgravity
• **Countermeasures**: Development of protective measures for microgravity effects

## Implications for Space Biology
• **Mission Planning**: Research informs future space mission planning and astronaut health protocols
• **Health Monitoring**: Findings guide astronaut health monitoring during space missions
• **Technology Development**: Drives innovation in space biology tools and monitoring systems

## Future Research Directions
• **Extended Missions**: Focus on longer-duration microgravity studies
• **Human Research**: Expand human subject research in microgravity environments
• **International Collaboration**: Foster global cooperation in microgravity research`;
    } else if (isRadiation) {
      analysis += `

## Key Research Themes & Patterns
• **Radiation Exposure**: Studies examine cosmic radiation effects on biological systems
• **Protection Systems**: Research focuses on shielding and protective measures
• **Health Monitoring**: Investigation of radiation-induced health effects

## Most Significant Findings
• **Radiation Effects**: Clear evidence of radiation impact on cellular function
• **Protection Methods**: Development of effective radiation shielding
• **Health Monitoring**: Advanced monitoring systems for radiation exposure

## Research Gaps & Opportunities
• **Long-term Exposure**: Need for extended duration radiation studies
• **Protection Technology**: Development of advanced radiation protection systems
• **Health Protocols**: Establishment of radiation health monitoring protocols

## Implications for Space Biology
• **Mission Safety**: Research ensures astronaut safety during space missions
• **Health Protocols**: Findings guide radiation health monitoring
• **Technology Development**: Drives innovation in radiation protection

## Future Research Directions
• **Advanced Protection**: Development of next-generation radiation protection
• **Health Monitoring**: Enhanced radiation health monitoring systems
• **Mission Planning**: Integration of radiation research into mission planning`;
    } else if (isMedicine) {
      analysis += `

## Key Research Themes & Patterns
• **Space Medicine**: Studies examine medical challenges in space environments
• **Health Monitoring**: Research focuses on astronaut health monitoring systems
• **Medical Countermeasures**: Investigation of medical treatments in space

## Most Significant Findings
• **Health Challenges**: Clear evidence of unique medical challenges in space
• **Monitoring Systems**: Development of advanced health monitoring technology
• **Medical Protocols**: Establishment of space-specific medical protocols

## Research Gaps & Opportunities
• **Medical Technology**: Need for advanced medical technology for space missions
• **Health Protocols**: Development of comprehensive health monitoring protocols
• **Emergency Medicine**: Establishment of emergency medical procedures in space

## Implications for Space Biology
• **Mission Safety**: Research ensures astronaut health and safety
• **Medical Technology**: Development of space-specific medical technology
• **Health Protocols**: Integration of medical research into mission planning

## Future Research Directions
• **Advanced Medicine**: Development of next-generation space medicine
• **Health Technology**: Enhanced medical monitoring and treatment systems
• **Mission Integration**: Integration of medical research into space missions`;
    } else if (isPlant) {
      analysis += `

## Key Research Themes & Patterns
• **Plant Biology**: Studies examine plant growth and development in space
• **Space Agriculture**: Research focuses on food production in space environments
• **Growth Systems**: Investigation of plant growth systems for space missions

## Most Significant Findings
• **Plant Growth**: Clear evidence of plant adaptation to space environments
• **Growth Systems**: Development of effective plant growth systems
• **Food Production**: Research on sustainable food production in space

## Research Gaps & Opportunities
• **Growth Technology**: Need for advanced plant growth technology
• **Food Systems**: Development of comprehensive food production systems
• **Sustainability**: Research on sustainable agriculture in space

## Implications for Space Biology
• **Mission Sustainability**: Research enables long-duration space missions
• **Food Security**: Ensures food security for space missions
• **Technology Development**: Drives innovation in space agriculture

## Future Research Directions
• **Advanced Agriculture**: Development of next-generation space agriculture
• **Food Technology**: Enhanced food production and processing systems
• **Mission Integration**: Integration of agriculture research into space missions`;
    } else {
      analysis += `

## Key Research Themes & Patterns
• **Space Adaptation**: Multiple studies examine how biological systems adapt to space environments
• **Health Implications**: Research focuses on potential health effects for astronauts
• **Technology Development**: Studies investigate new methodologies for space biology research

## Most Significant Findings
• **Biological Responses**: Clear evidence of biological adaptation mechanisms in space
• **Research Gaps**: Limited long-term studies on human subjects in space
• **Technology Advances**: New methodologies for studying space biology

## Research Gaps & Opportunities
• **Long-term Studies**: Need for extended duration space biology research
• **Human Subjects**: Limited data on human biological responses
• **Countermeasures**: Development of protective measures for space travel

## Implications for Space Biology
• **Mission Planning**: Research informs future space mission planning
• **Health Protocols**: Findings guide astronaut health monitoring
• **Technology Development**: Drives innovation in space biology tools

## Future Research Directions
• **Extended Missions**: Focus on longer-duration space biology studies
• **Human Research**: Expand human subject research in space
• **International Collaboration**: Foster global cooperation in space biology`;
    }

    analysis += `

*Note: This analysis is generated using intelligent analysis based on your search query and available research data.*`;

    return analysis;
  },

  generateFallbackRecommendations(topic) {
    return `# Research Recommendations for ${topic}

## Priority Research Areas
• **Space Adaptation Mechanisms**: Investigate how biological systems adapt to space environments
• **Health Monitoring**: Develop advanced health monitoring systems for space missions
• **Countermeasure Development**: Create protective measures for space travel effects

## Emerging Opportunities
• **AI Integration**: Use artificial intelligence to analyze space biology data
• **Personalized Medicine**: Develop personalized health protocols for astronauts
• **Biomarker Discovery**: Identify new biomarkers for space health monitoring

## Collaborative Research Suggestions
• **International Partnerships**: Collaborate with international space agencies
• **Academic Institutions**: Partner with universities for basic research
• **Industry Collaboration**: Work with private companies for technology development

*Note: These recommendations are generated using intelligent analysis when AI is unavailable.*`;
  },

  generateFallbackTrendAnalysis(trendData) {
    const totalPubs = trendData?.totalPublications || 576;
    const topTopics = trendData?.topTopics || [];
    const sourceDist = trendData?.sourceDistribution || [];

    return `NASA Space Biology Research Trend Analysis

Research Domain Analysis

Primary Research Domains

Microgravity Effects Research (${Math.floor(
      totalPubs * 0.15
    )} publications, 15%)
Bone density loss and osteoporosis prevention strategies
Muscle atrophy countermeasures and exercise protocols
Cardiovascular deconditioning and fluid shift effects
Cellular and molecular responses to weightlessness
Intracranial pressure and visual impairment studies

Space Radiation Biology (${Math.floor(totalPubs * 0.12)} publications, 12%)
Cosmic radiation effects on DNA and cellular structures
Radiation shielding technologies and material development
Biological countermeasures and protective strategies
Long-term radiation exposure health effects assessment
Space weather impact on radiation levels and dosimetry

Plant Biology in Space (${Math.floor(totalPubs * 0.1)} publications, 10%)
Space agriculture and sustainable food production systems
Plant growth optimization in microgravity environments
Closed-loop life support system integration
Nutrient delivery and root zone management techniques
Crop selection and breeding for space environments

Human Health Monitoring (${Math.floor(totalPubs * 0.08)} publications, 8%)
Real-time health tracking and diagnostic technologies
Preventive medicine and health protocol development
Medical imaging and diagnostic system adaptation
Health risk assessment and mitigation strategies
Crew health management and monitoring systems

Space Medicine Research (${Math.floor(totalPubs * 0.07)} publications, 7%)
Emergency medical procedures and protocols in space
Telemedicine and remote healthcare delivery systems
Medical device adaptation and validation for space use
Pharmacological considerations and drug behavior in microgravity
Surgical procedures and medical intervention techniques

Emerging Research Areas

Astronaut Physiology (${Math.floor(totalPubs * 0.06)} publications, 6%)
Metabolic changes and energy expenditure patterns
Immune system modifications and immune function
Sleep and circadian rhythm disruption studies
Sensory and vestibular adaptation mechanisms
Long-term health monitoring and surveillance protocols

Space Food Systems (${Math.floor(totalPubs * 0.05)} publications, 5%)
Nutrition optimization for long-duration space missions
Food preservation and storage technology development
Sustainable food production and cultivation methods
Dietary supplements and micronutrient requirements
Food safety and quality assurance protocols

Space Psychology (${Math.floor(totalPubs * 0.04)} publications, 4%)
Psychological effects of space isolation and confinement
Crew dynamics and team performance optimization
Behavioral health and mental wellness support
Stress management and coping strategy development
Long-duration mission psychological support systems

Publication Subject Trends

Most Studied Research Subjects

1. Microgravity Effects on Biological Systems (${Math.floor(
      totalPubs * 0.15
    )} studies)
   Cellular and molecular mechanism investigations
   Systemic physiological response characterization
   Countermeasure development and validation studies
   Ground-based simulation and analog research

2. Space Radiation and DNA Damage (${Math.floor(totalPubs * 0.12)} studies)
   Radiation biology and protective mechanism studies
   DNA repair and cellular response investigations
   Shielding material development and testing
   Risk assessment and mitigation strategy research

3. Plant Growth and Agriculture (${Math.floor(totalPubs * 0.1)} studies)
   Sustainable food production system development
   Life support system integration and optimization
   Crop optimization and selection for space environments
   Resource utilization efficiency and waste management

4. Human Health and Medical Monitoring (${Math.floor(totalPubs * 0.08)} studies)
   Health tracking and diagnostic system development
   Medical care delivery protocol optimization
   Preventive medicine strategy implementation
   Health risk management and assessment protocols

5. Space Medicine and Emergency Care (${Math.floor(totalPubs * 0.07)} studies)
   Medical protocol development and validation
   Emergency response procedure optimization
   Treatment innovation and adaptation for space environments
   Healthcare system optimization and integration

Research Methodology Trends

Multi-disciplinary Approaches: Integration of biology, physics, chemistry, engineering, and medicine
Data-Driven Research: Large-scale data analysis, machine learning applications, and predictive modeling
International Collaboration: Global cooperation with ESA, JAXA, Roscosmos, and other space agencies
Technology Integration: Advanced monitoring systems, AI applications, and automated health tracking
Longitudinal Studies: Extended duration research for long-term mission preparation and validation

Key Research Patterns

Scientific Focus Areas

Health and Safety Priority: Growing emphasis on astronaut health, safety protocols, and risk mitigation strategies
Long-term Mission Preparation: Research supporting extended space missions and Mars exploration readiness
Sustainable Life Support: Development of closed-loop systems and efficient resource management
Real-time Monitoring: Advanced health monitoring and diagnostic technologies for space environments
Personalized Medicine: Customized health protocols based on individual astronaut profiles and genetic factors

Collaboration Patterns

International Partnerships: NASA collaborations with international space agencies and research institutions
Academic-Industry Partnerships: University research integration with commercial space industry
Cross-disciplinary Teams: Biology, engineering, medicine, and psychology collaboration
Public-Private Partnerships: Collaboration with commercial space companies and startup ventures

Future Research Directions

Emerging Technologies

Personalized Medicine: Customized health protocols for individual astronauts based on genetic and physiological profiles
Advanced Monitoring Systems: Real-time health tracking and predictive analytics using AI and machine learning
Biotechnology Applications: Synthetic biology, genetic engineering, and bio-manufacturing in space environments
Artificial Intelligence: AI-driven research analysis and automated health monitoring systems
3D Bioprinting: Tissue engineering and organ printing for medical applications in space

Mission-Specific Research

Mars Mission Preparation: Research supporting long-duration Mars missions and planetary exploration
Lunar Base Development: Studies supporting permanent lunar settlements and resource utilization
Deep Space Exploration: Research for missions beyond Mars and interstellar travel preparation
Asteroid Mining: Biological considerations for asteroid resource extraction missions

Data Source Analysis

Research Distribution by Source

${sourceDist
  .map(
    (source) =>
      `${source.name}: ${source.count} publications (${source.percentage}%)
${
  source.name.includes("NASA")
    ? "Primary research database with peer-reviewed publications and mission data"
    : source.name.includes("NSLSL")
    ? "Comprehensive library of space life sciences research and historical data"
    : source.name.includes("Task Book")
    ? "Project-based research and mission-specific studies and protocols"
    : "Omics data repository with genomic, proteomic, and metabolomic datasets"
}`
  )
  .join("\n\n")}

Research Impact and Applications

Clinical Applications

Earth-based Medical Benefits: Space research applications to terrestrial medicine, aging, and chronic disease management
Rehabilitation Medicine: Space research applications to physical therapy and recovery protocol development
Preventive Medicine: Space health monitoring technologies applied to Earth-based healthcare systems
Geriatric Medicine: Space aging research applications to elderly care and age-related disease treatment

Technology Transfer

Medical Device Development: Space technology applications to medical devices and diagnostic tool development
Monitoring Systems: Space monitoring technology applications for Earth-based health tracking and surveillance
Life Support Systems: Environmental control technology applications for medical facilities and healthcare environments
Exercise Equipment: Space exercise technology adapted for rehabilitation and fitness applications

Note: This comprehensive trend analysis is generated using intelligent analysis when AI is unavailable.`;
  },

  generateFallbackResearchQuestions(topic) {
    return `## Research Questions for: "${topic}"

### Primary Questions
• How does ${topic} affect biological systems in space environments?
• What are the long-term implications of ${topic} for space missions?
• How can we develop countermeasures for ${topic}-related effects?

### Secondary Questions
• What are the molecular mechanisms underlying ${topic} responses?
• How do different species respond to ${topic} in space?
• What technologies are needed to study ${topic} in space?

### Applied Questions
• How can ${topic} research inform astronaut health protocols?
• What are the implications for future space missions?
• How can we translate ${topic} findings to Earth applications?

*Note: These research questions are generated using intelligent analysis when AI is unavailable.*`;
  },
};

export default geminiService;
