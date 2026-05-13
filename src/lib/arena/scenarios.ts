// Kid-safe battle scenarios. Used to seed Claude when judging a Battle so
// outcomes vary and stay PG. NO weapons, no violence, no fighting language —
// "battles" here are creative duels, not combat.

export type BattleScenario = {
  id: string;
  title: string;
  prompt: string;
};

export const BATTLE_SCENARIOS: BattleScenario[] = [
  {
    id: "talent_show",
    title: "Surprise talent show",
    prompt:
      "Both characters step onto a glittery stage and have to perform a 30-second talent neither of them prepared for. The audience is made of glowing space jellyfish.",
  },
  {
    id: "best_invention",
    title: "Pitch the best invention",
    prompt:
      "Each character invents a wildly useful gadget on the spot — for, say, brushing teeth in zero gravity — and pitches it to a council of skeptical robot squirrels.",
  },
  {
    id: "joke_off",
    title: "Joke-off duel",
    prompt:
      "Both characters take turns telling the silliest joke they can, in front of a judge who only laughs at puns. First to get a laugh wins.",
  },
  {
    id: "obstacle_course",
    title: "Bubble obstacle course",
    prompt:
      "A floating obstacle course made of soap bubbles, jelly trampolines, and rubber ducks. Each character has to describe how they'd race through it without popping more than three bubbles.",
  },
  {
    id: "lost_dog",
    title: "Finding the lost cosmic puppy",
    prompt:
      "A glowing puppy has wandered into a maze of mirrors. Each character explains how they'd track it down using only their wits and one unusual item.",
  },
  {
    id: "song_writeoff",
    title: "Song writing duel",
    prompt:
      "Each character invents a short song chorus about pancakes. The crowd votes for the catchier one.",
  },
  {
    id: "weather_report",
    title: "Weather report from a weird planet",
    prompt:
      "Each character delivers a live weather report from a planet where it rains spaghetti on Tuesdays. They need to keep it informative and entertaining.",
  },
  {
    id: "diplomat",
    title: "Negotiating with cloud kingdom",
    prompt:
      "The kingdom of fluffy clouds is grumpy because someone keeps stealing their pillows. Each character tries to fix the problem using only words.",
  },
  {
    id: "art_class",
    title: "Drawing without looking",
    prompt:
      "Each character has 30 seconds to draw the other's portrait while blindfolded. The drawings will be judged by a panel of penguins.",
  },
  {
    id: "improv_movie",
    title: "One-minute movie pitch",
    prompt:
      "Each character pitches a one-minute movie called \"The Last Cookie\" to a Hollywood squirrel. Best pitch wins.",
  },
  {
    id: "library_quest",
    title: "Sneaky library quest",
    prompt:
      "The two characters must retrieve a book from the top shelf of a haunted-but-friendly library, without waking up the snoring librarian dog.",
  },
  {
    id: "mystery_box",
    title: "Mystery box mystery",
    prompt:
      "Each character opens a mysterious box and has to convince the audience the random object inside is the greatest treasure ever made.",
  },
  {
    id: "dance_off",
    title: "Underwater dance-off",
    prompt:
      "Both characters dance underwater in slow motion. They have to invent moves with names. The fish are the judges.",
  },
  {
    id: "speech",
    title: "Speech to the snack council",
    prompt:
      "Each character gives a 20-second speech to the Snack Council arguing why their favorite snack should become the official planet snack.",
  },
  {
    id: "puzzle",
    title: "Cracking the gummy bear code",
    prompt:
      "A secret message is written entirely in gummy bears. Each character explains how they'd decode it.",
  },
  {
    id: "escape_room",
    title: "Friendly escape room",
    prompt:
      "Each character has to escape a cozy room full of riddles and tea cups within one minute, narrating their plan as they go.",
  },
  {
    id: "fashion",
    title: "Outfit out of nothing",
    prompt:
      "Both characters have to assemble an outfit out of leaves, ribbons, and one borrowed cape. They walk a runway lined with very judgmental flamingos.",
  },
  {
    id: "campfire",
    title: "Campfire story",
    prompt:
      "Around a magical campfire, each character tells a 30-second story about a tiny, brave snail. Audience claps decide the winner.",
  },
  {
    id: "race_invent",
    title: "Invent the rules",
    prompt:
      "There's a race, but no one knows the rules. Each character has 30 seconds to propose a set of rules that everyone agrees sound fair AND fun.",
  },
  {
    id: "robot_repair",
    title: "Fix a giggling robot",
    prompt:
      "A friendly robot keeps giggling and won't stop. Each character tries a different approach to calm it down so it can finish its homework.",
  },
];

export function pickRandomScenario(): BattleScenario {
  return BATTLE_SCENARIOS[Math.floor(Math.random() * BATTLE_SCENARIOS.length)];
}

export function getScenarioById(id: string): BattleScenario | undefined {
  return BATTLE_SCENARIOS.find((s) => s.id === id);
}
