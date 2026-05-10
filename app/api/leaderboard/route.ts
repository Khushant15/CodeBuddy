import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/app/firebase/admin";

// Use Firebase Admin SDK for queries bypassing security rules for the leaderboard
// In production, you would authenticate the user via tokens to allow "friends" specific queries.

export async function GET(req: NextRequest) {
  try {
    initAdmin();
    const db = getFirestore();
    const { searchParams } = new URL(req.url);
    const track = searchParams.get('track') || 'all';
    
    let userRefs;

    // For MVP we just sort the 'users' collection globally by total XP.
    if (track === 'all') {
       userRefs = await db.collection("users")
         .orderBy("xp", "desc")
         .limit(100)
         .get();
    } else {
       // If tracking per-track XP, would query progress subcollection
       // For MVP fallback to global XP
       userRefs = await db.collection("users")
         .orderBy("xp", "desc")
         .limit(100)
         .get();
    }

    const leaderboard = userRefs.docs.map((doc, index) => {
       const u = doc.data();
       return {
         rank: index + 1,
         userId: doc.id,
         username: u.displayName || "Unknown Dev",
         avatar: u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || 'Dev'}&background=random`,
         xpThisWeek: u.xp || 0, // Fallback to total XP for MVP
         level: u.level || 1,
         streak: u.streak || 0,
         completedChallenges: (u.completedChallenges || []).length
       };
    });

    return NextResponse.json(leaderboard);

  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
