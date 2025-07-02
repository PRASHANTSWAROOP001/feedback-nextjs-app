
import { Marquee } from "@/components/magicui/marquee";
import { VelocityScroll } from "../magicui/scroll-based-velocity"; 
const reviews = [
  {
    name: "Ravi Sharma",
    username: "@ravi1992",
    body: "We started collecting feedback from our product testers with ease. The magic link feature is 🔥.",
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Sneha Patil",
    username: "@sneha.designs",
    body: "Simple and intuitive. Got valuable client input without them signing up. Just what I needed!",
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Aman Verma",
    username: "@aman_dev",
    body: "Loved the category/tag structure. Helps me organise internal feedback perfectly.",
    img: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Neha Singh",
    username: "@nehasingh",
    body: "I use it to get feedback after every workshop. Clean UI, no fuss.",
    img: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Raj Mehta",
    username: "@rajwrites",
    body: "Perfect for solo creators. My newsletter readers gave me feedback I never expected.",
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Pooja Iyer",
    username: "@pooja.codes",
    body: "I ditched Google Forms. This is modern, fast, and focused.",
    img: "https://i.pravatar.cc/150?img=6",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));


const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
     className="relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};


export function ReviewSection() {
  return (
    <section id='review' className="w-full py-16 bg-background">
      <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center space-y-4 mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Hear What Others Are Saying
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Creators, teams, and businesses are already collecting better feedback — here’s what they’re saying.
        </p>
      </div>

      <div className="relative flex mx-auto h-[500px] w-11/12 md:w-3/4 flex-col items-center justify-center overflow-hidden">
<Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
      </div>
    </section>
  );
}
