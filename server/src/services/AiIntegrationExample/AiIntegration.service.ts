import { injectable, singleton } from 'tsyringe';
import textToSpeech from '@google-cloud/text-to-speech';
import speech from '@google-cloud/speech';
import tts from '@google-cloud/text-to-speech/build/protos/protos';
import ISynthesizeSpeechRequest = tts.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
import * as protosTypes from '@google-cloud/speech/build/protos/protos';
import { VertexAI } from '@google-cloud/vertexai';
import chalk = require('chalk');

@injectable()
@singleton()
export class AiIntegrationService {
  private clientTTS = new textToSpeech.TextToSpeechClient();
  private clientSTT = new speech.SpeechClient();
  private vertexAI = new VertexAI({ project: process.env.PROJECT_ID! });

  public createSpeech(input: string) {
    try {
      const request: ISynthesizeSpeechRequest = {
        input: { text: input },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 8000 },
      };
      return this.clientTTS.synthesizeSpeech(request);
    } catch (e) {
      console.error(chalk.red('🚨 Google Text to Speech API req error', e));
      //throw new Error('Google Text to Speech API req error')
    }
  }

  public createRecognizeStream() {
    const encoding = 'LINEAR16';
    const sampleRateHertz = 8000;
    const languageCode = 'en-US';

    const request: protosTypes.google.cloud.speech.v1.IStreamingRecognitionConfig = {
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        model: 'phone_call',
        useEnhanced: true,
      },
      interimResults: true,
    };

    return this.clientSTT.streamingRecognize(request, {});
  }

  public createChatCompletion() {
    const generativeModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    return generativeModel.startChat();
  }
}
