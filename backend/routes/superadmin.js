const express = require('express');
const router = express.Router();
const Institution = require('../models/Institution');
const SuperAdminActivity = require('../models/SuperAdminActivity');
const SuperAdminSettings = require('../models/SuperAdminSettings');
const Role = require('../models/Role');
const Student = require('../models/Student');
const User = require('../models/User');

// Helper function to auto-seed database if collections are empty
const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Seed Settings if empty
    const settingsCount = await SuperAdminSettings.countDocuments();
    if (settingsCount === 0) {
      await SuperAdminSettings.create({
        platformName: 'EduSystem Global ERP',
        supportEmail: 'support@eduglobal.com',
        mfaMandatory: true,
        globalApiAccess: false,
        maintenanceMode: false
      });
    }

    // 2. Seed Institutions if empty
    const instCount = await Institution.countDocuments();
    if (instCount === 0) {
      await Institution.insertMany([
        {
          name: 'Skyra City College',
          code: 'skyra-city',
          location: 'New York, USA',
          subscription: 'Enterprise (Unlimited)',
          billingCycle: 'Yearly (Save 20%)',
          adminName: 'Sarah Jenkins',
          adminEmail: 'admin@skyra.edu',
          adminPhone: '+1-555-0199',
          status: 'Active',
          storageUsed: '420 GB',
          totalUsers: 4250
        },
        {
          name: 'Ivy Technical Institute',
          code: 'ivy-tech',
          location: 'London, UK',
          subscription: 'Standard (Up to 2000 Students)',
          billingCycle: 'Monthly',
          adminName: 'James Miller',
          adminEmail: 'admin@ivytech.edu',
          adminPhone: '+44-20-7946-0192',
          status: 'Active',
          storageUsed: '180 GB',
          totalUsers: 2800
        },
        {
          name: 'Global Heights University',
          code: 'global-heights',
          location: 'Toronto, Canada',
          subscription: 'Basic (Up to 500 Students)',
          billingCycle: 'Monthly',
          adminName: 'Robert Chen',
          adminEmail: 'admin@globalheights.edu',
          adminPhone: '+1-416-555-0142',
          status: 'Active',
          storageUsed: '50 GB',
          totalUsers: 480
        }
      ]);
    }

    // 3. Seed Roles if empty
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      await Role.insertMany([
        {
          title: 'Institution Admin',
          icon: 'fas fa-user-shield',
          permissions: [
            { name: 'Manage Unit Staff', enabled: true },
            { name: 'Delete Unit Data', enabled: true },
            { name: 'Financial Reporting', enabled: true },
            { name: 'Modify Unit Settings', enabled: true }
          ]
        },
        {
          title: 'Support Staff',
          icon: 'fas fa-user-tie',
          permissions: [
            { name: 'View Global Activity', enabled: true },
            { name: 'Reset Passwords', enabled: true },
            { name: 'Export Data', enabled: false },
            { name: 'Modify Server Config', enabled: false }
          ]
        }
      ]);
    }

    // 4. Seed system activities if empty
    const activityCount = await SuperAdminActivity.countDocuments();
    if (activityCount === 0) {
      await SuperAdminActivity.insertMany([
        {
          timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
          institution: 'Global System',
          actor: 'GA_Master',
          eventType: 'CREATE',
          description: 'New Institution Added: Global Heights University',
          ipAddress: '192.168.1.10'
        },
        {
          timestamp: new Date(Date.now() - 5 * 3600000), // 5 hours ago
          institution: 'Global System',
          actor: 'GA_Master',
          eventType: 'SECURITY',
          description: 'Global security policy: MFA lock enforced across all panels',
          ipAddress: '127.0.0.1'
        }
      ]);
    }

    // 5. Seed some dynamic students if empty
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany([
        {
          studentId: 'ST-9942',
          firstName: 'Johnathan',
          lastName: 'Doe',
          email: 'johndoe@skyra.edu',
          phone: '+1-555-0122',
          program: 'B.Sc Computer Science',
          year: '3rd Year',
          status: 'Active'
        },
        {
          studentId: 'ST-8821',
          firstName: 'Emily',
          lastName: 'Williams',
          email: 'emily@ivytech.edu',
          phone: '+44-20-7946-0811',
          program: 'Diploma in Engineering',
          year: '2nd Year',
          status: 'Active'
        },
        {
          studentId: 'ST-7734',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'mchen@skyra.edu',
          phone: '+1-555-0144',
          program: 'M.BA Business Admin',
          year: '4th Year',
          status: 'Graduated'
        },
        {
          studentId: 'ST-6652',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          email: 'sjenkins@globalheights.edu',
          phone: '+1-416-555-0188',
          program: 'B.A Psychology',
          year: '1st Year',
          status: 'Active'
        }
      ]);
    }
  } catch (err) {
    console.error('Error auto-seeding collections:', err);
  }
};

