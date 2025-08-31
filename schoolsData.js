const mongoose = require('mongoose');
const School = require('./models/schools');

const SchoolsData = [
  { name: "Oakridge International School", address: "Tagarapuvalasa, Visakhapatnam, Andhra Pradesh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3TooOJnF12QdGQurJWYkr3uNj0ac6I_A2SA&s", tags: ["International", "IB", "Day School", "Boarding"] },
  { name: "Indus International School", address: "Kurnool, Andhra Pradesh", image: "https://content3.jdmagicbox.com/comp/kurnool/z9/9999p8518.8518.140215211237.p5z9/catalogue/indus-high-school-kurnool-ho-kurnool-schools-dcqztyk.jpg", tags: ["International", "CBSE", "Day School", "Boarding"] },
  { name: "The Velammal International School", address: "Tirupati, Andhra Pradesh", image: "https://www.tvis.in/images/abttvis-670x410.jpg", tags: ["International", "CBSE", "Day School", "Boarding"] },
  { name: "Sree Vidyanikethan International School", address: "Sree Sainath Nagar, Tirupati, Andhra Pradesh", image: "https://www.eduska.com/assets/user_photo/bc5dca5fb7f2b71ba14e7697af303fcb.jpeg", tags: ["Day School", "Residential", "CBSE"] },
  { name: "Nalanda Vidya Niketan", address: "Vijayawada, Andhra Pradesh", image: "https://classhud.com/assets/media/uploads/listing/cover_image/nalanda-vidyaniketan.jpg", tags: ["Day School", "CBSE"] },
  { name: "Delhi Public School, Anandapuram", address: "Anandapuram, Visakhapatnam, Andhra Pradesh", image: "https://www.yayskool.com/images/school/delhi-public-school-visakhapatnam-473116748.png", tags: ["Day School", "CBSE"] },
  { name: "Delhi Public School, Amaravati Road", address: "Amaravati Road, Guntur, Andhra Pradesh", image: "https://www.edustoke.com/assets/uploads-new/315ac46f-47c2-4bed-86c5-abfa73781cff.png", tags: ["Day School", "CBSE"] },
  { name: "Delhi Public School, Guntur", address: "Guntur, Andhra Pradesh, India", image: "https://www.joonsquare.com/usermanage/image/business/delhi-public-school-guntur-8757/delhi-public-school-guntur-school.jpg", tags: ["Day School", "CBSE"] },
  { name: "Delhi Public School, Vijayawada", address: "Vijayawada, Andhra Pradesh, India", image: "https://www.schoolmykids.com/smk-media/2019/06/Delhi-Public-School-Vijayawada.png", tags: ["Day School", "CBSE"] },
  { name: "Sri Prakash Vidyaniketan", address: "Pendurthi, Visakhapatnam, Andhra Pradesh", image: "https://www.sriprakashschools.com/wp-content/uploads/2025/01/KPLP_Building.jpg", tags: ["Day School", "CBSE"] },
  { name: "NRI Indian Springs School", address: "Enikepadu, Vijayawada, Andhra Pradesh", image: "https://content.jdmagicbox.com/comp/vijayawada/w9/0866px866.x866.100518112857.y9w9/catalogue/indian-springs-international-school-patamata-vijayawada-schools-nzf9j8-250.jpg", tags: ["CBSE", "Residential"] },
  { name: "Narayana Concept School", address: "Visakhapatnam, Andhra Pradesh, India", image: "https://content.jdmagicbox.com/comp/visakhapatnam/y2/0891px891.x891.180101060653.b6y2/catalogue/narayana-e-techno-school-duvvada-visakhapatnam-schools-4bc6v7zqab-250.jpg", tags: ["Day School", "Boarding"] },
  { name: "Narayana Olympiad School", address: "Ram Nagar, Anantapur, Andhra Pradesh", image: "https://campuspro.co.in/school-image/1747467073_row_153.jpg", tags: ["Day School", "Olympiad"] },
  { name: "Narayana e-Techno School", address: "Budhwarpet, Kurnool, Andhra Pradesh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3faLvp0GPkANpHKlqZo088wj3W1XEVCMk6A&s", tags: ["Day School", "Techno"] },
  { name: "Sri Chaitanya Techno School", address: "Kamalanagar, Anantapur, Andhra Pradesh", image: "https://content3.jdmagicbox.com/comp/anantapur/j6/9999p8554.8554.140213200634.y7j6/catalogue/sri-chaitanya-techno-school-anantapur-ho-anantapur-schools-9kqe3dfcux.jpg", tags: ["Day School", "Techno"] },
  { name: "Narayana e-Techno School", address: "Benz Circle, Vijayawada, Andhra Pradesh", image: "https://images.jdmagicbox.com/comp/vijayawada/q5/0866px866.x866.140419131540.y6q5/catalogue/narayana-iitolympiad-kanuru-vijayawada-schools-4j6f9s6.jpg", tags: ["Day School", "Techno"] },
  { name: "Bhashyam Blooms Techno School", address: "Lakshmipuram, Guntur, Andhra Pradesh", image: "https://content.jdmagicbox.com/comp/guntur/w2/9999px863.x863.170930172508.k7w2/catalogue/bhashyam-blooms-gujjannaguntla-guntur-schools-yggufd47a4.jpg", tags: ["Day School", "Techno"] },
  { name: "Chinmaya Vidyalaya, AIR Bypass Road", address: "AIR Bypass Road, Tirupati, Andhra Pradesh", image: "https://lh3.googleusercontent.com/proxy/lXhUAlvRhMa64MG3V1rdj2yMgLt9Zz1-e9KQR3TzIn8zLa9gW6WcyuxqnUSCr05B2lfPQ0_z53TxwGRdbL3D2GdFRE_z8gk-Za5KLjRbig", tags: ["Day School", "CBSE"] },
  { name: "Chinmaya Vidyalaya", address: "Tirupati, Andhra Pradesh, India", image: "https://classhud.com/assets/media/uploads/listing/logo/chinmaya-vidyalaya-2.png", tags: ["Day School", "Day Boarding"] },
  { name: "The Presidential School", address: "Visakhapatnam, Andhra Pradesh", image: "https://content.jdmagicbox.com/comp/visakhapatnam/06/0891p891std2000206/catalogue/presidential-school-seethammadhara-visakhapatnam-schools-py0u5-250.png", tags: ["Day School", "CBSE"] },
  { name: "Kendriya Vidyalaya, Kurnool", address: "Near Ordnance Factory, Kurnool, Andhra Pradesh", image: "https://content.jdmagicbox.com/comp/kurnool/83/9999pmulhydstd25583/catalogue/kendriya-vidyalaya-kurnool-ho-kurnool-schools-yz1ux32.jpg", tags: ["CBSE", "Central Government", "Day School"] },
  { name: "Kendriya Vidyalaya, Tadepalli", address: "Tadepalli, Guntur, Andhra Pradesh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6HsS9vGMhTU2uuDqaTwMHThX82khnlqRlLg&s", tags: ["Day School", "CBSE"] },
  { name: "Kendriya Vidyalaya No. 1, Anantapur", address: "Near Railway Station, Anantapur, Andhra Pradesh", image: "https://bingo.icbse.com/v1/business.jpg?action=banner&id=2dk9xv", tags: ["Day School", "CBSE"] },
  { name: "Little Flower English Medium School", address: "R.S. Road, Kadapa, Andhra Pradesh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTRKcTsVCGPcdn1qvOZODreyx9MqXjhhaSEg&s", tags: ["Day School", "English Medium"] },
  { name: "Kiddies English Medium School", address: "Magunta Layout, Nellore, Andhra Pradesh", image: "https://content.jdmagicbox.com/comp/nellore/h9/9999px861.x861.160414103544.s3h9/catalogue/eurok-ds-international-pre-school-ramamurthy-nagar-nellore-schools-f8b3c4hd4y.jpg", tags: ["Day School", "English Medium"] }
];


async function seedSchools() {
  try {
    const count = await School.countDocuments();
    if (count > 0) return;
    await School.insertMany(SchoolsData);
    console.log(`${SchoolsData.length} schools inserted.`);
  } catch (err) {
    console.error('Error inserting schools:', err);
  }
}

module.exports = seedSchools;