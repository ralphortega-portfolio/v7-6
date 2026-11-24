# ralphortega.pro: website files

Everything in this folder is the finished website. No build step, no installs.

## Put it online (GitHub Pages)
1. Create a new GitHub repository (public), for example `ralphortega-site`.
2. Upload everything in this folder to the repository root (index.html, CNAME, assets, services, privacy and so on).
3. Repository Settings, Pages: Source = "Deploy from a branch", Branch = main, folder = /(root). Save.
4. In the same Pages screen, set Custom domain to `ralphortega.pro` and save.
5. At Hostinger (DNS records for ralphortega.pro):
   - Delete any existing A / AAAA records for the root (@) and any existing CNAME for www.
   - Add four A records for @: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - Optional AAAA records for @: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - Add a CNAME record: name `www`, value `<your-github-username>.github.io`
   - Leave any MX / TXT records alone (they are for email).
6. When GitHub finishes checking the domain (can take up to 24 hours), tick "Enforce HTTPS".
7. In Web3Forms, set the form's Website URL to `ralphortega.pro`.
8. Google Search Console: add the property and submit `https://ralphortega.pro/sitemap.xml`.

## Preview on your computer
Double-click `index.html`. The links between pages work from the folder too.
(The contact form may not deliver from a local file; test it on the live site.)

## What's where
- `index.html`: homepage. `services/*/index.html`: one page per service. `privacy/`: privacy page. `404.html`: not-found page.
- `assets/style.css`, `assets/script.js`: shared design and behavior.
- `assets/images/`: your photos and the sharing image shown when the link is posted on LinkedIn or Facebook.
- `sitemap.xml`, `robots.txt`, `CNAME`, `favicon.svg`: search and domain files.

## Please review
- `privacy/index.html` is a plain-language starter, not legal advice. Check it matches how you handle enquiries, and update it if you add analytics.
