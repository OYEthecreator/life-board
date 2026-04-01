const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

async function callOpenAI(messages, maxTokens = 150) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: maxTokens,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${errorText}`);
    }

    return response.json();
}

app.post('/api/analyze-task', async (req, res) => {
    try {
        const { taskTitle, taskDescription } = req.body;

        const data = await callOpenAI(
            [
                {
                    role: 'user',
                    content: `Analyze this task: "${taskTitle} - ${taskDescription}".
Respond with ONLY valid JSON in this exact shape:
{
  "category": "work|study|personal|health",
  "priority": "low|medium|high",
  "estimatedMinutes": number,
  "suggestedDeadline": "today|tomorrow|this_week|next_week"
}`
                }
            ],
            150
        );

        const content = data.choices?.[0]?.message?.content?.trim() || '{}';
        const parsed = JSON.parse(content);

        res.json({
            category: parsed.category || 'personal',
            priority: parsed.priority || 'medium',
            estimatedMinutes: parsed.estimatedMinutes || 30,
            suggestedDeadline: parsed.suggestedDeadline || 'this_week'
        });
    } catch (error) {
        console.error('Analyze task error:', error);
        res.status(500).json({
            category: 'personal',
            priority: 'medium',
            estimatedMinutes: 30,
            suggestedDeadline: 'this_week'
        });
    }
});

app.post('/api/focus-suggestion', async (req, res) => {
    try {
        const { taskList } = req.body;

        const data = await callOpenAI(
            [
                {
                    role: 'user',
                    content: `Suggest which task to focus on first from: ${(taskList || []).join(', ')}. Give a short, motivational suggestion, max 15 words.`
                }
            ],
            50
        );

        res.json({
            suggestion: data.choices?.[0]?.message?.content?.trim() || 'Focus on your highest priority task first!'
        });
    } catch (error) {
        console.error('Focus suggestion error:', error);
        res.status(500).json({
            suggestion: 'Focus on your highest priority task first!'
        });
    }
});

app.post('/api/productivity-tip', async (req, res) => {
    try {
        const data = await callOpenAI(
            [
                {
                    role: 'user',
                    content: 'Give one short, practical productivity tip for task management. Maximum 12 words.'
                }
            ],
            40
        );

        res.json({
            tip: data.choices?.[0]?.message?.content?.trim() || 'Break big tasks into small, actionable steps!'
        });
    } catch (error) {
        console.error('Productivity tip error:', error);
        res.status(500).json({
            tip: 'Break big tasks into small, actionable steps!'
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});