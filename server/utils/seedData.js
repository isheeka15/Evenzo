const Event = require('../models/Event');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const sampleOrganizer = {
  name: 'Evenzo Events',
  email: 'organizer@evenzo.com',
  password: 'Organizer@123',
  role: 'organizer',
};

const events = [
  {
    title: 'Holi Bash Delhi 2026',
    description: 'A vibrant celebration with colors, live DJs, regional snacks, and immersive Holi art installations.',
    category: 'Festival',
    city: 'Delhi',
    location: 'India Gate Lawns',
    eventDate: new Date('2026-03-24T18:00:00+05:30'),
    startTime: '6:00 PM',
    price: 25,
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
    capacity: 1200,
    tags: ['Holi', 'Culture', 'Music'],
    published: true,
  },
  {
    title: 'IIT Indore Tech Fest',
    description: 'Innovation challenges, AI workshops, robotics showcases, and campus networking for student founders.',
    category: 'Technology',
    city: 'Indore',
    location: 'IIT Indore Campus',
    eventDate: new Date('2026-04-12T10:00:00+05:30'),
    startTime: '10:00 AM',
    price: 0,
    image: 'https://images.unsplash.com/photo-1531497865148-7d84b5a3c07c?auto=format&fit=crop&w=1200&q=80',
    capacity: 500,
    tags: ['Tech', 'Innovation', 'Workshops'],
    published: true,
  },
  {
    title: 'Bengaluru Startup Meetup',
    description: 'Founders, investors, and product builders gather for pitch talks, mentorship, and coffee-powered networking.',
    category: 'Business',
    city: 'Bengaluru',
    location: 'Koramangala CoLab',
    eventDate: new Date('2026-05-08T18:30:00+05:30'),
    startTime: '6:30 PM',
    price: 15,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    capacity: 220,
    tags: ['Startups', 'Networking', 'Funding'],
    published: true,
  },
  {
    title: 'Mumbai EDM Night',
    description: 'High-energy EDM festival with international DJs, laser shows, and VIP lounges by the bay.',
    category: 'Music',
    city: 'Mumbai',
    location: 'Jio World Garden',
    eventDate: new Date('2026-05-29T20:00:00+05:30'),
    startTime: '8:00 PM',
    price: 40,
    image: 'https://images.unsplash.com/photo-1501869151192-5fd3c6b81d04?auto=format&fit=crop&w=1200&q=80',
    capacity: 1800,
    tags: ['EDM', 'Nightlife', 'Club'],
    published: true,
  },
  {
    title: 'Jaipur Literature Festival',
    description: 'A cultural extravaganza with author talks, poetry streams, and book signings in the Pink City.',
    category: 'Arts',
    city: 'Jaipur',
    location: 'Diggi Palace',
    eventDate: new Date('2026-01-18T11:00:00+05:30'),
    startTime: '11:00 AM',
    price: 10,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    capacity: 900,
    tags: ['Books', 'Culture', 'Speakers'],
    published: true,
  },
  {
    title: 'Pune AI Workshop',
    description: 'A hands-on AI workshop for students and early-career engineers, focused on NLP and predictive systems.',
    category: 'Education',
    city: 'Pune',
    location: 'Symbiosis Institute',
    eventDate: new Date('2026-06-02T09:30:00+05:30'),
    startTime: '9:30 AM',
    price: 20,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    capacity: 150,
    tags: ['AI', 'Workshop', 'Skills'],
    published: true,
  },
  {
    title: 'Chennai Food Carnival',
    description: 'A street food celebration featuring local delicacies, chef demos, and live music by the beach.',
    category: 'Food',
    city: 'Chennai',
    location: 'Marina Beach Plaza',
    eventDate: new Date('2026-07-15T17:00:00+05:30'),
    startTime: '5:00 PM',
    price: 12,
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
    capacity: 1300,
    tags: ['Food', 'Culture', 'Live Music'],
    published: true,
  },
  {
    title: 'Hyderabad Wellness Retreat',
    description: 'A relaxing wellness retreat with yoga, healthy cooking, and mindfulness sessions.',
    category: 'Health',
    city: 'Hyderabad',
    location: 'Hussain Sagar Gardens',
    eventDate: new Date('2026-08-10T08:00:00+05:30'),
    startTime: '8:00 AM',
    price: 18,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    capacity: 250,
    tags: ['Wellness', 'Yoga', 'Health'],
    published: true,
  },
  {
    title: 'Goa Beach Festival',
    description: 'Sunset performances, beachside parties, and seafood tastings at India’s most vibrant coastline festival.',
    category: 'Festival',
    city: 'Goa',
    location: 'Calangute Beach Arena',
    eventDate: new Date('2026-09-05T16:00:00+05:30'),
    startTime: '4:00 PM',
    price: 30,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    capacity: 2200,
    tags: ['Beach', 'Music', 'Party'],
    published: true,
  }
];

const seedInitialEvents = async () => {
  try {
    const existingOrganizer = await User.findOne({ email: sampleOrganizer.email });
    let organizer;

    if (!existingOrganizer) {
      const hashedPassword = await bcrypt.hash(sampleOrganizer.password, 10);
      organizer = await User.create({
        name: sampleOrganizer.name,
        email: sampleOrganizer.email,
        password: hashedPassword,
        role: sampleOrganizer.role,
      });
    } else {
      organizer = existingOrganizer;
    }

    const existingEvents = await Event.find({ organizerId: organizer._id }).select('title').lean();
    const existingTitles = new Set(existingEvents.map((evt) => evt.title));

    const eventsWithOrganizer = events
      .filter((item) => !existingTitles.has(item.title))
      .map((item) => ({
        ...item,
        organizerName: organizer.name,
        organizerId: organizer._id,
        bannerUrl: item.image || item.bannerUrl || '',
      }));

    if (eventsWithOrganizer.length > 0) {
      await Event.insertMany(eventsWithOrganizer);
      console.log(`Seeded ${eventsWithOrganizer.length} new default events for Evenzo`);
    } else {
      console.log('No new events to seed. Existing default events are already present.');
    }
  } catch (error) {
    console.error('Seed data error:', error.message);
  }
};

module.exports = { seedInitialEvents };