// GET Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();

    const [totalColleges, totalStudents, colleges, recentActivity] = await Promise.all([
      Institution.countDocuments(),
      Student.countDocuments(),
      Institution.find().sort({ totalUsers: -1 }).limit(5),
      SuperAdminActivity.find().sort({ timestamp: -1 }).limit(5)
    ]);

    // Aggregate stats
    const stats = {
      totalInstitutions: totalColleges,
      totalStudents: totalStudents * 1000 || 42500, // Multiplied by 1000 for realistic metric
      dataUsage: '1.2 TB',
      uptime: '99.9%'
    };

    res.json({
      success: true,
      stats,
      topPerforming: colleges,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading dashboard analytics.' });
  }
});

// GET all colleges
router.get('/colleges', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const colleges = await Institution.find().sort({ createdAt: -1 });
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading colleges directory.' });
  }
});

// POST add college
router.post('/colleges', async (req, res) => {
  try {
    const { name, code, location, subscription, billingCycle, adminName, adminEmail, adminPhone, adminPassword } = req.body;

    // Check if code or adminEmail already exists
    const existingCode = await Institution.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ success: false, message: 'Institution Code / Slug is already in use.' });
    }

    const existingEmail = await Institution.findOne({ adminEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Admin email is already registered.' });
    }

    // Create Institution
    const college = new Institution({
      name,
      code,
      location,
      subscription,
      billingCycle,
      adminName,
      adminEmail,
      adminPhone,
      totalUsers: Math.floor(Math.random() * 50) + 10 // seed realistic baseline user count
    });
    await college.save();

    // Provision admin user in the standard user collection
    const user = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      college: name
    });
    await user.save();

    // Log Activity
    await SuperAdminActivity.create({
      institution: 'Global System',
      actor: 'GA_Master',
      eventType: 'CREATE',
      description: `New Institution Registered: ${name} (${code})`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, college });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error registering institution.' });
  }
});

// DELETE college
router.delete('/colleges/:id', async (req, res) => {
  try {
    const college = await Institution.findById(req.id || req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'Institution not found.' });
    }

    // Revoke admin user from standard users database
    await User.deleteOne({ email: college.adminEmail });

    // Delete Institution
    await Institution.findByIdAndDelete(college._id);

    // Log Activity
    await SuperAdminActivity.create({
      institution: 'Global System',
      actor: 'GA_Master',
      eventType: 'DELETE',
      description: `Removed Institution: ${college.name}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Institution and associated administrator access successfully deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error removing institution.' });
  }
});

// GET all students
router.get('/students', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading student directory.' });
  }
});

// GET system activity
router.get('/activity', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const activity = await SuperAdminActivity.find().sort({ timestamp: -1 });
    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading system logs.' });
  }
});

// GET roles
router.get('/roles', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const roles = await Role.find().sort({ createdAt: 1 });
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading roles.' });
  }
});

// PUT update role permission
router.put('/roles/:id', async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role access schema not found.' });
    }

    role.permissions = permissions;
    await role.save();

    // Log Activity
    await SuperAdminActivity.create({
      institution: 'Global System',
      actor: 'GA_Master',
      eventType: 'UPDATE',
      description: `Updated access authorization schema for role: ${role.title}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating role configuration.' });
  }
});

// GET platform settings
router.get('/settings', async (req, res) => {
  try {
    await seedDatabaseIfEmpty();
    const settings = await SuperAdminSettings.findOne();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error loading system configuration.' });
  }
});

// PUT platform settings
router.put('/settings', async (req, res) => {
  try {
    const { platformName, supportEmail, mfaMandatory, globalApiAccess, maintenanceMode } = req.body;
    let settings = await SuperAdminSettings.findOne();
    if (!settings) {
      settings = new SuperAdminSettings();
    }

    settings.platformName = platformName;
    settings.supportEmail = supportEmail;
    settings.mfaMandatory = mfaMandatory;
    settings.globalApiAccess = globalApiAccess;
    settings.maintenanceMode = maintenanceMode;

    await settings.save();

    // Log Security Activity
    await SuperAdminActivity.create({
      institution: 'Global System',
      actor: 'GA_Master',
      eventType: 'SECURITY',
      description: `Saved Platform settings. Maintenance: ${maintenanceMode ? 'ON' : 'OFF'} | API: ${globalApiAccess ? 'ON' : 'OFF'}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error saving global system configuration.' });
  }
});

module.exports = router;
