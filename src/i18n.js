import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    default: "en",
    fallbackLng: "en",
    returnObjects: true,
    resources: {
      en: {
        translation: {
          greetings: "Hello from the Melodi Team",
          description: {
            part1: "I welcome you to our IPR Project frontend",
            part2: "We make sure that our work is always top-notch",
          },
          institute: "Institute for Plasma Research",
          instituteHindi: "प्लाज्मा अनुसंधान संस्थान",
          quizMaster: "Quiz Master",
          home: "Home",
          myQuizzes: "My Quizzes",
          language: "Language",
          myProfile: "My Profile",
          accountSettings: "Account Settings",
          support: "Support",
          license: "License",
          signOut: "Sign Out",
          "Online Quiz Platform": "Online Quiz Platform"
        },
      },
      hi: {
        translation: {
          greetings: "मेलोडी टीम से नमस्ते",
          description: {
            part1: "मैं आपका स्वागत करता हूं हमारे आईपीआर परियोजना फ्रंटएंड में",
            part2: "हम सुनिश्चित करते हैं कि हमारा काम हमेशा शीर्ष-गुणवत्ता हो",
          },
          institute: "प्लाज्मा अनुसंधान संस्थान",
          instituteHindi: "प्लाज्मा अनुसंधान संस्थान",
          quizMaster: "क्विज मास्टर",
          home: "होम",
          myQuizzes: "मेरी क्विज़",
          language: "भाषा",
          myProfile: "मेरी प्रोफ़ाइल",
          accountSettings: "खाता सेटिंग्स",
          support: "सहायता",
          license: "लाइसेंस",
          signOut: "साइन आउट",
          "Online Quiz Platform": "ऑनलाइन क्विज़ प्लेटफ़ॉर्म"
        },
      },
      gu: {
        translation: {
          greetings: "મેલોડી ટીમથી નમસ્તે",
          description: {
            part1: "હું તમારું આઈપીઆર પ્રોજેક્ટ ફ્રન્ટએન્ડ પર આપનું સ્વાગત કરું છું",
            part2: "અમે ખરેખર ખાતરી કરીએ છીએ કે અમારું કામ હંમેશા ટોપ-નોચ છે",
          },
          institute: "પ્લાઝ્મા સંશોધન સંસ્થા",
          instituteHindi: "प्लाज्मा अनुसंधान संस्थान",
          quizMaster: "ક્વિઝ માસ્ટર",
          home: "હોમ",
          myQuizzes: "મારી ક્વિઝ",
          language: "ભાષા",
          myProfile: "મારી પ્રોફાઇલ",
          accountSettings: "એકાઉન્ટ સેટિંગ્સ",
          support: "સપોર્ટ",
          license: "લાઇસન્સ",
          signOut: "સાઇન આઉટ",
          "Online Quiz Platform": "ઓનલાઇન ક્વિઝ પ્લેટફોર્મ"
        },
      },
    },
  });
