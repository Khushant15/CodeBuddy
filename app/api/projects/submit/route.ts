import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/lib/projects';

// Extremely basic heuristic MVP validation.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, stage, code, gitHubUrl } = body;

    if (!projectId || stage === undefined || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const stageData = project.stages.find(s => s.number === stage);
    if (!stageData) {
      return NextResponse.json({ error: 'Stage not found' }, { status: 404 });
    }

    // MVP Validation Logic: Use simple regex heuristic from the template if present.
    let passed = false;
    let feedback = "";

    if (stageData.validationRegex) {
      const regex = new RegExp(stageData.validationRegex, 'i');
      if (regex.test(code)) {
        passed = true;
        feedback = "Looks good! You met the core requirements.";
      } else {
        passed = false;
        feedback = "Your code is missing some of the required structures. Check the checklist and try again.";
      }
    } else {
      // Fallback: Just assume passing if code has changed.
      passed = code.length > 20;
      feedback = passed ? "Great job!" : "Code seems too short.";
    }

    // In a real application, we would call Groq/AI here to grade the code.
    // For Phase 1.4 MVP, this simple heuristic unlocks the next stage.

    return NextResponse.json({
      passed,
      feedback,
      xpEarned: passed ? stageData.xpReward : 0,
      nextStageUnlocked: passed && stage < project.stages.length
    });

  } catch (error) {
    console.error('Submit Project Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
