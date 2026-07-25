const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function testForum() {
  console.log('Testing Database Direct Interactions...');
  
  const visitorId = crypto.randomUUID();
  console.log('Generated mock visitor:', visitorId);

  // Ensure visitor exists
  let visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
  if (!visitor) {
    visitor = await prisma.visitor.create({ data: { id: visitorId } });
    console.log('Created visitor record.');
  }

  // Create Topic
  const topic = await prisma.forumTopic.create({
    data: {
      title: 'Automated Test Topic ' + Date.now(),
      content: 'Testing direct insertion and relations',
      authorName: 'AutoTester',
      isVisible: true,
      isLocked: false
    }
  });
  console.log('Created Topic:', topic.id);

  // Like it
  const like = await prisma.forumLike.create({
    data: {
      topicId: topic.id,
      visitorId: visitor.id
    }
  });
  console.log('Added Like. ID:', like.id);

  // Comment it
  const comment = await prisma.forumComment.create({
    data: {
      topicId: topic.id,
      authorName: 'AutoCommenter',
      content: 'This is an automated comment for testing.',
      isVisible: true
    }
  });
  console.log('Added Comment. ID:', comment.id);

  const aggregate = await prisma.forumTopic.findUnique({
    where: { id: topic.id },
    include: {
      _count: { select: { likes: true, comments: true } }
    }
  });
  
  if (aggregate._count.likes === 1 && aggregate._count.comments === 1) {
    console.log('SUCCESS: Aggregates verified.');
  } else {
    console.error('FAILED: Aggregates mismatched.', aggregate._count);
    process.exit(1);
  }
}

testForum()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
