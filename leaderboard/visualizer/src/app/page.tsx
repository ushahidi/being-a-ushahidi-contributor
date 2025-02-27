// Purpose: Main page of the application.
import ContributorCard from "./components/contributorCard";

export default function Home() {
  return (
    <div className="mx-auto w-[80vw]">
      <div className="text-3xl font-semibold mx-auto mt-10">
        <h3 className="text-center">Ushahidi Contributors Leaderboard</h3>
      </div>
      <div className="mx-auto w-[50vw] mt-10 flex items-center justify-center">
        <ContributorCard />
      </div>
    </div>
  );
}
