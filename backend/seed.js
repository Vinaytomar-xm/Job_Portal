require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

// ─── CONNECT TO DATABASE ─────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// ─── SEED DATA ───────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'John User',
        email: 'user@test.com',
        password: '123456',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Jane Doe',
        email: 'jane@test.com',
        password: '123456',
        role: 'user'
      }
    ]);
    console.log('✅ Users created:', users.length);

    const admin = users.find(u => u.role === 'admin');
    const normalUsers = users.filter(u => u.role === 'user');

    // Create jobs
    const jobs = await Job.create([
      {
        title: 'Frontend Developer Intern',
        company: 'TechNova',
        location: 'Remote',
        type: 'Internship',
        experience: 'Fresher',
        salary: '₹15,000/mo',
        description: 'Join our UI team and work on cutting-edge web interfaces using HTML, CSS, and JavaScript.',
        skills: ['HTML', 'CSS', 'JavaScript'],
        responsibilities: [
          'Build responsive UI components',
          'Collaborate with designers',
          'Write clean, maintainable code',
          'Participate in code reviews'
        ],
        requirements: [
          'Basic knowledge of HTML, CSS, JavaScript',
          'Understanding of responsive design',
          'Good communication skills',
          'Eagerness to learn'
        ],
        status: 'active',
        createdBy: admin._id
      },
      {
        title: 'Full Stack Developer',
        company: 'CodeCraft Solutions',
        location: 'Bangalore',
        type: 'Full-time',
        experience: '1-3 Years',
        salary: '₹6-10 LPA',
        description: 'Build scalable web applications using React and Node.js in an agile environment.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        responsibilities: [
          'Develop full-stack features',
          'Design and implement REST APIs',
          'Manage database schemas',
          'Deploy on cloud platforms'
        ],
        requirements: [
          '1-3 years of full-stack experience',
          'Proficiency in React and Node.js',
          'Experience with MongoDB',
          'Familiarity with Git and CI/CD'
        ],
        status: 'active',
        createdBy: admin._id
      },
      {
        title: 'React Developer',
        company: 'InnovateSoft',
        location: 'Remote',
        type: 'Full-time',
        experience: '2-4 Years',
        salary: '₹8-12 LPA',
        description: 'Build scalable React components and optimize frontend performance.',
        skills: ['React', 'Redux', 'TypeScript', 'Jest'],
        responsibilities: [
          'Build React component libraries',
          'Implement state management',
          'Optimize app performance',
          'Write unit tests'
        ],
        requirements: [
          '2-4 years React experience',
          'Strong understanding of React hooks',
          'Experience with REST APIs',
          'TypeScript knowledge preferred'
        ],
        status: 'active',
        createdBy: admin._id
      },
      {
        title: 'Backend Developer',
        company: 'DataBridge',
        location: 'Mumbai',
        type: 'Full-time',
        experience: '1-2 Years',
        salary: '₹5-8 LPA',
        description: 'Work with Python, Django, and databases to build robust backend systems.',
        skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
        responsibilities: [
          'Develop REST APIs using Django',
          'Optimize SQL queries',
          'Design database schemas',
          'Write technical documentation'
        ],
        requirements: [
          '1-2 years backend experience',
          'Proficiency in Python and Django',
          'Understanding of SQL databases',
          'Experience with REST concepts'
        ],
        status: 'active',
        createdBy: admin._id
      },
      {
        title: 'UI/UX Designer',
        company: 'Pixelwave',
        location: 'Delhi',
        type: 'Full-time',
        experience: '1-3 Years',
        salary: '₹4-7 LPA',
        description: 'Create delightful digital experiences from wireframes to prototypes.',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        responsibilities: [
          'Create wireframes and mockups',
          'Conduct user research',
          'Define design systems',
          'Present design rationale'
        ],
        requirements: [
          '1-3 years UI/UX experience',
          'Proficiency in Figma or Adobe XD',
          'Strong portfolio',
          'User-centered design mindset'
        ],
        status: 'active',
        createdBy: admin._id
      }
    ]);
    console.log('✅ Jobs created:', jobs.length);

    // Create some applications
    const applications = await Application.create([
      {
        job: jobs[0]._id,
        user: normalUsers[0]._id,
        status: 'pending',
        coverLetter: 'I am excited to apply for this position and contribute to your team.'
      },
      {
        job: jobs[1]._id,
        user: normalUsers[0]._id,
        status: 'reviewed',
        coverLetter: 'With my full-stack experience, I believe I would be a great fit.'
      },
      {
        job: jobs[2]._id,
        user: normalUsers[1]._id,
        status: 'shortlisted',
        coverLetter: 'My React expertise aligns perfectly with your requirements.'
      }
    ]);
    console.log('✅ Applications created:', applications.length);

    // Update application counts
    for (const app of applications) {
      await Job.findByIdAndUpdate(app.job, {
        $inc: { applicationsCount: 1 }
      });
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('─────────────────────────────────');
    console.log('👤 User Login:');
    console.log('   Email: user@test.com');
    console.log('   Password: 123456');
    console.log('\n🛠️  Admin Login:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('─────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// ─── RUN SEED ────────────────────────────────────────────────────
connectDB().then(() => seedDatabase());
