const GAME_NAME = 'allcll';

export async function isValidUser(userPK: string) {
  const result = await fetch(`/scoreApi/users/${userPK}`);

  const data = await result.json();

  return !!data.userId;
}

export interface PostUserScoreResponse {
  status: 'UPDATED' | 'CREATED' | 'UNCHANGED';
  message: string;
  gameName: string;
}

export async function postUserScore(userPK: string, score: number): Promise<PostUserScoreResponse> {
  const result = await fetch(`/scoreApi/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameName: GAME_NAME,
      userId: userPK,
      score: score,
    }),
  });

  if (!result.ok) {
    throw new Error('Failed to post user score');
  }

  return await result.json();
}
