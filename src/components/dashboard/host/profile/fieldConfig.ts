import {
  School,
  Briefcase,
  PawPrint,
  Lightbulb,
  Clock,
  Music,
  Book,
  Languages,
  MapPin,
  Sparkles,
  Coffee,
  Globe,
  Heart,
} from "lucide-react";

type FieldConfigItem = {
  title: string;
  description: string;
  icon: React.FC;
  label: string;
};

export type FieldConfig = {
  school: FieldConfigItem;
  wantToGo: FieldConfigItem;
  work: FieldConfigItem;
  forGuests: FieldConfigItem;
  pets: FieldConfigItem;
  decade: FieldConfigItem;
  funFact: FieldConfigItem;
  tooMuchTime: FieldConfigItem;
  favoriteSong: FieldConfigItem;
  uselessSkill: FieldConfigItem;
  biography: FieldConfigItem;
  obsession: FieldConfigItem;
  languages: FieldConfigItem;
  location: FieldConfigItem;
};

export const fieldConfig: FieldConfig = {
  school: {
    title: "Where did you go to school?",
    description:
      "Whether it's home school, high school, or trade school, name the school that made you who you are.",
    icon: School,
    label: "Where I went to school",
  },
  wantToGo: {
    title: "Where have you always wanted to go?",
    description: "Share that one place you've been dreaming about visiting.",
    icon: Globe,
    label: "Where I've always wanted to go",
  },
  work: {
    title: "What do you do for work?",
    description: "Tell us about your current role or profession.",
    icon: Briefcase,
    label: "My work",
  },
  forGuests: {
    title: "For guests, I always...",
    description: "Share a detail about how you treat your guests.",
    icon: Coffee,
    label: "For guests, I always",
  },
  pets: {
    title: "Do you have pets?",
    description:
      "Let guests know if you have any furry, scaly, or feathered friends.",
    icon: PawPrint,
    label: "Pets",
  },
  decade: {
    title: "What decade were you born?",
    description: "Share the decade you were born in.",
    icon: MapPin,
    label: "Decade I was born",
  },
  funFact: {
    title: "What's your fun fact?",
    description: "Share something interesting about yourself.",
    icon: Lightbulb,
    label: "My fun fact",
  },
  tooMuchTime: {
    title: "What do you spend too much time doing?",
    description: "Share a hobby or activity you enjoy.",
    icon: Clock,
    label: "I spend too much time",
  },
  favoriteSong: {
    title: "What was your favorite song in high school?",
    description: "Share your favorite song from your high school days.",
    icon: Music,
    label: "My favorite song in high school",
  },
  uselessSkill: {
    title: "What's your most useless skill?",
    description: "Share a skill you have that's not very useful.",
    icon: Sparkles,
    label: "My most useless skill",
  },
  biography: {
    title: "What would your biography title be?",
    description: "If you were to write a biography, what would the title be?",
    icon: Book,
    label: "My biography title would be",
  },
  obsession: {
    title: "What are you obsessed with?",
    description: "Share something you're passionate about.",
    icon: Heart,
    label: "I'm obsessed with",
  },
  languages: {
    title: "What languages do you speak?",
    description: "Share the languages you speak.",
    icon: Languages,
    label: "Languages I speak",
  },
  location: {
    title: "Where do you live?",
    description: "Share your current location.",
    icon: MapPin,
    label: "Where I live",
  },
};
