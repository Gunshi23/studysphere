import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    // Format content array for Gemini
    const contents = [];
    
    // Inject system instructions as the initial user-model setup
    contents.push({
      role: 'user',
      parts: [{ text: 'System instruction: You are SphereAI, an interactive study companion chatbot inside StudySphere (a collaborative virtual study room SaaS platform). Help the student with focus tips, math/coding queries, and guide them inside the platform (e.g. recommend rooms, pomodoro focus session, activity tracking). Keep responses concise, encouraging, and formatted in clean markdown.' }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Understood. SphereAI node is online and operational. Ready to assist student nodes.' }]
    });

    // Map conversation history
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error response:', errText);
      return NextResponse.json(
        { error: 'Gemini API returned an error.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
