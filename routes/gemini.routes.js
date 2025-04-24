const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");

// Route to translate menu using a previously uploaded image URI
router.post("/translate-menu-from-uri", express.json(), async (req, res) => {
  try {
    const { imageUri, mimeType } = req.body;

    if (!imageUri || !mimeType) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both imageUri and mimeType are required",
      });
    }

    // Call the translation function with the URI
    const translationResult = await handleGeminiTranslationFromUri(
      imageUri,
      mimeType
    );

    // Return the translation result
    res.status(200).json(translationResult);
  } catch (error) {
    console.error("Error translating menu:", error);
    res.status(500).json({
      error: "Error translating menu",
      details: error.message,
    });
  }
});

//Route to upload audio file and transcribe audio and translate the transcription
router.post("/translate-audio-from-uri", express.json(), async (req, res) => {
  try {
    const { audioUri, mimeType, targetLanguage } = req.body;

    if (!audioUri || !mimeType) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both audioUri and mimeType are required",
      });
    }

    // Call the translation function with the URI
    const translationResult = await handleGeminiTranslationFromAudioUri(audioUri, mimeType, targetLanguage);

    res.status(200).json({ translationResult });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({
      error: "Error transcribing audio",
      details: error.message,
    });
  }
});

// Route to create waiter-friendly order
router.post("/create-order", express.json(), async (req, res) => {
  try {
    const { order, language } = req.body;

    if (!order || !language) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both order and language are required",
      });
    }

  // Route to create waiter-friendly order
router.post("/create-order", express.json(), async (req, res) => {
  try {
    const { order, language } = req.body;

    if (!order || !language) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: "Both order and language are required",
      });
    }

    const orderResult = await createOrderMenu(order, language);

    res.status(200).send(orderResult);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      error: "Error creating order",
      details: error.message,
    });
  }
});


    // Call the order creation function
    const orderResult = await createOrderMenu(order, language);

    // Return the order result
    res.status(200).send(orderResult);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      error: "Error creating order",
      details: error.message,
    });
  }
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Change this to use Node.js env variables
});

// Translation function using a previously uploaded image URI
async function handleGeminiTranslationFromUri(imageUri, mimeType) {
  try {
    // Generate content using the already uploaded image URI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          "Help me translate a menu",
          createPartFromUri(imageUri, mimeType),
        ]),
      ],
      config: {
        systemInstruction:
          "You are an expert in Chinese, Japanese, and Korean cuisine. Your role is to assist people who do not speak these languages in understanding and ordering food. For each dish, provide a clear, engaging description that highlights its cultural background, key ingredients, flavor profile, and how it's typically served. For example: 'A traditional Taiwanese breakfast dish. Served with spicy chili oil, it delivers a savory kick that pairs well with soy milk or rice porridge.' Be sure to write a unique and informative description for each dish.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              categoryOriginal: {
                type: "string",
                description: "Category name of the food in original language",
              },
              categoryEnglish: {
                type: "string",
                description:
                  "Category name of the food translated in English language",
              },
              nameOriginal: {
                type: "string",
                description: "The name of the food item in original characters",
              },
              nameEnglish: {
                type: "string",
                description:
                  "The name of the food item translated in English language",
              },
              phoneticPronunciation: {
                type: "string",
                description:
                  "The phonetic pronunciation of the food name e.g. in chinese use pinyin",
              },
              descriptionEnglish: {
                type: "string",
                description: "A description of the food item in English. ",
              },
            },
            required: [
              "categoryOriginal",
              "categoryEnglish",
              "nameOriginal",
              "nameEnglish",
              "phoneticPronunciation",
              "descriptionEnglish",
            ],
          },
        },
      },
    });

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error in handleGeminiTranslationFromUri:", error);
    throw error;
  }
}

// Translation function using a previously uploaded audioUri
async function handleGeminiTranslationFromAudioUri(AudioUri, mimeType, targetLanguage) {
  try {
    console.log("targetLanguage:", targetLanguage)
    // Generate content using the already uploaded image URI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          createPartFromUri(AudioUri, mimeType, targetLanguage),
          "Help me transscribe and translate this Audio file",
        ]),
      ],
      config: {
        systemInstruction:
          `Please transcribe the uploaded audio file and translate it to the target language ${targetLanguage}. You should return both the transcription in original language and the translation`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              audioTranscription: {
                type: "string",
                description: "Transcription of the audio file in original language",
              },
              audioTranslation: {
                type: "string",
                description:
                  `Translation of the audio file in target language ${targetLanguage}`,
              },
            },
            required: [
              "audioTranscription",
              "audioTranslation",
            ],
          },
        },
      },
    });

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error in handleGeminiTranslationFromUri:", error);
    throw error;
  }
}

// Implementation of createOrderMenu function (unchanged)
async function createOrderMenu(order, language) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Please generate a natural-sounding, waiter-friendly restaurant order in ${language} with a polite greeting. Here is the order as an array: ${JSON.stringify(
        order
      )}`,
      config: {
        systemInstruction:
          "You help a customer formulating an order for the waiter",
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              orderOriginal: {
                type: "string",
                description:
                  "Restaurant order in target language (see prompt) that a customer can communicate to the waiter. Example: 你好，我想点两份宫保鸡丁",
              },
              orderPronunciation: {
                type: "string",
                description:
                  "Restaurant order pronunciation so that a customer can communicate to the waiter. Example: Nǐ hǎo, wǒ xiǎng diǎn liǎng fèn gōng bǎo jī dīng",
              },
              orderTranslation: {
                type: "string",
                description:
                  "Restaurant order translated in English, pay attention that the menu items are translated properly",
              },
            },
            required: [
              "orderOriginal",
              "orderPronunciation",
              "orderTranslation",
            ],
          },
        },
      },
    });

    const result = await response.text;
    console.log("Waiter-friendly order:", result);
    return result;
  } catch (error) {
    console.error("Error in createOrderMenu:", error);
    throw error;
  }
}

// 
// Export the router
module.exports = router;
