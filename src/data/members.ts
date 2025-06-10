"use client"

export interface Member {
  id: string
  name: string
  imgUrl: string
  lat: number
  lng: number
  role: string
  location: string
  description?: string
}

export const teamMembers: Member[] = [
  {
    id: "1",
    name: "Saiyid Kazmi",
    imgUrl: "/team/kaz.jpg",
    lat: 38.627,
    lng: -90.1994,
    role: "CEO & Co-Founder",
    location: "St Louis, MO",
    description: "Kaz is the visionary CEO leading Vendle's mission. He graduated from McGill University in 2025.",
  },
  {
    id: "2",
    name: "Saviru Perera",
    imgUrl: "/team/sav.jpg",
    lat: 25.7617,
    lng: -80.1918,
    role: "CTO & Co-Founder",
    location: "Miami, FL",
    description:
      "Sav is the lead engineer behind Vendle and oversees all things technology at Vendle. He graduated from McGill University in 2025.",
  },
  {
    id: "3",
    name: "TJ",
    imgUrl: "/team/tj.jpg",
    lat: 36.0014,
    lng: -78.9382,
    role: "CFO & Co-Founder",
    location: "Durham, NC",
    description: "TJ manages Vendle's finances and growth. He is a student @ Duke University.",
  },
  {
    id: "4",
    name: "Minh",
    imgUrl: "/team/minh.jpg",
    lat: 38.8816,
    lng: -77.091,
    role: "Software Engineer",
    location: "Arlington, VA",
    description: "Minh is a software engineer behind Vendle. He is a masters student @ Georgia Tech.",
  },
  {
    id: "5",
    name: "Diego",
    imgUrl: "/team/diego.jpg",
    lat: -33.8688,
    lng: 151.2093,
    role: "Software Engineer",
    location: "Sydney, Australia",
    description: "Diego is a key engineer behind Vendle who builds robust features for Vendle users worldwide.",
  },
  {
    id: "6",
    name: "David",
    imgUrl: "/team/david.jpg",
    lat: 45.5017,
    lng: -73.5673,
    role: "COO & Co-Founder",
    location: "Montreal, QC",
    description: "David keeps Vendle's operations running smoothly. He graduated from McGill University in 2025.",
  },
  {
    id: "7",
    name: "Suneru",
    imgUrl: "/team/suneru.jpg",
    lat: 43.4643,
    lng: -80.5204,
    role: "Machine Learning Engineer",
    location: "Waterloo, Ontario",
    description:
      "Suneru is an engineer behind Vendle, implementing AI & Component Design to Vendle. He is a undergraduate student @ University of Waterloo.",
  },
]
