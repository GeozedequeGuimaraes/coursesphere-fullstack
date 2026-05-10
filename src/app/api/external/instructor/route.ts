import { NextResponse } from "next/server";

type RandomUserResponse = {
  results: Array<{
    name: { first: string; last: string };
    email: string;
    picture: { medium: string };
  }>;
};

export async function GET() {
  try {
    const response = await fetch("https://randomuser.me/api/?nat=br", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Falha ao consultar RandomUser");
    }

    const data = (await response.json()) as RandomUserResponse;
    const instructor = data.results[0];

    return NextResponse.json({
      instructor: {
        name: `${instructor.name.first} ${instructor.name.last}`,
        email: instructor.email,
        photo: instructor.picture.medium,
      },
    });
  } catch {
    return NextResponse.json({
      instructor: {
        name: "Instrutor convidado",
        email: "convidado@coursesphere.com",
        photo: null,
      },
    });
  }
}
