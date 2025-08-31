const mongoose = require('mongoose');
const Tuition = require('./models/apTuition');

const sampleTuitions = [ 
  { tuitionName: "Algebra Basics", subjects: ["Mathematics", "Algebra"], mode: "Online", fee: { amount: 25, type: "per hour" }, image: "https://curiosityhuman.com/wp-content/uploads/2020/11/61654d4d412cb7f85d8f6f4e1a8072c5.jpg", description: "Comprehensive Algebra course for beginners." },
  { tuitionName: "Physics & Chemistry Essentials", subjects: ["Physics", "Chemistry"], mode: "Offline", fee: { amount: 30, type: "per hour" }, image: "https://cdn3.vectorstock.com/i/1000x1000/27/02/chemistry-and-physics-science-banners-vector-11952702.jpg", description: "Fundamental Physics and Chemistry concepts for high school." },
  { tuitionName: "English Literature Masterclass", subjects: ["English", "Literature"], mode: "Online", fee: { amount: 20, type: "per hour" }, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80", description: "Deep dive into classic and modern English literature." },
  { tuitionName: "Programming Fundamentals", subjects: ["Computer Science", "Programming"], mode: "Online", fee: { amount: 35, type: "per hour" }, image: "https://i.ytimg.com/vi/WQo1XMFZXr4/maxresdefault.jpg", description: "Learn the basics of programming and data structures." },
  { tuitionName: "Biology & Environmental Science", subjects: ["Biology", "Environmental Science"], mode: "Offline", fee: { amount: 28, type: "per hour" }, image: "https://th.bing.com/th/id/OIP._BbD1xEsLmA4vHmerXOIKwHaJu?w=127&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", description: "Hands-on biology and environmental science lessons." },
  { tuitionName: "Statistics and Probability", subjects: ["Mathematics", "Statistics"], mode: "Online", fee: { amount: 40, type: "per hour" }, image: "https://th.bing.com/th/id/OIP.AZTrSzDrS1DqAGcdNt4iTwAAAA?w=305&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", description: "Advanced course on statistics and probability theory." },
  { tuitionName: "World History & Geography", subjects: ["History", "Geography"], mode: "Offline", fee: { amount: 22, type: "per hour" }, image: "https://th.bing.com/th?q=World+History+and+Geography+for+Kids+Image&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247", description: "Interactive lessons on history and geography topics." },
  { tuitionName: "Chemistry and Physics Concepts", subjects: ["Chemistry", "Physics"], mode: "Online", fee: { amount: 27, type: "per hour" }, image: "https://thumbs.dreamstime.com/z/science-banner-vector-concepts-line-style-chemistry-physics-design-elements-laboratory-workspace-science-symbols-icons-66187963.jpg", description: "Simplifying difficult chemistry and physics concepts." },
  { tuitionName: "Creative Writing Workshop", subjects: ["English", "Creative Writing"], mode: "Offline", fee: { amount: 24, type: "per hour" }, image: "https://tse2.mm.bing.net/th/id/OIP.leDvRKEwWLP16MFtVHXoWAHaEi?rs=1&pid=ImgDetMain&o=7&rm=3", description: "Develop your writing skills with practical exercises." }
];

const MONGO_URI = process.env.MONGO_URI;
async function seedTuitions() {
  try {
    const count = await Tuition.countDocuments();
    if (count === 0) {
      await Tuition.insertMany(sampleTuitions);
      console.log(`${sampleTuitions.length} tuitions inserted.`);
    } else {
      console.log('Tuitions collection already has data, skipping insert.');
    }
  } catch (err) {
    console.error('Error seeding tuitions:', err);
  }
}

module.exports = seedTuitions;