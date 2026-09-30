import OpenAI from 'openai';
import { config } from '../../config';

export const openaiClient = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL: config.openaiBaseUrl !== 'https://api.openai.com/v1' ? config.openaiBaseUrl : undefined,
});
