// contributor card
import Image from "next/image";


export default function ContributorCard(){
    return (
        <div className="flex items-center justify-center p-3 bg-neutral-100 rounded-lg h-16 w-[45vw] drop-shadow-lg">
            <div className="flex-1"> 01 </div>
            <div className="flex-1"> 
            <Image
                src="https://placehold.co/30"
                alt="Example"
                width={30}
                height={30}

                />
            </div>
            <div className="flex-1"> @johndoe </div>
            <div className="flex-1"> 42323 </div>
        </div>
    );
}