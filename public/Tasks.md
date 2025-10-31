# UI:DB:CODE (MVP)

# Landing Page 
- Headless CMS
- Resend/Nodemailer

# Auth 
- UI
- Link

# Dashboard
- Notes Actually Value + UI
- Pricing Page Redirection + Pricing Stripe + Card (genuine)
- Subscription Based (Free) + Pricing + Subscription Ended Popup + (Upgrade)

- Seperate suggestions functionality
- Add Options of Delete
- Remove Unused note
- Flow Cleanup e2e
- DB Understand and Fix
- Test: Stripe + Webhook


# Build 
- Sitmap note in app
- Clerk Production - Custom Domain



PostHog

Install Dependiencsis froom posthog website
Conifg fiilw with .env
Wrap In Layout.tsx
Hokks and Providers

Imolent in neeed

import { usePostHog } from "@/hooks/use-posthog";
const { capture } = usePostHog();
onClick={() =>
capture("cta_clicked", {
button: "get_started",
location: "landing_page",
})
</button>



File Config file
Dashboard




