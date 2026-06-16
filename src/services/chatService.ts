import { useState, useRef, useEffect } from "react";
import { QuestionClassifier } from "./questionClassifier";
import { AIService } from "./aiService";
import { AvatarService } from "./avatarService";

export interface Message {
  id: number;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
}

export function useChatService(systemUplinkText: string, initialMessageText: string) {
  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(" ")[0].slice(0, 5);
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "system",
      text: systemUplinkText,
      timestamp: getTimestamp(),
    },
    {
      id: 2,
      sender: "ai",
      text: initialMessageText,
      timestamp: getTimestamp(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      AvatarService.cancel();
    };
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      AvatarService.cancel();
      setIsSpeaking(false);
    }
  };

  const cancelSpeech = () => {
    AvatarService.cancel();
    setIsSpeaking(false);
  };

  const speakDirectly = (text: string) => {
    cancelSpeech();
    AvatarService.speak(
      text,
      isMuted,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const streamResponse = (responseText: string) => {
    setIsThinking(false);
    setIsTyping(true);

    // Trigger Avatar speaking chattering callbacks
    AvatarService.speak(
      responseText,
      isMuted,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );

    const aiMsgId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      { id: aiMsgId, sender: "ai", text: "", timestamp: getTimestamp() },
    ]);

    let index = 0;
    const typeSpeed = responseText.length > 150 ? 8 : 12;
    const timer = setInterval(() => {
      setMessages(prev =>
        prev.map(m => {
          if (m.id === aiMsgId) {
            return { ...m, text: responseText.slice(0, index + 1) };
          }
          return m;
        })
      );
      index++;
      if (index >= responseText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, typeSpeed);
  };

  // Tracks whether thinking loop should keep chaining
  const isThinkingActiveRef = useRef(false);

  // Pool of natural filler phrases — split into openers and follow-ups
  const thinkingOpeners = [
    "Hmm, let me think about that for a second.",
    "Good question, give me just a moment.",
    "Yeah, let me pull that up for you.",
    "Sure, one sec while I think through that.",
    "Alright, let me work through that real quick.",
    "Let me dig into that for you.",
  ];

  const thinkingFillers = [
    "So there's actually quite a bit I can say about this.",
    "Yeah this is something I know pretty well.",
    "I've spent a good chunk of time on this.",
    "Let me make sure I get this right for you.",
    "I want to give you a proper answer here.",
    "Just putting together the best way to explain this.",
    "I've worked on this a lot so bear with me.",
    "Almost there, just organizing my thoughts.",
  ];

  const startThinkingLoop = (isMuted: boolean) => {
    isThinkingActiveRef.current = true;
    let usedOpener = false;

    const speakNext = () => {
      if (!isThinkingActiveRef.current) return;

      const pool = usedOpener ? thinkingFillers : thinkingOpeners;
      usedOpener = true;
      const phrase = pool[Math.floor(Math.random() * pool.length)];

      AvatarService.speak(
        phrase,
        isMuted,
        () => setIsSpeaking(true),
        () => {
          // When phrase ends, chain the next one after a short natural pause
          if (isThinkingActiveRef.current) {
            setTimeout(speakNext, 600 + Math.random() * 800);
          } else {
            setIsSpeaking(false);
          }
        }
      );
    };

    speakNext();
  };

  const stopThinkingLoop = () => {
    isThinkingActiveRef.current = false;
    AvatarService.cancel();
    setIsSpeaking(false);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isThinking || isTyping) return;

    // Interrupt any active voice synthesis when sending a new message
    stopThinkingLoop();
    cancelSpeech();

    // 1. User message
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: getTimestamp(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    // 2. Classification check for unrelated questions (Rejection)
    const classification = QuestionClassifier.classifyQuestion(textToSend);
    if (classification === "UNRELATED") {
      setTimeout(() => {
        streamResponse(QuestionClassifier.getRejectionResponse());
      }, 1000);
      return;
    }

    const activeApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!activeApiKey) {
      // Fallback local grounded answer
      setTimeout(() => {
        const responseText = AIService.generateLocalGroundedResponse(textToSend);
        streamResponse(responseText);
      }, 1200);
      return;
    }

    // Start continuous talking loop while LLM processes
    startThinkingLoop(isMuted);

    // Call dynamic LLM via AIService
    try {
      const history: { role: "user" | "assistant"; content: string }[] = messages
        .filter(m => m.sender !== "system")
        .map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }));

      history.push({ role: "user", content: textToSend });

      const responseText = await AIService.generateLLMResponse(textToSend, history);
      // Stop thinking loop, then stream real answer
      stopThinkingLoop();
      streamResponse(responseText);
    } catch (err: any) {
      console.error(err);
      stopThinkingLoop();
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: `Neural connection failure: ${err.message || "Unknown error"}. Emulation fallback activated.`,
          timestamp: getTimestamp(),
        }
      ]);
    }
  };


  return {
    messages,
    inputValue,
    setInputValue,
    isThinking,
    isTyping,
    isSpeaking,
    isMuted,
    toggleMute,
    cancelSpeech,
    speakDirectly,
    handleSend,
    chatEndRef
  };
}
