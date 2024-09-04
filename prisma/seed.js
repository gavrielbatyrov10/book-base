const prisma = require("../prisma");

const seed = async () => {
  // Create authors
  for (let i = 0; i < 10; i++) {
    await prisma.author.upsert({
      where: { name: `author ${i}` },
      update: {},
      create: {
        name: `author ${i}`,
        bio: `author bio ${i}`,
      },
    });
  }

  // Create publishers
  for (let i = 0; i < 3; i++) {
    await prisma.publisher.upsert({
      where: { name: `publisher ${i}` },
      update: {},
      create: {
        name: `publisher ${i}`,
      },
    });
  }

  // Create genres
  for (let i = 0; i < 5; i++) {
    await prisma.genre.upsert({
      where: { name: `genre ${i}` },
      update: {},
      create: {
        name: `genre ${i}`,
      },
    });
  }

  // Create books and link them to authors, publishers, and genres
  for (let i = 0; i < 10; i++) {
    const author = await prisma.author.findUnique({
      where: { name: `author ${i % 10}` },
    });
    const publisher = await prisma.publisher.findUnique({
      where: { name: `publisher ${i % 3}` },
    });
    const genre = await prisma.genre.findUnique({
      where: { name: `genre ${i % 5}` },
    });

    const book = await prisma.book.create({
      data: {
        title: `Book Title ${i}`,
        published: true,
        author: { connect: { id: author.id } }, // Connect the author
        publisher: { connect: { id: publisher.id } }, // Connect the publisher
        genres: { connect: [{ id: genre.id }] }, // Connect the genre(s)
      },
    });

    // Create reviews for the book
    for (let j = 0; j < 3; j++) {
      await prisma.review.create({
        data: {
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          comment: `Review comment ${j} for Book Title ${i}`,
          book: { connect: { id: book.id } }, // Connect the review to the book
        },
      });
    }
  }
};

seed()
  .then(async () => {
    console.log("Seeding completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error: ", e);
    await prisma.$disconnect();
    process.exit(1);
  });
