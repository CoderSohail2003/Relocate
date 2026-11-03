# Relocate.

A small, mobile-friendly landing page for students moving to Mumbai for college. Students can share their college and accommodation plans through the relocation enquiry form.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Leave **Root Directory** at the repository root (`.`); this repository contains one Vite frontend project.
3. Keep the Vite framework setting. The project is configured to install with `npm install`, build with `npm run build`, and publish `dist`.
4. Deploy. The included `vercel.json` rewrites direct visits to `/admin` and `/admin/` to the React app.

This is a single-service frontend, so it does not use a separate `client`/`server` multi-service configuration.

This project is a front-end preview only. The admin password and sample enquiries are included in the public client bundle, and the admin sign-in is not secure. Do not use this deployment to protect real student data. Form submissions are not sent or stored automatically.

## Enquiry form

Submitting the form requires consent to be contacted about the relocation enquiry and first asks the student to enter a short, browser-generated CAPTCHA. After it is completed, a confirmation appears and the student can open a pre-filled email draft addressed to `relocate.webapp@gmail.com`. Desktop browsers use Gmail web compose; mobile browsers use the standard `mailto:` handoff so the phone can open its configured mail app. The student can review the message and press **Send**. The notice explains that the site itself does not send or store student details. The contact section also has WhatsApp and tap-to-call links for `+91 97029 66965`.

The CAPTCHA is checked in the browser and is only a light deterrent; it does not provide reliable bot protection. Stronger abuse prevention requires server-side CAPTCHA verification. The site does not send or store form submissions itself; automatic delivery would also require a backend or email service.

## Admin preview

Visit `/admin` to sign in to a recruiter preview with 32 fictional sample enquiries stored in `src/data/sampleApplications.js`. Select an enquiry to preview its details. This is a front-end preview: the password and sample records are bundled with the site, and real form submissions are not saved or available in the admin page. Use server-side authentication and storage before using it with real student data.
