# nutrifyi

Production static website for **NutriFYI** (*Nourishing people. Powering potential.*), configured for GitHub continuous deployment on Netlify with built-in Netlify Forms.

## Project Structure

```text
07_website/
├── index.html          # Main landing page (with Netlify Forms markup)
├── css/styles.css      # Responsive stylesheet
├── js/main.js          # Navigation, programme selector & AJAX form handler
├── assets/             # Official logo, leaf favicon & editorial photography
├── netlify.toml        # Netlify publish config & security/cache headers
├── robots.txt          # Search engine crawling rules
└── .gitignore          # Excludes .netlify/, .env, and OS artifacts
```

## Local Preview

```bash
python -m http.server 8080
```

Then open http://localhost:8080/ in your browser.

## Deploy to GitHub & Netlify

### 1. Push to GitHub (repo name: `nutrifyi`)
```bash
cd "07_website"
git init
git add .
git commit -m "Initial NutriFYI website release"
git branch -M main
git remote add origin https://github.com/<your-username>/nutrifyi.git
git push -u origin main
```

### 2. Connect to Netlify
1. In the Netlify dashboard, choose **Add new project → Import an existing project → GitHub** and select `nutrifyi`.
2. Netlify reads `netlify.toml` automatically (`publish = "."`, no build command needed).
3. Name the Netlify project **`nutrifyi`** (or your preferred custom domain).

### 3. Enable Netlify Forms & Email Notifications (`webs4biz.lab@gmail.com`)
1. Go to **Forms → Enable form detection** in your Netlify project dashboard, then trigger a **redeploy** so Netlify registers the `contact` form.
2. Go to **Forms → Submission notifications → Add notification → Email notification**:
   - **Event:** New form submission
   - **Form:** `contact`
   - **Email to notify:** `webs4biz.lab@gmail.com` *(confirm the verification email if prompted)*

## Updating the Contact Email Later
When ready to switch from `webs4biz.lab@gmail.com` to `hello@nutrifyi.co.za`:
1. Update the two `mailto:` links in `index.html` and the fallback link in `js/main.js`.
2. Update the email recipient in **Netlify Dashboard → Forms → Submission notifications**.
