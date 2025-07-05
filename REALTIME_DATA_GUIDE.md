# Real-Time Data Management System

This system allows you to edit your website content locally and deploy changes to Vercel.

## How It Works

### For Visitors
- Website is hosted on Vercel (always accessible at your-site.vercel.app)
- Shows current content from JSON files
- Fast loading, professional hosting

### For Owner (You)
- Turn on your laptop when you want to edit content
- Access admin panel at `http://localhost:3000/admin`
- Edit content through user-friendly interface
- Push changes to update live site

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access Admin Panel
- Open `http://localhost:3000/admin` 
- **Enter password**: Use the value from `OWNER_SECRET` in your .env.local file
- Only works when running locally
- Edit content, vault documents, etc.

### 4. Deploy to Vercel
```bash
# First time setup
npm install -g vercel
vercel login

# Deploy
vercel --prod
```

### 5. Update Live Site
When you make changes:
1. Edit content locally via admin panel
2. Commit changes: `git add . && git commit -m "Update content"`
3. Push to GitHub: `git push`
4. Vercel automatically deploys new version

## File Structure

```
src/data/
├── vault-documents.json     # Your vault content
├── site-content.json        # Hero text, about info
└── ...

src/app/
├── admin/                   # Local admin interface
├── api/data/                # API for reading/writing JSON
└── ...
```

## Admin Features

### Content Editor
- Edit hero title/subtitle
- Update about page content
- Real-time preview

### Vault Manager
- Add/edit/delete documents
- Organize with tags
- Import/export functionality

## Workflow

### Daily Usage
1. **Visitors**: Always see latest content on your-site.vercel.app
2. **Editing**: When you want to edit, open laptop → run `npm run dev` → go to localhost:3000/admin
3. **Publishing**: Make changes → git commit → git push → Vercel deploys

### Benefits
- ✅ Website always accessible (24/7)
- ✅ Easy local editing when needed
- ✅ Professional hosting on Vercel
- ✅ Version control of all changes
- ✅ No database complexity

## API Endpoints

- `GET /api/data?type=vault-documents` - Get vault documents
- `GET /api/data?type=site-content` - Get site content
- `POST /api/data` - Update data (localhost only)

## Security

- 🔐 **Password Protection**: Admin panel uses OWNER_SECRET from .env.local
- 🏠 **Localhost Only**: Admin interface only works on localhost
- 🚫 **API Protection**: Data updates blocked in production
- 📁 **File-based Storage**: All data stored in version-controlled JSON files
- 🔒 **Session Management**: 24-hour session timeout
- 🌍 **Environment Variable**: Password stored securely in .env.local

### Changing Admin Password
1. Update `OWNER_SECRET=your_new_password` in .env.local
2. Restart development server
3. Use new password to login

## Troubleshooting

### Admin Panel Not Loading
- Make sure you're accessing `http://localhost:3000/admin`
- Check that dev server is running
- Admin only works in development mode

### Changes Not Saving
- Verify you're running in development mode
- Check console for error messages
- Ensure JSON files are writable

### Deploy Issues
- Verify Vercel CLI is installed
- Check that all changes are committed to git
- Review Vercel deployment logs

## Commands Quick Reference

```bash
# Start development
npm run dev

# Deploy to Vercel
vercel --prod

# Commit changes
git add .
git commit -m "Update content"
git push
```
