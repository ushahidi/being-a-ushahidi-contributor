import Image from "next/image";

interface ContributorCardProps {
  readonly rank: number;
  readonly login: string;
  readonly contributions: number;
  readonly avatar_url?: string;
}

export default function ContributorCard({ rank, login, contributions, avatar_url }: ContributorCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg h-16 w-[45vw] drop-shadow-lg">
      <div className="flex-1 font-bold text-gray-700"> {rank.toString().padStart(2, "0")} </div>
      <div className="flex-1">
        <Image
          src={avatar_url ?? "https://placehold.co/30"}
          alt={login}
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 text-blue-600">@{login}</div>
      <div className="flex-1 font-semibold">{contributions}</div>
    </div>
  );
}
