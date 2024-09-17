"use client";

import OpenAI from "openai";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

// Configure OpenAI with Groq's base URL
const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

export function AudioTranscriber() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-large-v3");

      const response = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
      });

      setTranscription(response.text);
    } catch (error) {
      console.error("Error during transcription:", error);
      setTranscription("An error occurred during transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Audio Transcriber</h2>
      <Input
        type="file"
        onChange={handleFileChange}
        accept="audio/*"
        className="mb-4"
      />
      <Button
        onClick={handleTranscribe}
        disabled={!file || isLoading}
        className="w-full mb-4"
      >
        {isLoading ? "Transcribing..." : "Transcribe Audio"}
      </Button>
      {transcription && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Transcription:</h3>
          <p className="whitespace-pre-wrap">{transcription}</p>
        </div>
      )}
    </Card>
  );
}
