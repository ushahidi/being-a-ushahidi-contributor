// Purpose: Main page of the application.
"use client"
import { useEffect, useState } from "react";
import ContributorCard from "./components/contributorCard";

interface Contributor {
  id: number;
  login: string;
  contributions: number;
  avatar_url: string;
  rank : number;
}

export default function Home() {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    async function fetchContributors() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

      try {
        const response = await fetch("http://127.0.0.1:8000/contributors", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setContributors(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.error("Fetch request timed out after 60 seconds");
        } else {
          console.error("Error fetching contributors:", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    fetchContributors();
  }, []);

  return (
    <div className="mx-auto w-[80vw]">
      <div className="text-3xl font-semibold mx-auto mt-10">
        <h3 className="text-center">Ushahidi Contributors Leaderboard</h3>
      </div>
      <div className="mx-auto w-[50vw] mt-10 flex flex-col items-center justify-center space-y-4">
        {contributors.length > 0 ? (
          contributors.map((contributor, index) => (
            <ContributorCard
              key={contributor.id}
              rank={index + 1}
              login={contributor.login}
              contributions={contributor.contributions}
              avatar_url={contributor.avatar_url}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Loading contributors...</p>
        )}
      </div>
    </div>
  );
}
