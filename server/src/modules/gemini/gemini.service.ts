import { Injectable } from '@nestjs/common';
import { CreateGeminiDto } from './dto/create-gemini.dto';
import { UpdateGeminiDto } from './dto/update-gemini.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {env} from '../../configs/env.config';

@Injectable()
export class GeminiService {

  async generateContent(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(env.API_KEYS.GEMINI);
    const model = genAI.getGenerativeModel({ model: "RoadmapFinetuningModel" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

/*
const [nodes, setNodes] = useState([
  {
      id: 0, level: 1,
      x: 50, y: 50,
      type: 'Checkbox',
      due_time: 2,
      content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định',
      ticked: false,
      nodeDetail: nodeDetail,
      nodeComment: [
          {
              userId: '1',
              username: 'KoPhaiVu',
              text: "haha",
              comment: "whao"
          },
          {
              userId: '2',
              username: 'KoPhaiThien',
              text: "mcc",
              comment: "whao"
          },
      ]
  },
  {
      id: 1, level: 1,
      x: 50, y: 150,
      type: 'Checkbox',
      due_time: 2,
      content: 'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024',
      ticked: true,
      nodeDetail: '',
      nodeComment: null
  }
]);

*/