const { query } = require('./config/database');

const sampleFeedbacks = [
  {
    title: 'Archived Chat',
    platform: 'Android',
    module: 'Chat',
    description: 'In android, I can achieve chats. But I can\'t find archived chats.',
    attachments: '',
    tags: 'In-Progress, Feature Request',
    status: 'In-Progress',
    votes: 40,
    created_by: 'Chat Android'
  },
  {
    title: 'Uploading Issues',
    platform: 'Web',
    module: 'Channel',
    description: 'Some times, when I upload any image, there is no send option like above image...',
    attachments: '',
    tags: 'New, Bug Report',
    status: 'New',
    votes: 40,
    created_by: 'Channel Web'
  },
  {
    title: 'Accessibility',
    platform: 'Mobile',
    module: 'Chat',
    description: 'If take any screen shots, there is no border on image. Now user will confuse to see the image',
    attachments: '',
    tags: 'In Review, Feature Request',
    status: 'In Review',
    votes: 40,
    created_by: 'Chat Mobile'
  },
  {
    title: 'Admin Change',
    platform: 'Web',
    module: 'Channel',
    description: 'In project section, I can\'t change admin.',
    attachments: '',
    tags: 'In Review, Feature Request',
    status: 'In Review',
    votes: 40,
    created_by: 'Channel Web'
  },
  {
    title: 'Zoom-In & Zoom-Out',
    platform: 'iOS',
    module: 'Channel',
    description: 'When viewing images, I encounter a challenge: the inability to zoom in on specific areas. This limitation affects my ability to closely examine details or specific parts of an image. Is there a way to enhance the zoom functionality for a more detailed viewing experience?',
    attachments: 'app_icons.svg',
    tags: 'Bug Report, Feedback',
    status: 'New',
    votes: 40,
    created_by: 'Channel iOS'
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample feedbacks...');
    
    for (const feedback of sampleFeedbacks) {
      await query(
        'INSERT INTO feedbacks (title, platform, module, description, attachments, tags, status, votes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          feedback.title,
          feedback.platform,
          feedback.module,
          feedback.description,
          feedback.attachments,
          feedback.tags,
          feedback.status,
          feedback.votes,
          feedback.created_by
        ]
      );
      console.log(`Added: ${feedback.title}`);
    }
    
    console.log('\n✅ All sample feedbacks added successfully!');
    console.log('You can now start the server with: npm start');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
