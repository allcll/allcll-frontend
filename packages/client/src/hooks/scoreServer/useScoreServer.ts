const GAME_NAME = 'allcll';
const AUTHORIZATION_TOKEN = import.meta.env.VITE_SCORE_API_TOKEN;

export async function isValidUser(userPK: string) {
  const result = await fetch(`/scoreApi/users/${userPK}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
    },
  });

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
      Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
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
