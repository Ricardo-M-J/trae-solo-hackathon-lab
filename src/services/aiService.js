// 统一 AI 服务接口，支持多个 AI 提供商

class AIService {
  constructor() {
    this.providers = {
      kimi: this.createKimiProvider(),
      minimax: this.createMinimaxProvider(),
      doubao: this.createDoubaoProvider()
    };
    this.defaultProvider = 'kimi';
  }

  // 创建 Kimi 提供商
  createKimiProvider() {
    return {
      name: 'kimi',
      generate: async (messages, agent) => {
        // 使用Cloudflare Worker代理API地址，保护API密钥
        const apiProxyUrl = import.meta.env.VITE_API_PROXY_URL || 'https://trae-solo-api-proxy.1463940581.workers.dev/api/chat';
        const systemPrompt = this.getAgentPrompt(agent);

        try {
          const response = await fetch(apiProxyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'moonshot-v1-8k',  // 使用基础模型
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              temperature: 0.7,
              stream: true
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Kimi API error: ${errorData.error?.message || 'Unknown error'}`);
          }

          return this.handleStream(response);
        } catch (error) {
          console.error('Kimi API error:', error);
          throw error;
        }
      }
    };
  }

  // 创建 Minimax 提供商
  createMinimaxProvider() {
    return {
      name: 'minimax',
      generate: async (messages, agent) => {
        const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
        const groupId = import.meta.env.VITE_MINIMAX_GROUP_ID;

        if (!apiKey || !groupId) {
          throw new Error('Minimax API key or group ID not configured');
        }

        const systemPrompt = this.getAgentPrompt(agent);

        try {
          const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'abab5.5-chat',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              temperature: 0.7,
              group_id: groupId,
              stream: true
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Minimax API error: ${errorData.error_msg || 'Unknown error'}`);
          }

          return this.handleMinimaxStream(response);
        } catch (error) {
          console.error('Minimax API error:', error);
          throw error;
        }
      }
    };
  }

  // 创建豆包提供商
  createDoubaoProvider() {
    return {
      name: 'doubao',
      generate: async (messages, agent) => {
        const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;

        if (!apiKey) {
          throw new Error('Doubao API key not configured');
        }

        const systemPrompt = this.getAgentPrompt(agent);

        try {
          const response = await fetch(`https://ark.cn-beijing.volces.com/api/v3/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'ep-20250418-113131-i3k4',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              temperature: 0.7,
              stream: true
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Doubao API error: ${errorData.error?.message || 'Unknown error'}`);
          }

          return this.handleDoubaoStream(response);
        } catch (error) {
          console.error('Doubao API error:', error);
          throw error;
        }
      }
    };
  }

  // 处理流式响应（通用格式）
  async *handleStream(response) {
    const reader = response.body.getReader();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += new TextDecoder().decode(value);

      // 处理 SSE 格式
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const json = JSON.parse(data);
            if (json.choices && json.choices[0].delta?.content) {
              yield json.choices[0].delta.content;
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }

      // 只保留最后一行（可能不完整）
      buffer = lines[lines.length - 1];
    }
  }

  // 处理 Minimax 流式响应
  async *handleMinimaxStream(response) {
    const reader = response.body.getReader();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += new TextDecoder().decode(value);

      // 处理 SSE 格式
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const json = JSON.parse(data);
            if (json.choices && json.choices[0].delta?.content) {
              yield json.choices[0].delta.content;
            }
          } catch (e) {
            console.error('Error parsing Minimax SSE data:', e);
          }
        }
      }

      buffer = lines[lines.length - 1];
    }
  }

  // 处理豆包流式响应
  async *handleDoubaoStream(response) {
    const reader = response.body.getReader();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += new TextDecoder().decode(value);

      // 处理 SSE 格式
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const json = JSON.parse(data);
            if (json.choices && json.choices[0].delta?.content) {
              yield json.choices[0].delta.content;
            }
          } catch (e) {
            console.error('Error parsing Doubao SSE data:', e);
          }
        }
      }

      buffer = lines[lines.length - 1];
    }
  }

  // 获取 Agent 提示词
  getAgentPrompt(agent) {
    return `你是 ${agent.name}，一名专业的 ${agent.role}。${agent.persona}

请严格按照以下要求回复：
1. 保持 ${agent.role} 的专业风格和语言特点
2. 回复要符合 ${agent.name} 的个性
3. 对于技术问题，要展现专业知识
4. 回复要简洁明了，控制在100字以内
5. 不要偏离角色，始终保持 ${agent.name} 的身份
6. 可以使用适当的表情符号来增强表达
7. 注意区分不同角色的对话，准确理解上下文
8. 当用户问"我上一句话说的什么"时，要准确引用用户的上一条消息
9. 要能够识别其他 Agent 的回复，并在适当情况下进行回应

当前对话历史：`;
  }

  // 生成回复
  async *generate(messages, agent, provider = null) {
    const selectedProvider = provider || this.defaultProvider;
    const providerInstance = this.providers[selectedProvider];

    if (!providerInstance) {
      throw new Error(`Provider ${selectedProvider} not found`);
    }

    try {
      // 检查 API Key 并提供模拟回复
      if (selectedProvider === 'kimi' && !import.meta.env.VITE_KIMI_API_KEY) {
        yield 'API Key 未配置，正在使用模拟回复...\n';
        await new Promise(resolve => setTimeout(resolve, 800));
        yield `${agent.name}（${agent.role}）：\n`;
        yield `你好！我是 ${agent.name}，一名专业的 ${agent.role}。\n\n`;
        yield `${agent.persona}\n\n`;
        yield '提示：请在 .env 文件中配置 VITE_KIMI_API_KEY 以获得真实的 AI 回复。';
        return;
      }

      if (selectedProvider === 'minimax' && (!import.meta.env.VITE_MINIMAX_API_KEY || !import.meta.env.VITE_MINIMAX_GROUP_ID)) {
        yield 'API Key 未配置，正在使用模拟回复...\n';
        await new Promise(resolve => setTimeout(resolve, 800));
        yield `${agent.name}（${agent.role}）：\n`;
        yield `你好！我是 ${agent.name}，一名专业的 ${agent.role}。\n\n`;
        yield `${agent.persona}\n\n`;
        yield '提示：请在 .env 文件中配置 Minimax API Key 和 Group ID 以获得真实的 AI 回复。';
        return;
      }

      if (selectedProvider === 'doubao' && !import.meta.env.VITE_DOUBAO_API_KEY) {
        yield 'API Key 未配置，正在使用模拟回复...\n';
        await new Promise(resolve => setTimeout(resolve, 800));
        yield `${agent.name}（${agent.role}）：\n`;
        yield `你好！我是 ${agent.name}，一名专业的 ${agent.role}。\n\n`;
        yield `${agent.persona}\n\n`;
        yield '提示：请在 .env 文件中配置 VITE_DOUBAO_API_KEY 以获得真实的 AI 回复。';
        return;
      }

      // 调用 AI 服务
      const stream = await providerInstance.generate(messages, agent);
      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error('AI generation error:', error);
      yield `❌ ${error.message}`;
    }
  }

  // 设置默认提供商
  setDefaultProvider(provider) {
    if (this.providers[provider]) {
      this.defaultProvider = provider;
    }
  }
}

// 导出单例实例
export default new AIService();
