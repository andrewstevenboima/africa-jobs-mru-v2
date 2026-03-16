# 🚀 Deploy Africa Jobs MRU to GitHub Pages

## Option A — GitHub Website (Easiest, no code required)

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** button → **New repository**
3. Name it: `africa-jobs-mru`
4. Set it to **Public**
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Drag and drop **both files**: `index.html` and `README.md`
8. Click **Commit changes**
9. Go to **Settings** → **Pages** (left sidebar)
10. Under **Source**, select **Deploy from a branch**
11. Set Branch to `main`, folder to `/ (root)`
12. Click **Save**
13. Wait ~60 seconds, then your site is live at:
    **`https://YOUR-USERNAME.github.io/africa-jobs-mru`**

---

## Option B — Terminal / Command Line

### Prerequisites
- [Git](https://git-scm.com/downloads) installed
- A GitHub account

### Steps

```bash
# 1. Navigate to the project folder
cd africa-jobs-mru

# 2. Initialise git
git init
git add .
git commit -m "🌊 Launch Africa Jobs MRU platform"

# 3. Create repo on GitHub (go to github.com/new first)
#    Name it: africa-jobs-mru
#    Set to Public, DON'T initialise with README

# 4. Link and push
git remote add origin https://github.com/YOUR-USERNAME/africa-jobs-mru.git
git branch -M main
git push -u origin main

# 5. Enable GitHub Pages
#    Go to: github.com/YOUR-USERNAME/africa-jobs-mru/settings/pages
#    Source: Deploy from branch → main → / (root) → Save
```

### Your live URL will be:
```
https://YOUR-USERNAME.github.io/africa-jobs-mru
```
*(Replace YOUR-USERNAME with your actual GitHub username)*

---

## Option C — GitHub CLI (if you have `gh` installed)

```bash
cd africa-jobs-mru
git init && git add . && git commit -m "🌊 Launch Africa Jobs MRU"
gh repo create africa-jobs-mru --public --push --source=.
# Then enable Pages in Settings → Pages
```

---

## ⏱️ How Long Does It Take?

- **Repo creation**: instant
- **File upload**: < 1 minute
- **Pages going live**: 30–90 seconds after enabling

## 🔄 Updating the Site Later

Whenever you get a new `africa-jobs-mru.html` file from Claude:

1. Rename it to `index.html`
2. Go to your repo on GitHub
3. Click `index.html` → the pencil (edit) icon → **Upload** the new file
4. Commit → site updates in ~60 seconds

Or via terminal:
```bash
cp new-file.html index.html
git add index.html
git commit -m "Update platform"
git push
```
