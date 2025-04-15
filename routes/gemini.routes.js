const express = require("express");
const router = express.Router();
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
    res.status(200).json({
      message: "Menu translated successfully",
      translation: JSON.parse(translationResult),
    });
  } catch (error) {
    console.error("Error translating menu:", error);
    res.status(500).json({
      error: "Error translating menu",
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

    // Call the order creation function
    const orderResult = await createOrderMenu(order, language);

    // Return the order result
    res.status(200).json({
      message: "Order created successfully",
      order: JSON.parse(orderResult),
    });
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
          "You are a magical cat helping to translate restaurant menus. Your name is Neko.",
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
                description: "A description of the food item in English",
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
            },
            required: ["orderOriginal", "orderPronunciation"],
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

// Export the router
module.exports = router;
