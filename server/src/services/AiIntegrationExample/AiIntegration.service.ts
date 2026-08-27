import { injectable, singleton } from 'tsyringe';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechClient } from '@google-cloud/speech';
import tts from '@google-cloud/text-to-speech/build/protos/protos';
import ISynthesizeSpeechRequest = tts.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
import * as protosTypes from '@google-cloud/speech/build/protos/protos';
import { VertexAI } from '@google-cloud/vertexai';
import chalk = require('chalk');

@injectable()
@singleton()
export class AiIntegrationService {
  private clientTTS?: TextToSpeechClient;
  private clientSTT?: SpeechClient;
  private vertexAI?: VertexAI;

  private getProjectId(): string {
    const projectId = process.env.PROJECT_ID;
    if (!projectId) {
      throw new Error(
        'Custom IVR AI features require PROJECT_ID in server/.env. See server/.env.example.',
      );
    }
    return projectId;
  }

  private getClientTTS() {
    this.clientTTS ??= new TextToSpeechClient();
    return this.clientTTS;
  }

  private getClientSTT() {
    this.clientSTT ??= new SpeechClient();
    return this.clientSTT;
  }

  private getVertexAI() {
    this.vertexAI ??= new VertexAI({ project: this.getProjectId() });
    return this.vertexAI;
  }

  public createSpeech(input: string) {
    try {
      const request: ISynthesizeSpeechRequest = {
        input: { text: input },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 8000 },
      };
      return this.getClientTTS().synthesizeSpeech(request);
    } catch (e) {
      console.error(chalk.red('🚨 Google Text to Speech API req error', e));
    }
  }

  public createRecognizeStream() {
    const request: protosTypes.google.cloud.speech.v1.IStreamingRecognitionConfig = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 8000,
        languageCode: 'en-US',
        model: 'phone_call',
        useEnhanced: true,
      },
      interimResults: true,
    };

    return this.getClientSTT().streamingRecognize(request, {});
  }

  public createChatCompletion() {
    const generativeModel = this.getVertexAI().getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    return generativeModel.startChat();
  }
}
