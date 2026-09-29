require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

// [title, author, genre, price (INR), stock, description]
const raw = [
  ['The Alchemist', 'Paulo Coelho', 'Fiction', 299, 14, 'A shepherd boy travels from Spain to Egypt in search of treasure and finds his own path.'],
  ['To Kill a Mockingbird', 'Harper Lee', 'Fiction', 349, 9, "A lawyer's stand for justice in a small Southern town, seen through his daughter's eyes."],
  ['The Kite Runner', 'Khaled Hosseini', 'Fiction', 399, 11, 'A story of friendship, guilt and redemption that begins in Kabul.'],
  ['Life of Pi', 'Yann Martel', 'Fiction', 379, 7, 'A boy survives at sea with a Bengal tiger in this tale of faith and imagination.'],
  ['The Book Thief', 'Markus Zusak', 'Fiction', 359, 0, 'Death narrates the story of a girl who steals books in Nazi Germany.'],
  ['Malgudi Days', 'R. K. Narayan', 'Fiction', 225, 18, 'Warm, funny stories from the imagined South Indian town of Malgudi.'],
  ['The God of Small Things', 'Arundhati Roy', 'Fiction', 399, 6, 'A family in Kerala and the small events that changed their lives forever.'],

  ["Harry Potter and the Philosopher's Stone", 'J. K. Rowling', 'Fantasy', 499, 25, 'A boy learns he is a wizard and starts his first year at Hogwarts.'],
  ['The Hobbit', 'J. R. R. Tolkien', 'Fantasy', 399, 15, 'Bilbo Baggins joins a company of dwarves on a quest to win back their mountain home.'],
  ['A Game of Thrones', 'George R. R. Martin', 'Fantasy', 599, 10, 'Noble houses fight for the Iron Throne while an ancient threat gathers in the north.'],
  ['The Name of the Wind', 'Patrick Rothfuss', 'Fantasy', 549, 5, 'A famous wizard tells the story of how he became a legend.'],
  ['The Lion, the Witch and the Wardrobe', 'C. S. Lewis', 'Fantasy', 299, 13, 'Four children step through a wardrobe into the magical land of Narnia.'],
  ['Mistborn: The Final Empire', 'Brandon Sanderson', 'Fantasy', 575, 8, 'A crew of thieves plans to overthrow an immortal ruler using the power of metals.'],

  ['The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Mystery', 449, 6, 'A journalist and a hacker investigate a decades-old disappearance.'],
  ['Gone Girl', 'Gillian Flynn', 'Mystery', 399, 9, 'A wife vanishes on her anniversary and her husband becomes the prime suspect.'],
  ['And Then There Were None', 'Agatha Christie', 'Mystery', 299, 16, 'Ten strangers on an island are removed one by one.'],
  ['The Da Vinci Code', 'Dan Brown', 'Mystery', 349, 12, 'A symbologist follows clues hidden in art and history to a secret that could shake the world.'],
  ['A Study in Scarlet', 'Arthur Conan Doyle', 'Mystery', 199, 20, 'Sherlock Holmes and Dr Watson meet and take on their first case together.'],
  ['The Silent Patient', 'Alex Michaelides', 'Mystery', 379, 0, 'A painter shoots her husband and never speaks again. A therapist tries to find out why.'],

  ['Dune', 'Frank Herbert', 'Sci-Fi', 549, 10, "A young heir must survive on a desert planet that holds the universe's most valuable resource."],
  ['1984', 'George Orwell', 'Sci-Fi', 249, 22, 'A man tries to think freely in a country where the government watches everything.'],
  ['The Martian', 'Andy Weir', 'Sci-Fi', 399, 8, 'An astronaut stranded on Mars must use science and humour to survive.'],
  ["Ender's Game", 'Orson Scott Card', 'Sci-Fi', 379, 7, 'A gifted child is trained at a battle school to lead humanity against an alien threat.'],
  ['Foundation', 'Isaac Asimov', 'Sci-Fi', 349, 9, 'A mathematician plans to shorten the dark age that follows the fall of a galactic empire.'],
  ['Brave New World', 'Aldous Huxley', 'Sci-Fi', 299, 11, 'A future society that trades freedom for comfort and stability.'],

  ['Atomic Habits', 'James Clear', 'Self-Help', 449, 30, 'Small changes in daily routine that add up to remarkable results.'],
  ['The Power of Now', 'Eckhart Tolle', 'Self-Help', 349, 10, 'A guide to living in the present moment and letting go of worry.'],
  ['Deep Work', 'Cal Newport', 'Self-Help', 399, 12, 'Rules for focused success in a distracted world.'],
  ['Ikigai', 'Héctor García and Francesc Miralles', 'Self-Help', 299, 17, 'The Japanese idea of finding a reason to get up in the morning.'],
  ['Think and Grow Rich', 'Napoleon Hill', 'Self-Help', 199, 19, 'A classic on the mindset and habits behind personal success.'],
  ['The 7 Habits of Highly Effective People', 'Stephen R. Covey', 'Self-Help', 449, 0, 'Seven principles for personal and professional effectiveness.'],

  ['Wings of Fire', 'A. P. J. Abdul Kalam', 'Biography', 250, 14, "The autobiography of India's Missile Man, from Rameswaram to the presidency."],
  ['The Story of My Experiments with Truth', 'M. K. Gandhi', 'Biography', 199, 12, "Gandhi's own account of his life and his search for truth."],
  ['Steve Jobs', 'Walter Isaacson', 'Biography', 599, 6, 'The life of the Apple co-founder, based on more than forty interviews.'],
  ['Long Walk to Freedom', 'Nelson Mandela', 'Biography', 499, 8, "Mandela's story from a village boyhood to the presidency of South Africa."],
  ['Becoming', 'Michelle Obama', 'Biography', 549, 9, 'A memoir of growing up in Chicago and life in the White House.'],
  ['I Am Malala', 'Malala Yousafzai', 'Biography', 349, 10, 'The story of the girl who stood up for education and survived an attack.'],

  ['Sapiens', 'Yuval Noah Harari', 'History', 520, 0, 'A brief history of humankind, from the Stone Age to the present.'],
  ['Guns, Germs, and Steel', 'Jared Diamond', 'History', 499, 7, 'Why some societies came to dominate others.'],
  ['The Discovery of India', 'Jawaharlal Nehru', 'History', 399, 9, "Nehru's reflections on India's past, written in prison."],
  ['India After Gandhi', 'Ramachandra Guha', 'History', 699, 5, "The history of the world's largest democracy since independence."],

  ['A Brief History of Time', 'Stephen Hawking', 'Science', 349, 13, 'From the Big Bang to black holes, explained for general readers.'],
  ['Cosmos', 'Carl Sagan', 'Science', 449, 8, "A journey through space and time and humanity's place in the universe."],
  ['The Selfish Gene', 'Richard Dawkins', 'Science', 399, 6, 'A look at evolution from the point of view of the gene.'],
  ['Astrophysics for People in a Hurry', 'Neil deGrasse Tyson', 'Science', 299, 15, "The universe's biggest ideas in short, readable chapters."],

  ['Clean Code', 'Robert C. Martin', 'Technology', 699, 5, 'A handbook on writing readable, maintainable software.'],
  ['The Pragmatic Programmer', 'Andrew Hunt and David Thomas', 'Technology', 749, 7, 'Practical advice for becoming a better programmer.'],
  ['Eloquent JavaScript', 'Marijn Haverbeke', 'Technology', 599, 10, 'A modern introduction to programming with JavaScript.'],
  ['Designing Data-Intensive Applications', 'Martin Kleppmann', 'Technology', 899, 4, 'The principles behind reliable, scalable data systems.'],

  ['Rich Dad Poor Dad', 'Robert T. Kiyosaki', 'Business', 299, 21, 'Lessons about money and investing from two very different father figures.'],
  ['Zero to One', 'Peter Thiel', 'Business', 399, 9, 'Notes on startups and how to build companies that create the future.'],
  ['The Psychology of Money', 'Morgan Housel', 'Business', 399, 16, 'Timeless lessons on how people think about wealth and risk.'],
  ['The Lean Startup', 'Eric Ries', 'Business', 449, 8, 'A method for building products through fast experiments.'],

  ['Pride and Prejudice', 'Jane Austen', 'Romance', 249, 18, 'Elizabeth Bennet and Mr Darcy overcome pride and first impressions.'],
  ['Jane Eyre', 'Charlotte Brontë', 'Romance', 249, 9, 'An orphaned governess finds love and a dark secret at Thornfield Hall.'],
  ['Me Before You', 'Jojo Moyes', 'Romance', 349, 0, 'A young woman becomes a carer for a man who has given up on life.'],
  ['The Notebook', 'Nicholas Sparks', 'Romance', 299, 12, 'A love story that survives time and memory loss.'],

  ['The Little Prince', 'Antoine de Saint-Exupéry', 'Children', 199, 20, 'A pilot meets a small prince from another planet in the desert.'],
  ["Charlotte's Web", 'E. B. White', 'Children', 249, 14, 'A spider saves her friend, a pig, with words woven into her web.'],
  ['Matilda', 'Roald Dahl', 'Children', 249, 11, 'A clever girl with a special gift takes on cruel adults.'],
  ['Swami and Friends', 'R. K. Narayan', 'Children', 225, 10, 'The adventures of a schoolboy and his friends in Malgudi.']
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Book.deleteMany({});
  await Order.deleteMany({});
  await User.create([
    { name: 'Store Admin', email: 'admin@bookstore.com', password: 'Admin@123', role: 'Admin' },
    { name: 'Test Reader', email: 'user@bookstore.com', password: 'User@1234', role: 'User' }
  ]);
  await Book.insertMany(raw.map(([title, author, genre, price, stock, description]) => ({ title, author, genre, price, stock, description })));
  console.log(`Seeded ${raw.length} books. Admin: admin@bookstore.com / Admin@123  |  User: user@bookstore.com / User@1234`);
  process.exit(0);
})();
